import {MongoClient} from "mongodb";

async function signup(username: string, password: string, email: string, firstname: string, lastname: string): Promise<any> {
    let result: any = {
        success: false,
        exists: false
    };
    const uri: string = process.env.MONGO_URI!;
    const client = new MongoClient(uri);
    try {
        const database = client.db("astralka");
        const users = database.collection("users");

        const found = await users.findOne({
            username
        });
        if (found) {
            result = {
                success: false,
                exists: true
            };
        } else {
            await users.updateOne(
                {
                    username
                },{
                    $setOnInsert: {
                        username,
                        password,
                        enabled: true,
                        isLoggedIn: false,
                        lastUpdateDate: new Date(),
                        roles: [
                            'User'
                        ],
                        firstname,
                        lastname,
                        email
                    }
                },
                {
                    upsert: true
                });
            result = {
                success: true,
                exists: true
            };
        }
    } catch(err) {
        console.log(err);
    }
    finally {
        await client.close();
    }
    return result;
}
export async function signupRoute(req: any, res: any): Promise<void> {
    // need capture
    const signupStatus: any = await signup(
        req.body.username,
        req.body.password,
        req.body.email,
        req.body.firstname,
        req.body.lastname
    );
    if (!signupStatus.success) {
        if (signupStatus.exists) {
            res.status(400).end('Username already exists');
        } else {
            res.status(400).end('Cannot create account');
        }
    } else {
        res.json({success: true});
    }
}