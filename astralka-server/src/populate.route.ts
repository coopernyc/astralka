import {MongoClient, UpdateResult} from "mongodb";
import {call_ai} from "./common";
import moment from "moment";
import _ from "lodash";

export async function populateRoute(req: any, res: any): Promise<void> {

    const username = req.body.username;
    const uri: string = process.env.MONGO_URI!;
    const client = new MongoClient(uri);

    const prompt = `
        To draw an astrological natal chart for random 50 famous people, with public data available, and time of birth is known, and max 3 words for description and escape strings, date format is 'DD MMMM YYYY hh:mm a' provide the following information in a json format: {people: [{ name: "Sasha", description: "Programmer", gender: Male, dob: "01 April 1970 10:20 am", place: "Podolsk, Russia", latitude: 54.3455N, longitude: 37.3455E, elevation: 128m, UT_offset: 3 }]}
    `;


    async function run() {
        try {
            const result = await call_ai(prompt, true, 8192 * 2);

            const obj = JSON.parse(result);
            const remapped = obj.people.reduce((acc: any[], p: any) => {
                const latitude = _.endsWith(p.latitude, "N")
                    ? _.toNumber(p.latitude.replace("N", ""))
                    : -_.toNumber(p.latitude.replace("S", ""));
                const longitude = _.endsWith(p.longitude, "E")
                    ? _.toNumber(p.longitude.replace("E", ""))
                    : -_.toNumber(p.longitude.replace("W", ""));

                const dob = moment(p.dob, "DD MMMM YYYY hh:mm a");
                if (!dob.isValid()) {
                    console.log(`--- SKIPPING ${p.name} --- CANNOT PARSE DATE [${p.dob}]`);
                    return acc;
                }

                acc.push({
                    name: p.name,
                    description: p.description,
                    gender: p.gender === 'Male' ? 1 : 0, // 1 - Male, 0 - Female
                    date: dob.format("YYYY-MM-DD HH:mm:ss"),
                    dateUT: moment.utc(p.dob, "DD MMMM YYYY hh:mm a").add(-p.UT_offset, 'hours').format("YYYY-MM-DD HH:mm:ss"),
                    createdBy: 'cooper',
                    scope: 0, // public
                    timezone: p.UT_offset,
                    createdDate: new Date(),
                    updatedBy: 'cooper',
                    updatedDate: new Date(),
                    location: {
                        elevation: p.elevation.replace('m', ''),
                        latitude,
                        longitude,
                        name: p.place
                    }
                });
                return acc;
            }, []);


            const database = client.db("astralka");
            const users = database.collection("users");
            const people = database.collection("people");

            const user = await users.findOne({username, enabled: true});
            if (!user) {
                res.status(400).end('User not found');
                return;
            }


            let count: number = 0;
            for (let i = 0; i < remapped.length; i++) {
                const p: any = remapped[i];

                const res: UpdateResult<Document> = await people.updateOne({
                    name: p.name
                }, {
                    $setOnInsert: p
                }, {
                    upsert: true
                });
                count += res.upsertedCount;
                if (res.upsertedCount > 0) {
                    console.log(`--- INSERTED ONE --- ${p.name}`);
                }
            }

            const total: number = await people.countDocuments({});

            console.log(` --- TOTAL ${total} ---`);

            res.json({result: {inserted: count, total: total}});
        } catch (err) {
            console.log(err);
        } finally {
            await client.close();
        }
    }

    run().catch(console.dir);

}