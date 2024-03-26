import * as _ from "lodash";
//import * as config from "./config.json";
import * as swisseph from "swisseph";

const SkyObject = {
    Sun: "Sun",
    Moon: "Moon",
    Mercury: "Mercury",
    Venus: "Venus",
    Earth: "Earth",
    Mars: "Mars",
    Jupiter: "Jupiter",
    Saturn: "Saturn",
    Uranus: "Uranus",
    Neptune: "Neptune",
    Pluto: "Pluto",
    NorthNode: "NorthNode",
    SouthNode: "SothNode",
    ParsForuna: "PatsFortuna"
};

const ZodiacSign = {
    Aries: "Aries",
    Taurus: "Taurus",
    Gemini: "Gemini",
    Cancer: "Cancer",
    Leo: "Leo",
    Virgo: "Virgo",
    Libra: "Libra",
    Scorpio: "Scorpio",
    Sagittarius: "Sagittarius",
    Capricorn: "Capricorn",
    Aquarius: "Aquarius",
    Pisces: "Pisces"
}

const PlanetInZodiacSign = {
    Domicile: "Domicile",
    Exaltation: "Exaltation",
    Detriment: "Detriment",
    Fall: "Fall",
    Friend: "Friend",
    Enemy: "Enemy"
}
/*
 * <CODE><BLOCKQUOTE>
	 * (int)'A'&nbsp;&nbsp;equal (cusp 1 is ascendant)<BR>
	 * (int)'E'&nbsp;&nbsp;equal (cusp 1 is ascendant)<BR>
	 * (int)'B'&nbsp;&nbsp;Alcabitius
	 * (int)'C'&nbsp;&nbsp;Campanus<BR>
	 * (int)'G'&nbsp;&nbsp;36 Gauquelin sectors
	 * (int)'H'&nbsp;&nbsp;azimuthal or horizontal system<BR>
	 * (int)'K'&nbsp;&nbsp;Koch<BR>
	 * (int)'M'&nbsp;&nbsp;Morinus
	 * (int)'O'&nbsp;&nbsp;Porphyrius<BR>
	 * (int)'P'&nbsp;&nbsp;Placidus<BR>
	 * (int)'R'&nbsp;&nbsp;Regiomontanus<BR>
	 * (int)'T'&nbsp;&nbsp;Polich/Page ('topocentric' system)<BR>
	 * (int)'U'&nbsp;&nbsp;Krusinski-Pisa-Goelzer
	 * (int)'V'&nbsp;&nbsp;Vehlow equal (asc. in middle of house 1)<BR>
	 * (int)'X'&nbsp;&nbsp;axial rotation system/ Meridian houses<BR>
	 * (int)'W'&nbsp;&nbsp;equal, whole sign
	 * (int)'X'&nbsp;&nbsp;axial rotation system/ Meridian houses
	 * (int)'Y'&nbsp;&nbsp;APC houses
	 * </BLOCKQUOTE></CODE>
     * */
const HouseSystem = {
    Alcabitius: { id: "B", name: "Alcabitius" },
    Campanus: { id: "C", name: "Campanus" },
    Placidus: { id: "P", name: "Placidus" },
    Koch: { id: "K", name: "Koch" },
    Parphyrius: { id: "O", name: "Parphyrius" },
    Krusinski: { id: "U", name: "Krusinski" }
}

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

