# Astralka-Server
The server is node express REST server
## Installation
1. Install Node.js. See [here](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
2. Install mongoDb. See [here](https://www.mongodb.com/docs/manual/installation/)
3. Install astralka-server
````
> cd astralka-server
> sudo npm install
````

[!TIP] on Windows, if you run into some errors about msvc for node >= 18, search and run Install Additional tools for Node.js batch file.

[!TIP] on Windows, You would need to downgrade from python from 3.11+ to 3.10.x. You can have several version, don't forget to check option Add Python to Path when installing. One way is to make in Environment Variables -> Path make 3.10 paths to be before any other versions in the list.

4. Create **.env** file in the root folder, add lines:
````
API_KEY=[YOUR GEMINI AI API KEY]
MONGO_URI=mongodb://[YOUR MONGODB URL]
CORS_ORIGINS=http://192.168.xxx.xxx:4200, http://localhost:4200
ADMIN_USERNAME=[ADMIN USERNAME]
ADMIN_PASSWORD=[ADMIN PASSWORD]
PORT=[SERVER PORT] (if port is omited, default 3010)
````
## Running the server
Run `npm run once` to start server. 
Run `npm start` to start dev server with live reload.

