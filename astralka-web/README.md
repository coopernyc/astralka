# Astralka-Web
The project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.0.

<img alt="scorpio" src="https://github.com/coopernyc/astralka/assets/11201225/9fc32844-c87c-429d-a6f6-43b1623c62d7" width="320" height="400" />

## Installation

````
> cd astralka-web
> sudo npm install
````

Update **config.json** file in **src/assets** folder, if necessary

````
{
    "server": "http://localhost:3010",
    
    // add rotate images if you want Zodiac or Planet or Aspect rotating image 
    // in AI explanation area
    
    "rotate_images": {
      "imageLoaderUrl": "http://localhost:3010/images"
    }
}
````

## Running the Web app 

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

If you want to run shared in local network replace localhost on 0.0.0.0 and

`ng serve --host 0.0.0.0`

change package.json and config.json.

The application will automatically reload if you change any of the source files.