const roman_numbers = ['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ','Ⅺ','Ⅻ'];
const config = {
    Planets: [
        {
            name: SkyObject.Sun,
            symbol: "⊙",
            swisseph_id: swisseph.SE_SUN,
            rulers: {
                domicile: [ZodiacSign.Leo],
                exaltation: [ZodiacSign.Aries],
                detriment: [ZodiacSign.Aquarius],
                fall: [ZodiacSign.Libra],
                friend: [ZodiacSign.Sagittarius],
                enemy: [ZodiacSign.Gemini]
            }
        },
        {
            name: SkyObject.Moon,
            symbol: "☽",
            swisseph_id: swisseph.SE_MOON,
            rulers: {
                domicile: [ZodiacSign.Cancer],
                exaltation: [ZodiacSign.Taurus],
                detriment: [ZodiacSign.Capricorn],
                fall: [ZodiacSign.Scorpio],
                friend: [ZodiacSign.Pisces],
                enemy: [ZodiacSign.Virgo]
            }
        },
        {
            name: SkyObject.Mercury,
            symbol: "☿",
            swisseph_id: swisseph.SE_MERCURY,
            rulers: {
                domicile: [ZodiacSign.Gemini, ZodiacSign.Virgo],
                exaltation: [ZodiacSign.Virgo],
                detriment: [ZodiacSign.Sagittarius, ZodiacSign.Pisces],
                fall: [ZodiacSign.Pisces],
                friend: [ZodiacSign.Aquarius, ZodiacSign.Capricorn],
                enemy: [ZodiacSign.Leo, ZodiacSign.Cancer]
            }
        },
        {
            name: SkyObject.Venus,
            symbol: "♀",
            swisseph_id: swisseph.SE_VENUS,
            rulers: {
                domicile: [ZodiacSign.Taurus, ZodiacSign.Libra],
                exaltation: [ZodiacSign.Pisces],
                detriment: [ZodiacSign.Aries, ZodiacSign.Scorpio],
                fall: [ZodiacSign.Virgo],
                friend: [ZodiacSign.Aquarius, ZodiacSign.Capricorn],
                enemy: [ZodiacSign.Leo, ZodiacSign.Cancer]
            }
        },
        {
            name: SkyObject.Mars,
            symbol: "♂",
            swisseph_id: swisseph.SE_MARS,
            rulers: {
                domicile: [ZodiacSign.Aries, ZodiacSign.Scorpio],
                exaltation: [ZodiacSign.Capricorn],
                detriment: [ZodiacSign.Taurus, ZodiacSign.Libra],
                fall: [ZodiacSign.Cancer],
                friend: [ZodiacSign.Sagittarius, ZodiacSign.Leo],
                enemy: [ZodiacSign.Gemini, ZodiacSign.Aquarius]
            }
        },
        {
            name: SkyObject.Jupiter,
            symbol: "♃",
            swisseph_id: swisseph.SE_JUPITER,
            rulers: {
                domicile: [ZodiacSign.Sagittarius, ZodiacSign.Pisces],
                exaltation: [ZodiacSign.Cancer],
                detriment: [ZodiacSign.Gemini, ZodiacSign.Virgo],
                fall: [ZodiacSign.Capricorn],
                friend: [ZodiacSign.Aries, ZodiacSign.Leo, ZodiacSign.Scorpio],
                enemy: [ZodiacSign.Libra, ZodiacSign.Aquarius, ZodiacSign.Taurus]
            }
        },
        {
            name: SkyObject.Saturn,
            symbol: "♄",
            swisseph_id: swisseph.SE_SATURN,
            rulers: {
                domicile: [ZodiacSign.Capricorn, ZodiacSign.Aquarius],
                exaltation: [ZodiacSign.Libra],
                detriment: [ZodiacSign.Cancer, ZodiacSign.Leo],
                fall: [ZodiacSign.Aries],
                friend: [ZodiacSign.Taurus, ZodiacSign.Gemini, ZodiacSign.Virgo],
                enemy: [ZodiacSign.Scorpio, ZodiacSign.Sagittarius, ZodiacSign.Pisces]
            }
        },
        {
            name: SkyObject.Uranus,
            symbol: "♅",
            swisseph_id: swisseph.SE_URANUS,
            rulers: {
                domicile: [ZodiacSign.Aquarius],
                exaltation: [ZodiacSign.Virgo],
                detriment: [ZodiacSign.Leo],
                fall: [ZodiacSign.Taurus],
                friend: [ZodiacSign.Gemini, ZodiacSign.Virgo, ZodiacSign.Libra],
                enemy: [ZodiacSign.Sagittarius, ZodiacSign.Pisces, ZodiacSign.Aries]
            }
        },
        {
            name: SkyObject.Neptune,
            symbol: "♆",
            swisseph_id: swisseph.SE_NEPTUNE,
            rulers: {
                domicile: [ZodiacSign.Pisces],
                exaltation: [ZodiacSign.Leo],
                detriment: [ZodiacSign.Virgo],
                fall: [ZodiacSign.Aquarius],
                friend: [ZodiacSign.Scorpio, ZodiacSign.Cancer],
                enemy: [ZodiacSign.Taurus, ZodiacSign.Capricorn]
            }
        },
        {
            name: SkyObject.Pluto,
            symbol: "♇",
            swisseph_id: swisseph.SE_PLUTO,
            rulers: {
                domicile: [ZodiacSign.Scorpio],
                exaltation: [ZodiacSign.Aries],
                detriment: [ZodiacSign.Taurus],
                fall: [ZodiacSign.Libra],
                friend: [ZodiacSign.Sagittarius, ZodiacSign.Pisces],
                enemy: [ZodiacSign.Gemini, ZodiacSign.Virgo]
            }
        },
        {
            name: SkyObject.NorthNode,
            symbol: "☊",
            swisseph_id: swisseph.SE_TRUE_NODE
        },
        {
            name: SkyObject.SouthNode,
            symbol: "☋",
            swisseph_id: swisseph.SE_TRUE_NODE
        },
        {
            name: SkyObject.ParsForuna,
            symbol: "⦻"
        }
    ]
}
const zodiac_signs: string[] = [
    ZodiacSign.Aries, 
    ZodiacSign.Taurus, 
    ZodiacSign.Gemini, 
    ZodiacSign.Cancer, 
    ZodiacSign.Leo, 
    ZodiacSign.Virgo, 
    ZodiacSign.Libra, 
    ZodiacSign.Scorpio, 
    ZodiacSign.Sagittarius, 
    ZodiacSign.Capricorn, 
    ZodiacSign.Aquarius, 
    ZodiacSign.Pisces
];
const zodiac_symbols: string[] = ['♈', "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", '♑', "♒", "♓"];

