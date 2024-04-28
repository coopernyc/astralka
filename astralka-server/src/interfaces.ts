export interface IChartObject {
    name: string;
    label?: string;
    symbol: string;
    position: number;
}
export interface IDignities {
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
    declination: number;
    dignities?: IDignities;    
    house?: IHouse;
    oriental: boolean;
}
export interface IAspectDef {
    name: string;
    angle: number;
    delta: number;
    orbs: number[];
}
export interface IAspect {
    parties: IChartObject[];
    aspect: IAspectDef;
    angle: number;
}