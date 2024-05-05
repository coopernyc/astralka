import { RateLimiterMongo } from "rate-limiter-flexible";
import {MongoClient, MongoClientOptions} from "mongodb";

const uri: string = process.env.MONGO_URI!;
const mongoOpts: MongoClientOptions = {
    maxPoolSize: 50,
};
const mongoConnection = MongoClient.connect(uri, mongoOpts);
const maxWrongAttemptsByIPperDay = 100;
const maxConsecutiveFailsByUsernameAndIP = 10;
const limiterSlowBruteByIP = new RateLimiterMongo({
    storeClient: mongoConnection,
    keyPrefix: 'login_fail_ip_per_day',
    points: maxWrongAttemptsByIPperDay,
    duration: 60 * 60 * 24,
    blockDuration: 60 * 60 * 24, // Block for 1 day, if 100 wrong attempts per day
});
const limiterConsecutiveFailsByUsernameAndIP = new RateLimiterMongo({
    storeClient: mongoConnection,
    keyPrefix: 'login_fail_consecutive_username_and_ip',
    points: maxConsecutiveFailsByUsernameAndIP,
    duration: 60 * 60 * 24 * 90, // Store number for 90 days since first fail
    blockDuration: 60 * 60, // Block for 1 hour
});
const getUsernameIPkey = (username: string, ip: string) => `${username}_${ip}`;
interface IUserLoginStatus {
    isLoggedIn: boolean;
    exists: boolean;
}
async function authorise(username: string, password: string): Promise<IUserLoginStatus> {
    let result: IUserLoginStatus = {
        isLoggedIn: false,
        exists: false
    };
    const uri: string = process.env.MONGO_URI!;
    const client = new MongoClient(uri);
    try {
        const database = client.db("astralka");
        const users = database.collection("users");

        // add default user if it's no already exists
        await users.updateOne(
            {
                username: process.env.USERNAME
            },{
                $setOnInsert: {
                    username: process.env.USERNAME,
                    password: process.env.PASSWORD,
                    enabled: true,
                    isLoggedIn: false,
                    lastUpdateDate: new Date()
                }
            },
            {
                upsert: true
            });

        let found = await users
            .findOneAndUpdate(
                {username, password, enabled: true },
                { $set: { isLoggedIn: true, lastUpdateDate: new Date() } },
                { returnDocument: "after" });

        if (found) {
            result = {
                isLoggedIn: true,
                exists: true
            };
        } else {
            found = await users.findOne({username, enabled: true});
            if (found) {
                result = {
                    isLoggedIn: false,
                    exists: true
                };
            }
        }
    }
    catch(err) {
        console.log(err);
    }
    finally {
        await client.close();
    }
    return result;

}

export async function loginRoute(req: any, res: any): Promise<void> {
    const ipAddr = req.ip;
    const usernameIPkey = getUsernameIPkey(req.body.username, ipAddr);
    const [resUsernameAndIP, resSlowByIP] = await Promise.all([
        limiterConsecutiveFailsByUsernameAndIP.get(usernameIPkey),
        limiterSlowBruteByIP.get(ipAddr),
    ]);
    let retrySecs = 0;

    // Check if IP or Username + IP is already blocked
    if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
        retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
    } else if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > maxConsecutiveFailsByUsernameAndIP) {
        retrySecs = Math.round(resUsernameAndIP.msBeforeNext / 1000) || 1;
    }

    if (retrySecs > 0) {
        res.set('Retry-After', String(retrySecs));
        res.status(429).send('Too Many Requests');
    } else {
        const user: IUserLoginStatus = await authorise(req.body.username, req.body.password); // should be implemented in your project
        if (!user.isLoggedIn) {
            // Consume 1 point from limiters on wrong attempt and block if limits reached
            try {
                const promises = [limiterSlowBruteByIP.consume(ipAddr)];
                if (user.exists) {
                    // Count failed attempts by Username + IP only for registered users
                    promises.push(limiterConsecutiveFailsByUsernameAndIP.consume(usernameIPkey));
                }
                await Promise.all(promises);
                res.status(400).end('username or password is wrong');
            } catch (rlRejected: any) {
                if (rlRejected instanceof Error) {
                    throw rlRejected;
                } else {
                    res.set('Retry-After', String(Math.round(rlRejected.msBeforeNext / 1000)) || 1);
                    res.status(429).send('Too Many Requests');
                }
            }
        } else {
            if (resUsernameAndIP !== null && resUsernameAndIP.consumedPoints > 0) {
                // Reset on successful authorisation
                await limiterConsecutiveFailsByUsernameAndIP.delete(usernameIPkey);
            }
            res.json({authorized: true});
        }
    }
}
