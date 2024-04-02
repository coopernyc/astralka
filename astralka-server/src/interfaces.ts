export interface IChartObject {
    name: string;
    label?: string;
    symbol: string;
    position: number;

    print(): string;
}
export interface IRulers {
    domicile: string[];
    exaltation: string[];
    detriment: string[];
    fall: string[];
    friend: string[];
    enemy: string[]
}
export interface IHouse extends IChartObject {
    index: number;
}
export interface ISkyObject extends IChartObject {
    swisseph_id?: number;
    speed: number;
    sign: string;
    isRetrograde: boolean;
    rulers?: IRulers;    
    house?: IHouse;
}
export interface IAspectDef {
    name: string;
    angle: number;
    kind: string,
    delta: number,
    symbol: string,
    keywords?: string[]
}
export interface IAspect {
    parties: IChartObject[];
    aspect: IAspectDef;
    angle: number;
    is_precise: boolean;
    print(): string;
}