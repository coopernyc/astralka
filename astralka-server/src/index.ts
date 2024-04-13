import express, { Express, NextFunction, Request, Response } from "express";
import winston from "winston";
import { natal_chart_data } from "./api";
import _ from "lodash";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import { call_ai } from "./common";
import { HouseSystem } from "./constants";

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

app.use(cors());
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

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
app.get("/hsys", async (req: Request, res: Response, next: NextFunction) => {
    res.json(_.map(HouseSystem, (v, k) => v));
    next();
});
app.get("/natal", async (req: Request, res: Response, next: NextFunction) => {
    let year: number = _.get(req.query, "y", 1970) as number;
    let month: number = _.get(req.query, "m", 4) as number;
    let day: number = _.get(req.query, "d", 1) as number;
    let hour: number = _.get(req.query, "h", 7) as number;
    let minutes: number = _.get(req.query, "m", 20) as number;
    let seconds: number = _.get(req.query, "s", 0) as number;
    let longitude: number = _.get(req.query, "long", 0) as number;
    let latitude : number = _.get(req.query, "lat", 0) as number;
    let elevation: number = _.get(req.query, "elv", 0) as number;
    let hsys: string = _.get(req.query, "hsys", "P") as string;
    
    let name: string = _.get(req.query, "name", "") as string;    
    let data: any = { Name: name};
    let nc: any = {};
    switch (name) {
        case "Sasha": 
            nc = natal_chart_data(1970, 4, 1, 7, 20, 0, 37.545556, 55.431111, 160, hsys);
            break;
        case "Lana": 
            nc = natal_chart_data(1973, 11, 21, 2, 0, 0, 40.500, 54.067, 156, hsys);
            break;
        case "Jenna": 
            nc = natal_chart_data(2004, 2, 15, 0, 33, 0, -73.949997, 40.650002, 10, hsys);
            break;
        case "Maria": 
            nc = natal_chart_data(2001, 11, 26, 10, 27, 0, -73.935242, 40.730610, 10, hsys);
            break;
        case "Samantha": 
            nc = natal_chart_data(2010, 4, 15, 0, 58, 0, -73.935242, 40.730610, 10, hsys);
            break;
        default: 
            nc = natal_chart_data(year, month, day, hour, minutes, seconds, longitude, latitude, elevation, hsys);
    }
  
    res.json(_.merge(data, nc, {
        query: req.query
    }));
});

app.post("/explain", async (req: Request, res: Response, next: NextFunction ) => {
    const prompt = _.get(req.body, "prompt");   
    console.log(prompt); 
    let result = "";
    try {
        result = await call_ai(prompt);
    } catch(err: any) {
        console.log(err?.message);
    }
    console.log('result', result);
    res.json({ result });
});


app.listen(port, () => {
    console.log(`[server]: Astralka Server is listening on http://localhost:${port}`);
});