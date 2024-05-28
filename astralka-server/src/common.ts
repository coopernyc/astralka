import { AstralkaConfig } from "./constants";
import { IAspect, IAspectDef, IChartObject, IHouse, IDignities as Dignities, ISkyObject } from "./interfaces";
import _ from "lodash";
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY!);

export class House implements IHouse {
    public position: number;
    public name: string;
    public symbol: string;
    public label: string;
    public index: number;

    constructor(conf: any) {
        this.position = conf.position;
        this.name = conf.name;
        this.symbol = conf.symbol;
        this.label = _.get(conf, "label", conf.name);
        this.index = conf.index;
    }    
}

export class Planet implements ISkyObject {
    public position: number;
    public speed: number;
    public declination: number;
    public name: string;
    public symbol: string;
    public label: string;
    public dignities: Dignities | undefined = undefined;
    public swisseph_id: number;
    public house: IHouse | undefined;
    public oriental: boolean = false;
    constructor(name: string) {
        const conf: any = _.find(_.get(AstralkaConfig, "Planets", []), (x: any) => x.name === name);
        if (!conf) {
            throw new Error(`${name} is not defined in configuration`);
        }
        this.name = conf.name;
        this.swisseph_id = conf.swisseph_id;
        this.label = _.get(conf, "label", this.name);
        this.symbol = _.get(conf, "symbol", this.name);
        this.speed = 0;
        this.declination = 0;
        this.position = 0;
        const dignities = _.get(conf, "dignities", null);
        if (dignities) {
            this.dignities = dignities as Dignities;
        }
    }    
}
export class AspectDef implements IAspectDef {
    public name: string;
    public symbol: string;
    public angle: number;
    public delta: number;
    public orbs: number[];
    public keywords?: string[];
    constructor(name: string) {
        const conf: any = _.find(_.get(AstralkaConfig, "Aspects", []), (x: any) => x.name === name);
        this.name = conf.name;
        this.symbol = conf.symbol;
        this.angle = conf.angle;
        this.delta = conf.delta;
        this.orbs = conf.orbs;
        this.keywords = conf?.keywords;
    }
}
export class Aspect implements IAspect {
    public parties: [IChartObject, IChartObject];
    public angle: number;    
    public aspect: IAspectDef
    constructor(parties: [IChartObject, IChartObject], angle: number, aspect: IAspectDef) {
        this.parties = parties;
        this.angle = angle;
        this.aspect = aspect;
    }    
}
const generationConfig = {    
    maxOutputTokens: 2048 // 2048*4 = 8192 letters,
    // default temperature of 1. For gemini pro 1.5 range 0 - 2, where 1 is middle between deterministic and creative answer
};
const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      //threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      //threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    //threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    //threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
    }
  ];

export async function call_ai(prompt: string, outputJson: boolean = false, maxOutputTokens: number = 2048): Promise<string> {
    let cfg = _.clone(generationConfig);
    if (outputJson) {
       _.merge(cfg, { responseMimeType: "application/json" });
    }
    if (maxOutputTokens && maxOutputTokens !== 2048) {
        _.merge(cfg, { maxOutputTokens });
    }
    console.log(cfg);
    const ai_model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings, generationConfig: cfg } );
    const result = await ai_model.generateContent(prompt);
    const response = result.response;
    return response.text();
}
