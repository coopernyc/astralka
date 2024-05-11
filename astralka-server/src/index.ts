import express, {Express, NextFunction, Request, Response} from "express";
import winston from "winston";
import {chart_data} from "./api";
import _ from "lodash";
import cors from "cors";
import bodyParser from "body-parser";
import {call_ai} from "./common";
import {MongoClient} from "mongodb";
import {loginRoute} from "./login.route";
import {signupRoute} from "./signup.route";
import {imagesRoute} from "./images.route";

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
    origin: process.env.CORS_ORIGINS!.split(", "),
    credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({extended: true})) // for parsing application/x-www-form-urlencoded

if (process.env.IMAGES_DIR) {
    console.log(`Images are statically served from /images -> ${process.env.IMAGES_DIR}`);
    app.use('/static', express.static(process.env.IMAGES_DIR));
}

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

app.get("/images", async (req: Request, res: Response, next: NextFunction) => {
    try {
        await imagesRoute(req, res);
    } catch (err) {
        res.status(500).end();
    }
});

// this rout used for service purposes of creating astralka-images
// app.get("/img", async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         await imgRoute(req, res);
//     } catch (err) {
//         res.status(500).end();
//     }
// });

app.post('/signin', cors(corsOptions), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await loginRoute(req, res);
    } catch (err) {
        res.status(500).end();
    }
});

app.post('/signup', cors(corsOptions), async (req: Request, res: Response, next: NextFunction) => {
    try {
        await signupRoute(req, res);
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
    //console.log(prompt);
    let result = "";
    try {
        result = await call_ai(prompt);
    } catch (err: any) {
        console.log(err?.message);
    }
    //console.log('result', result);
    //console.log('result', result);
    res.json({result});
});

app.post("/remove", cors(corsOptions), async (req: Request, res: Response, next: NextFunction) => {
    let load = req.body;
    //console.log(load);

    const uri: string = process.env.MONGO_URI!;
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db("astralka");
            const people = database.collection("people");
            const user_people = database.collection("user_people");
            const users = database.collection("users");

            const username = load.username;
            const user = await users.findOne({username, enabled: true });
            if (!user) {
                res.status(400).end('User not found');
                return;
            }
            if (load.scope === 0 && !_.includes(user.roles, "Administrator")) {
                res.status(400).end('Cannot remove public person information');
                return;
            }
            await user_people.deleteMany({
                name: load.name,
                user: username
            });
            await people.deleteMany({
                name: load.name,
                createdBy: username,
            });
            res.json({ success: true });
        }
        finally {
            await client.close();
        }
    }
    run().catch(console.dir);
});

app.post("/save", cors(corsOptions), async (req: Request, res: Response, next: NextFunction) => {
    let entry = req.body;
    //console.log(entry);

    const uri: string = process.env.MONGO_URI!;
    const client = new MongoClient(uri);

    async function run() {
        try {
            const database = client.db("astralka");
            const people = database.collection("people");
            const user_people = database.collection("user_people");
            const users = database.collection("users");

            const username = entry.username;
            const user = await users.findOne({username, enabled: true });
            if (!user) {
                res.status(400).end('User not found');
                return;
            }
            if (entry.scope === 0 && !_.includes(user.roles, "Administrator")) {
                res.status(400).end('Cannot update public person information');
                return;
            }

            entry = _.omit(entry, 'username');
            const insertFields = {
                createdBy: username,
                createdDate: new Date()
            };
            const updateFields = _.assign({}, _.omit(entry, 'createdBy', 'createdDate'), {
                updatedBy: username,
                updatedDate: new Date()
            });

            // upsert in People
            await people.updateOne({
                    name: entry.name,
                    createdBy: username
                },
                {
                    // update
                    $set: {
                        ...updateFields
                    },
                    // insert
                    $setOnInsert: {
                        ...insertFields
                    }
                },
                {
                    upsert: true
                });

            if (entry.scope === 1) {
                // if Private (1) person - upserting
                await user_people.updateOne({
                    name: entry.name,
                    user: username
                }, {
                    $setOnInsert: {
                        name: entry.name,
                        user: username
                    }
                }, {
                    upsert: true
                });
            } else {
                // if Public (0) person - delete from user_people
                await user_people.deleteMany({
                    name: entry.name
                });
            }

            res.json({ success: true });
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);
});

app.post("/people", cors(corsOptions), async (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name;
    const username = req.body.username;

    //console.log(`search [${name}] for ${username}`);

    if (_.isEmpty(name)) {
        res.json([]);
        return;
    }
    const uri: string = process.env.MONGO_URI!;
    const client = new MongoClient(uri);
    let result: any[] = [];

    async function run() {
        try {
            const database = client.db("astralka");
            const people = database.collection("people");
            //result = await people.find({name: {$regex: name, $options: "i"}}).toArray();

            const cursor = people.aggregate([
                {
                    $lookup: {
                        from: "user_people",
                        let: { people_name: "$name", people_user: "$createdBy" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            {$eq: [ "$name", "$$people_name" ] },
                                            {$eq: [ "$user", "$$people_user" ] },
                                            {$eq: [ "$user", username ]}
                                        ]
                                    }
                                }
                            },
                            { $project: { name: 0, user: 0 } }
                        ],
                        as: "joined"
                    }
                },
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $regexMatch: { input: "$name", regex: name, options: "i" } },
                                {
                                    $or: [
                                        {$eq: ["$scope", 0] },
                                        {$ne: ["$joined", []]}
                                    ]
                                }
                            ]
                        }
                    }
                },
                {
                    $sort: { scope: -1, updatedDate: -1 }
                }
            ]);

            for await (const doc of cursor) {
                result.push(doc);
            }

        } finally {
            await client.close();
            //console.log('result', result);
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
            const user_people = database.collection("user_people");
            const users = database.collection("users");

            await people.createIndex({
                    "name": 1,
                    "createdBy": 1
                },
                {
                    name: "people_unique_index",
                    unique: true
                });
            await user_people.createIndex({
                    "name": 1,
                    "user": 1
                },
                {
                    name: "user_people_unique_index",
                    unique: true
                });
            await users.createIndex({
                    "username": 1
                },
                {
                    name: "users_unique_index",
                    unique: true
                });
        } finally {
            await client.close();
        }
    }
}

run().catch(console.dir);