function pad2(n: number | string): string {
    return _.padStart(n + '', 2);
}
function ConvertDDToDMS(degrees: number, sign = "°") {
    var deg = degrees | 0;
    var frac = Math.abs(degrees - deg);
    var min = (frac * 60) | 0;
    var sec = Math.round(frac * 3600 - min * 60);
    return pad2(deg) + sign + pad2(min) + "'" + pad2(sec) + "\"";
}
function posInZodiacSign(longitude: number): number {
    return longitude % 30;
}
function zodiacSign(longitude: number): string {
    return zodiac_signs[Math.floor(longitude / 30)];
}
function zodiacSymbol(longitude: number): string {
    return zodiac_symbols[Math.floor(longitude / 30)];
}
function formatPosInZodic(longitude: number, sign_as_symbol: boolean = true): string {
    const sign = sign_as_symbol ? zodiacSymbol(longitude) : ' ' + zodiacSign(longitude) + ' ';
    return ConvertDDToDMS(posInZodiacSign(longitude), sign);
}
function calc_house(longitude: number, houses: IHouse[]): IHouse {  
    const houses_sorted = houses.sort((a: IHouse, b: IHouse) => a.position - b.position);
    for (let i = 0; i < 12 ; i++) {
        if (longitude < houses_sorted[i].position) {
            if (i == 0) {
                return houses_sorted[11];
            } else {
                return houses_sorted[i-1];
            }
        }        
    }
    return houses_sorted[11];
}
class House implements IHouse {
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
        return `${this.name} ${formatPosInZodic(this.position)}`;
    }
}
class Planet implements ISkyObject {
    public position: number;
    public speed: number;
    public name: string;
    public symbol: string;
    public label: string;
    public rulers: IRulers | undefined = undefined;
    public swisseph_id: number;
    public house: IHouse | undefined;
    constructor(name: string) {
        const conf: any = _.find(_.get(config, "Planets", []), (x: any) => x.name === name);
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
        return zodiacSign(this.position);
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
        return `${this.symbol} ${formatPosInZodic(this.position)} ${this.isRetrograde ? 'R' : ' '} ${this.house?.name} ${rules_fmt}`;
    }
}

const sky_objects: ISkyObject[] = [];

function init() {

    config.Planets.forEach(planet => {
        sky_objects.push(new Planet(planet.name));
    });

    //console.log(JSON.stringify(planets, null, 3));
}

export function natal_chart_data(
    year: number,
    month: number,
    day: number,
    hour: number,
    minutes: number,
    seconds: number,
    longitude: number,
    latitude: number,
    elevation: number = 0,
    hsy: string = HouseSystem.Placidus.id,
    flag: number = swisseph.SEFLG_SWIEPH,
    )
    : any {

    init();

    const julian: any = swisseph.swe_utc_to_jd(year, month, day, hour, minutes, seconds, swisseph.SE_GREG_CAL);
    const julian_ut: number = julian.julianDayUT;

    swisseph.swe_set_topo(latitude, longitude, elevation);
    let fl: number = swisseph.SEFLG_SPEED | swisseph.SEFLG_TOPOCTR;
    fl = fl | flag;

    const hse: any = swisseph.swe_houses_ex(julian_ut, swisseph.SEFLG_SIDEREAL, latitude, longitude, hsy);
    const houses = hse.house.map((x: number, index: number) => {
        const h = new House({
            index,
            name: pad2(index + 1) + ' house',
            symbol: roman_numbers[index],
            position: x            
        });
        //console.log(h.print());
        return h;
    });    
    //console.log();

    sky_objects.forEach((x: ISkyObject) => {
        let calc: any;
        if (x.name !== SkyObject.ParsForuna) {
            const id = x.name === SkyObject.SouthNode ? swisseph.SE_TRUE_NODE : x.swisseph_id!;
            calc = swisseph.swe_calc_ut(julian_ut, id, fl);
            x.position = x.name === SkyObject.SouthNode ? swisseph.swe_degnorm(calc.longitude + 180).x360 : calc.longitude;        
            x.speed = calc.longitudeSpeed;
        } else {
            const sun = sky_objects.find(x => x.name === SkyObject.Sun)!.position;
            const moon = sky_objects.find(x => x.name === SkyObject.Moon)!.position;
            const asc = hse.ascendant;  
            const sun_house = calc_house(sun, houses); 
            const is_night = 0 <= sun_house.index && sun_house.index <= 5;                      
            x.position = is_night 
                ? swisseph.swe_degnorm(asc + sun - moon).x360
                : swisseph.swe_degnorm(asc + moon - sun).x360;
            x.speed = 0;
        }
        x.house = calc_house(x.position, houses);        
        //console.log(x.print());
    });
    return {
        SkyObjects: sky_objects,
        Houses: houses.sort((a: IHouse, b: IHouse) => a.index - b.index)
    }
}

const data = natal_chart_data(1970, 4, 1, 7, 20, 0, 37.545556, 55.431111, 160, HouseSystem.Placidus.id);

console.info();

console.log('--- Houses ---');
data.Houses.forEach((h: IHouse) => console.log(h.print()));

console.log('\n--- Planets ---');
data.SkyObjects.forEach((sk: ISkyObject) => console.log(sk.print()));

