# Astralka-Server
The server is node express REST server


<img alt="scorpio" src="https://github.com/coopernyc/astralka/assets/11201225/6e488b8e-0bba-442b-a61e-8730cbcbac73" width="320" height="400" />

## Installation
1. Install Node.js. See [here](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs)
2. Install mongoDb. See [here](https://www.mongodb.com/docs/manual/installation/)
3. Install astralka-server
    ````
    > cd astralka-server
    > sudo npm install
    ````
4. Create **.env** file in the root folder, add lines:
    ````
    API_KEY=[YOUR GEMINI AI API KEY]
    MONGO_URI=mongodb://[YOUR MONGODB URL]
    CORS_ORIGINS=http://192.168.xxx.xxx:4200, http://localhost:4200
    ADMIN_USERNAME=[ADMIN USERNAME]
    ADMIN_PASSWORD=[ADMIN PASSWORD]
    PORT=[SERVER PORT] (if port is omited, default 3010)
    EPHE_DIR=[PATH_TO_epche (see comment below), if omited the ./node_modeules/swisseph/ephe will be used] 
    IMAGES_DIR=[PATH_TO_astralka-images]
    ````
You can download full swisseph ephemerides (ephe folder) from [here](https://github.com/aloistr/swisseph/tree/master)
You can download astralka-images from [https://github.com/coopernyc/astralka-images](https://github.com/coopernyc/astralka-images), or
you can generate your own images based on the same folder structure.

## Running the server
Run `npm run once` to start server. 
Run `npm start` to start dev server with live reload.

