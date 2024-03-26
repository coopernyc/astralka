import { AstralkaConfig } from "./constants";
import { IHouse, IRulers, ISkyObject } from "./interfaces";
import { format_pos_in_zodiac, zodiac_sign } from "./utils";
import * as _ from "lodash";

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
    public print(): string {
        return `${this.name} ${format_pos_in_zodiac(this.position)}`;
    }
}

export class Planet implements ISkyObject {
    public position: number;
    public speed: number;
    public name: string;
    public symbol: string;
    public label: string;
    public rulers: IRulers | undefined = undefined;
    public swisseph_id: number;
    public house: IHouse | undefined;
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
        this.position = 0;
        const rulers = _.get(conf, "rulers", null);
        if (rulers) {
            this.rulers = rulers as IRulers;
        }
    }
    public get sign(): string {
        return zodiac_sign(this.position);
    }
    public get isRetrograde(): boolean {
        return this.speed < 0;
    }
    public get isDomicile(): boolean {
        return !!this.rulers && !!_.includes(this.rulers.domicile || [], this.sign);        
    }
    public get isExaltation(): boolean {
        return !!this.rulers && !!_.includes(this.rulers.exaltation || [], this.sign);
    }
    public get isDetriment(): boolean {
        return !!this.rulers && !!_.includes(this.rulers.detriment || [], this.sign);
    }
    public get isFall(): boolean {
        return !!this.rulers && !!_.includes(this.rulers.fall || [], this.sign);
    }
    public get isFriend(): boolean {
        return !!this.rulers && !!_.includes(this.rulers.friend || [], this.sign);
    }
    public get isEnemy(): boolean {
        return !!this.rulers && !!_.includes(this.rulers.enemy || [], this.sign);
    }

    public print(): string {
        const rules = [];
        if (this.isDomicile) rules.push('Dm');
        if (this.isExaltation) rules.push('Ex');
        if (this.isFriend) rules.push('Fr');
        if (this.isEnemy) rules.push('En');
        if (this.isFall) rules.push('Fl');
        if (this.isDetriment) rules.push('Dt');
        const rules_fmt = _.padEnd(rules.join('.'), 18);
        // ℞        
        return `${this.symbol} ${format_pos_in_zodiac(this.position)} ${this.isRetrograde ? 'R' : ' '} ${this.house?.name} ${rules_fmt}`;
    }
}