import express, {Express, NextFunction, Request, Response} from "express";
import winston from "winston";
import {chart_data} from "./api";
import _ from "lodash";
import cors from "cors";
import bodyParser from "body-parser";
import {call_ai} from "./common";
import {MongoClient} from "mongodb";
import {loginRoute} from "./login.route";

const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(
            (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
    ),
    transports: [
        new winston.transports.Console()
    ]
});

const app: Express = express();
const port = process.env.PORT || 3010;
console.log(process.env.CORS_ORIGINS!.split(", "));
const corsOptions = {
    origin: process.env.CORS_ORIGINS!.split(", "), // ['http://192.168.1.68:4200', 'http://localhost:4200'],
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

app.use((req: Request, res: Response, next: NextFunction) => {
    logger.info(`Received a ${req.method} request for ${req.url}`);
    next();
});
app.use((err: any, req: any, res: any, next: any) => {
    // Log the error message at the error level
    logger.error(err.message);
    res.status(500).send();
});
app.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.send("Astralka Server");
    next();
});

app.post('/signin', cors(corsOptions), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await loginRoute(req, res);
    } catch (err) {
        res.status(500).end();
    }
});

app.post('/signout', cors(corsOptions), async (req: Request, res: Response, next: NextFunction) => {
    const uri: string = process.env.MONGO_URI!;
    const client = new MongoClient(uri);
    async function run() {
        try {
            const database = client.db("astralka");
            const users = database.collection("users");
            await users.updateOne({
                    username: req.body.username
                },
                {
                    $set: {
                        isLoggedIn: false,
                        lastUpdateDate: new Date()
                    }
                },
                {
                    upsert: true
                });
            res.json({ success: true });
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});

app.post("/chart-data", cors(corsOptions), async (req: Request, res: Response, next: NextFunction) => {
    const query = req.body;
    const data = chart_data(query);
    res.json(data);
});
app.post("/explain", cors(corsOptions), async (req: Request, res: Response, next: NextFunction) => {
    const prompt = _.get(req.body, "prompt");
    console.log(prompt);
    let result = "";
    try {
        result = await call_ai(prompt);
    } catch (err: any) {
        console.log(err?.message);
    }
    console.log('result', result);
    res.json({result});
});

app.post("/save", cors(corsOptions), async (req: Request, res: Response, next: NextFunction) => {
    const entry = req.body;
    console.log(entry);

    const uri: string = process.env.MONGO_URI!;
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db("astralka");
            const people = database.collection("people");
            await people.updateOne({
                    name: entry.name
                },
                {
                    $set: {
                        ...entry
                    }
                },
                {
                    upsert: true
                });
            res.json({ success: true });
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});

app.post("/people", cors(corsOptions), async (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name ?? "";
    console.log(name);
    if (_.isEmpty(name)) {
        res.json([]);
        return;
    }
    const uri: string = process.env.MONGO_URI!;
    const client = new MongoClient(uri);
    let result: any[];

    async function run() {
        try {
            const database = client.db("astralka");
            const people = database.collection("people");
            result = await people.find({name: {$regex: name, $options: "i"}}).toArray();
        } finally {
            await client.close();
            console.log('result', result);
            res.json(result);
        }
    }

    run().catch(console.dir);
});

app.listen(port, () => {
    console.log(`[server]: Astralka Server is listening on http://localhost:${port}`);
});

async function run() {
    const uri: string = process.env.MONGO_URI!;
    if (uri) {
        const client = new MongoClient(uri);

        try {
            const database = client.db("astralka");
            const people = database.collection("people");
            await people.createIndex({
                    "name": 1
                },
                {
                    unique: true
                });
        } finally {
            await client.close();
        }
    }
}

run().catch(console.dir);