# Astralka Project #
![9cc0af38-16c9-4f72-b156-e3e6a650628d](https://github.com/coopernyc/astralka/assets/11201225/5fd9ffcb-453b-43eb-9b7f-729b2dc914a2)  
<img width="585" alt="Maria" src="https://github.com/coopernyc/astralka/assets/11201225/cdab3321-f0f1-4364-99ae-8f7f79eb84f2">

> [!WARNING]
> In Development

## Installation ##

cd to astralka-server and run `npm install`

update `src/config.json`

```
{
    "server": "http://[ASTRALKA SERVER IP]:[ASTRALKA SERVER PORT]"
}
```

> [!TIP]
> on Windows, if you run into some errors about msvc for node >= 18, search and run `Install Additional tools for Node.js` batch file.

run server with `npx ts-node src/index.ts`

cd to astralka-web and run `npm install`
then run dev with `ng serve`.
