import _ from "lodash";
import moment from "moment";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {
  faBabyCarriage,
  faBank,
  faBookSkull,
  faBrain,
  faBriefcase,
  faBurger,
  faCar,
  faClover,
  faCocktail,
  faComputer,
  faCouch,
  faCrown,
  faDog,
  faFan, faFilm,
  faGem, faGifts, faGlobe,
  faHeart,
  faHeartPulse, faHouse,
  faLuggageCart,
  faMasksTheater,
  faMobile,
  faMoneyBill1,
  faMusic,
  faPalette,
  faPeopleGroup,
  faPeopleRoof, faPlaneDeparture, faPrescriptionBottle,
  faRing,
  faShirt,
  faSmile,
  faVolleyballBall
} from "@fortawesome/free-solid-svg-icons";
import {faFacebook, faPagelines} from "@fortawesome/free-brands-svg-icons";

export const SYMBOL_SCALE = 1;
export const COLLISION_RADIUS = 10;
export const SYMBOL_STROKE_COLOR = "#000";
export const SYMBOL_STROKE_WIDTH = "1";
export const CHART_MARGIN = 10;

export function nl360(a: number): number {
    return (a + 360) % 360;
}
export function nl180(a: number): number {
    return nl360(a) % 180;
}
export enum Gender {
  Female,
  Male
}
export enum PersonScope {
  Public,
  Private

}
export const SYMBOL_PLANET = {
    Sun: "Sun",
    Moon: "Moon",
    Mercury: "Mercury",
    Venus: "Venus",
    Mars: "Mars",
    Jupiter: "Jupiter",
    Saturn: "Saturn",
    Uranus: "Uranus",
    Neptune: "Neptune",
    Pluto: "Pluto",
    Chiron: "Chiron",
    Lilith: "Lilith",
    NorthNode: "NorthNode",
    SouthNode: "SouthNode",
    ParsFortuna: "ParsFortuna"
};
export const SYMBOL_ZODIAC = {
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
};
export const SYMBOL_HOUSE = {
    Ascendant: "Ascendant",
    Descendant: "Descendant",
    MediumCoeli: "MediumCoeli",
    ImmumCoeli: "ImmumCoeli"
}
export const SYMBOL_CUSP = {
    Cusp1: "Cusp1",
    Cusp2: "Cusp2",
    Cusp3: "Cusp3",
    Cusp4: "Cusp4",
    Cusp5: "Cusp5",
    Cusp6: "Cusp6",
    Cusp7: "Cusp7",
    Cusp8: "Cusp8",
    Cusp9: "Cusp9",
    Cusp10: "Cusp10",
    Cusp11: "Cusp11",
    Cusp12: "Cusp12"
}
export const SYMBOL_ASPECT = {
    Conjunction: "Conjunction",
    Opposition: "Opposition",
    Trine: "Trine",
    Square: "Square",
    Sextile: "Sextile",
    Quincunx: "Quincunx",
    Sesquisquare: "Sesquisquare",
    Semisquare: "Semisquare",
    Semisextile: "Semisextile",
    Quintile: "Quintile",
    Biquintile: "Biquintile",
    Nonile: "Nonile",
    Decile: "Decile",
    Septile: "Septile",
    Centile: "Centile",
    Tridecile: "Tridecile",
    Biseptile: "Biseptile",
    Triseptile: "Triseptile",
    Vigintile: "Vigintile",
    Binonile: "Binonile",

    // need symbols
    //Semiquintile: "Semiquintile"

}
//export const ZodiacSymbols: string[] = ['♈', "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", '♑', "♒", "♓"];
export const ZodiacSigns: string[] = [
    SYMBOL_ZODIAC.Aries,
    SYMBOL_ZODIAC.Taurus,
    SYMBOL_ZODIAC.Gemini,
    SYMBOL_ZODIAC.Cancer,
    SYMBOL_ZODIAC.Leo,
    SYMBOL_ZODIAC.Virgo,
    SYMBOL_ZODIAC.Libra,
    SYMBOL_ZODIAC.Scorpio,
    SYMBOL_ZODIAC.Sagittarius,
    SYMBOL_ZODIAC.Capricorn,
    SYMBOL_ZODIAC.Aquarius,
    SYMBOL_ZODIAC.Pisces
];
export function pad2(n: number | string): string {
    return _.padStart(n + '', 2);
}
export function convert_DD_to_DMS(degrees: number, sign = "°"): string {
  const deg = degrees | 0;
  const frac = Math.abs(degrees - deg);
  const min = (frac * 60) | 0;
  const sec = Math.round(frac * 3600 - min * 60);
  return pad2(deg) + sign + pad2(min) + "'" + pad2(sec) + "\"";
}

export function convert_lat_to_DMS(lat: number): string {
  const suffix = lat >= 0 ? 'N' : 'S';
  const l = Math.abs(lat);
  return `${convert_DD_to_DMS(l)}${suffix}`;
}
export function convert_long_to_DMS(long: number): string {
  const suffix = long >= 0 ? 'E' : 'W';
  const l = Math.abs(long);
  return `${convert_DD_to_DMS(l)}${suffix}`;
}

export function convert_DD_to_D(degrees: number, sign = "°"): string {
    var deg = degrees | 0;
    var frac = Math.abs(degrees - deg);
    var dec = (frac * 10)|0;
    return `${deg}${dec!==0?'.'+dec:''}${sign}`;
}
export function pos_in_zodiac_sign(longitude: number): number {
    return longitude % 30;
}
export function zodiac_sign(longitude: number): string {
    return ZodiacSigns[Math.floor(longitude / 30)];
}
// export function zodiac_symbol(longitude: number): string {
//     return ZodiacSymbols[Math.floor(longitude / 30)];
// }
// export function format_pos_in_zodiac(position: number, sign_as_symbol: boolean = true): string {
//     const sign = sign_as_symbol ? zodiac_symbol(position) : ' ' + zodiac_sign(position) + ' ';
//     return convert_DD_to_DMS(pos_in_zodiac_sign(position), sign);
// }
// export function random_point_on_the_line(p1: {x: number, y: number}, p2: {x: number, y: number}) : {x: number, y: number} {
//     const a = (p2.y - p1.y) / (p2.x - p1.x);
//     const b = p1.y - a * p1.x;
//     const d = (p2.x - p1.x);
//     const rnd_x = p1.x + d/5 + 3 * (p2.x - p1.x) / 5 * Math.random();
//     return {x: rnd_x, y: a * rnd_x + b};
// }

export function one_third_point_on_the_line(p1: {x: number, y: number}, p2: {x: number, y: number}) : {x: number, y: number} {
  const a = (p2.y - p1.y) / (p2.x - p1.x);
  const b = p1.y - a * p1.x;
  //const d = (p2.x - p1.x);
  const rnd_x = p1.x + (p2.x - p1.x) / 3;
  return {x: rnd_x, y: a * rnd_x + b};
}

export function rotate_point_around_center(c: {x: number, y: number}, p: {x: number, y: number}, angle: number) : {x: number, y: number} {
    const d = { x: p.x - c.x, y: p.y - c.y };

    const n = { x: Math.cos(angle * Math.PI/180), y: Math.sin(angle* Math.PI/180) };
    const r = { x: d.x * n.x - d.y * n.y, y: d.x * n.y + d.y * n.x };
    return {
        x: r.x + c.x,
        y: r.y + c.y
    }
}

export function age(date: any): number {
  const bd = moment.utc(date);
  return moment.utc().diff(bd, 'years');
}

export function pos_in_zodiac(position: number) : any {
    const z_pos = pos_in_zodiac_sign(position);
    const deg = z_pos | 0;
    const frac = Math.abs(z_pos - deg);
    const min = (frac * 60) | 0;
    const sec = Math.round(frac * 3600 - min * 60);
    return {
        position: position,
        deg,
        min,
        sec,
        deg_fmt: deg + "°",
        min_fmt: min + "'" ,
        sec_fmt: sec + "\"",
        sign: ZodiacSigns[Math.floor(position / 30)]
    };
}
export function aspect_color(angle: number): any {
    let options = {};
    switch (angle) {
        case 0:
            options = { stroke_color: "#27a5a5", stroke_width: 1 };
            break;

        case 180:
        case 90:
            options = { stroke_color: "#bb0000" };
            break;
        case 45:
        case 135:
            options = { stroke_color: "#bb0000", stroke_dasharray: "1,2" };
            break;

        case 120:
        case 60:
            options = { stroke_color: "#009900" };
            break;
        case 150:
        case 30:
            options = { stroke_color: "#009900", stroke_dasharray: "1,2" };
            break;


        case 144:
        case 72:
            options = { stroke_color: "#000099" };
            break;
        case 36:
        case 18:
        case 108:
            options = { stroke_color: "#000099", stroke_dasharray: "1,2" };
            break;

        case 80:
        case 40:
            options = { stroke_color: "#cc0099" };
            break;
        case 100:
        case 20:
            options = { stroke_color: "#cc0099", stroke_dasharray: "1,2" };
            break;


        case 102.8:
        case 51.4:
            options = { stroke_color: "#a79720"};
            break;
        case 154.2:
            options = { stroke_color: "#a79720", stroke_dasharray: "1,1"};
            break;
    }
    return options;
}

//stroke_dasharray: "5,3"

export function calculate_arrow(L: number, W: number, p1: any, p2: any, options: any): any[]  {
    const [dx, dy] = [p2.x - p1.x, p2.y - p1.y];
    const Norm = Math.sqrt(dx*dx + dy*dy);
    const [udx, udy] = [dx/Norm, dy/Norm];
    const [upx, upy] = [-udy, udx];
    return [
        {
            p1: { x:  p2.x - udx * L + W * upx, y: p2.y - udy * L + W * upy},
            p2,
            options,
        },
        {
            p1: { x: p2.x - udx * L - W * upx, y: p2.y - udy * L - W * upy},
            p2,
            options
        }
    ];
}


export function rnd_suffix() : string {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '_' + s4() + s4();
}

export enum ToolbarCmdMask {
  NavBar,
  //Context,
  All
}

export enum ToolbarAlign {
  Left,
  Right
}

export enum ToolbarDisplay {
  None = 0,
  Icon,
  Text,
  IconAndText
}

export enum ToolbarMenuSpan {
  Single,
  Double,
  Triple
}

export interface IToolbarCmdBase {
  mask: ToolbarCmdMask,
  hidden?: boolean,
  align?: ToolbarAlign|number
}

export interface IToolbarItem {
  display: ToolbarDisplay;
  disabled: () => boolean;
  label?: string;
  icon?: IconDefinition;
  iconResolver?: () => { icon: IconDefinition|string, cssClass: string };
  tooltip?: string;
  options?: any;
}
export interface IToolbarSeparator extends IToolbarCmdBase {
  type: 'separator';
}
export interface IToolbarMenu extends IToolbarCmdBase, IToolbarItem {
  type: 'menu';
  commands: IToolbarCmd[];
  menuSpan?: ToolbarMenuSpan;
}
export interface IToolbarNavCmd extends IToolbarCmdBase, IToolbarItem {
  type: 'item';
  action: () => void;
}
export type IToolbarCmd = IToolbarNavCmd | IToolbarSeparator | IToolbarMenu;

export interface IPersonInfo {
    name: string,
    date: string,
    timezone: number,
    dateUT: string,
    location: {
        latitude: number,
        longitude: number,
        elevation: number,
        name: string
    },
    gender: number,
    scope: number,
    createdBy?: string,
    createdDate?: Date,
    updatedBy?: string,
    updatedDate?: Date
}
export interface IPersonEntry {
  name: string,
  locationName: string,
  latitude: number,
  longitude: number,
  dob: string,
  timezone: number,
  elevation: number,
  gender: Gender,
  scope: PersonScope
}
export const UserRole = {
  Admin: 'Administrator',
  User: 'User'
};
export const latinAboutSign = [
  {
    sign: SYMBOL_ZODIAC.Aries,
    phrase: "Dulce bellum inexpertis",
    eng: "War is sweet to those who have never fought"
  },
  {
    sign: SYMBOL_ZODIAC.Taurus,
    phrase: "Abusus non tollit usum",
    eng: "Misuse does not remove use"
  },
  {
    sign: SYMBOL_ZODIAC.Gemini,
    phrase: "Credo ut intelligam",
    eng: "I believe so that I may understand"
  },
  {
    sign: SYMBOL_ZODIAC.Cancer,
    phrase: "Ave atque vale",
    eng: "Hail and farewell"
  },
  {
    sign: SYMBOL_ZODIAC.Leo,
    phrase: "Pulvis et umbra sumu",
    eng: "We are dust and shadow"
  },
  {
    sign: SYMBOL_ZODIAC.Virgo,
    phrase: "Minima maxima sunt",
    eng: "The smallest things are most important"
  },
  {
    sign: SYMBOL_ZODIAC.Libra,
    phrase: "Amor et melle et felle est fecundissimus",
    eng: "Love is rich with both honey and venom"
  },
  {
    sign: SYMBOL_ZODIAC.Scorpio,
    phrase: "Veni, vidi, vici",
    eng: "I came, I saw, I conquered"
  },
  {
    sign: SYMBOL_ZODIAC.Sagittarius,
    phrase: "Carpe diem",
    eng: "Seize the day"
  },
  {
    sign: SYMBOL_ZODIAC.Capricorn,
    phrase: "Beatus homo qui invenit sapientiam",
    eng: "Blessed is the man who finds wisdom"
  },
  {
    sign: SYMBOL_ZODIAC.Aquarius,
    phrase: "Aut viam inveniam aut faciam",
    eng: "I will either find a way, or make one"
  },
  {
    sign: SYMBOL_ZODIAC.Pisces,
    phrase: "Crede quod habes, et habes",
    eng: "Believe that you have it, and you do"
  }
];

export const perspectives = [
  {
    label: "Health",
    icon: faHeartPulse,
    prompt: "prospects of health, mental stability and emotional balance, list 2 body organs to pay attention to."
  },
  {
    label: "Money",
    icon:  faMoneyBill1,
    prompt: "prospects of being rich, best and worst potential sources of getting rich."
  },
  {
    label: "Intellect",
    icon:  faBrain,
    prompt: "intellectual capabilities, list the areas of live with the most and least intellectual interest."
  },
  {
    label: "Emotions",
    icon:  faSmile,
    prompt: "emotional capabilities, list the areas of live where calm and harmonious or tense and stressful emotions will show."
  },
  {
    label: "Family",
    icon:  faPeopleRoof,
    prompt: "prospects and potentials of having family. List the areas where the family will help the most."
  },
  {
    label: "Friends",
    icon:  faPeopleGroup,
    prompt: "prospects for friends, their qualities, the most compatible and incompatible signs."
  },
  {
    label: "Cars",
    icon:  faCar,
    prompt: "the list of the most and least preferable cars styles, makers and models."
  },
  {
    label: "Romance",
    icon:  faHeart,
    prompt: "possibilities of romantic relationships, guess the most and least preferable partner qualities such as age, height, hair color and style, curvy of skinny, experienced or not. Draw the overall picture."
  },
  {
    label: "Jobs",
    icon:  faBriefcase,
    prompt: "the most suitable and not suitable professions and the best choice jobs. List 5 best and 5 worst jobs."
  },
  {
    label: "Kids",
    icon:  faBabyCarriage,
    prompt: "potential of having kids. Guess on a potential number of kids and their gender."
  },
  {
    label: "Marriage",
    icon:  faRing,
    prompt: "prospects of getting married, the most compatible and incompatible signs. Guess number of marriages."
  },
  {
    label: "Leadership",
    icon:  faCrown,
    prompt: "potential of taking leadership and areas where can easily lead and areas conflicting with authorities."
  },
  {
    label: "Food",
    icon:  faBurger,
    prompt: "the most and least preferable world cuisines and their specific food. List 5 most and least preferable foods. Guess best fast food brand."
  },
  {
    label: "Travel",
    icon:  faLuggageCart,
    prompt: "the most and least preferable world destinations for travel. List 10 destinations in the order starting from the best to worst."
  },
  {
    label: "Sports",
    icon:  faVolleyballBall,
    prompt: "the most suitable sports and physical activities."
  },
  {
    label: "Drinks",
    icon:  faCocktail,
    prompt: "the most preferable and least preferable brands and cocktail names of alcoholic drinks."
  },
  {
    label: "Clothes",
    icon:  faShirt,
    prompt: "the most preferable and least preferable clothes, brands and styles."
  },
  {
    label: "Hobbies",
    icon:  faCouch,
    prompt: "the most preferable and least preferable hobbies and interest activities."
  },
  {
    label: "Jewelries",
    icon:  faGem,
    prompt: "the most suitable precious stones and metals, kind of jewelry to wear if any, brands and styles."
  },
  {
    label: "Colors",
    icon:  faPalette,
    prompt: "the most and the least preferable colors and their combination. "
  },
  {
    label: "Pets",
    icon:  faDog,
    prompt: "the most and the least preferable kinds, breeds and sizes of pets. List 3 most and least favorite pets."
  },
  {
    label: "Luck",
    icon:  faClover,
    prompt: "the chances in gambling, risky activities and lottery suggestions. Guess 6 lucky numbers."
  },
  {
    label: "Trees",
    icon:  faPagelines,
    prompt: "the most and the least preferable kinds of trees."
  },
  {
    label: "Flowers",
    icon:  faFan,
    prompt: "the most and the least preferable flowers, give recommendation for preferable combination in a bucket. What would be the best birthday bucket?"
  },
  {
    label: "Music",
    icon:  faMusic,
    prompt: "the most and the least preferable genres, kinds, styles and bands in music, potential to play on music instrument and it's kind."
  },
  {
    label: "Arts",
    icon:  faMasksTheater,
    prompt: "the most and the least favorite genres, kinds, styles of art, potentials to be an artist, musician, dancer, singer, writer or dancer, list 7 preferable titles/names/authors in those arts."
  },
  {
    label: "Inheritance",
    icon:  faBookSkull,
    prompt: "possibilities of getting any inheritance or how family ancestors might affect."
  },
  {
    label: "Investments",
    icon:  faBank,
    prompt: "the most and least preferable ways to invest and kinds of investments. Base on analysis guess 5 best Stocks."
  },
  {
    label: "Technology",
    icon:  faComputer,
    prompt: "the most and least preferable areas of technology. For information technology, specify which area, role and favorite programming languages and programming style."
  },
  {
    label: "Gadgets",
    icon:  faMobile,
    prompt: "the most and least preferable gadgets and devices, brands and styles. What would be the best present."
  },
  {
    label: "Housing",
    icon:  faHouse,
    prompt: "the most and least preferable housing, living in the city or suburbs, in apartment or private house, renting or owning, draw the overall picture."
  },
  {
    label: "Country",
    icon:  faGlobe,
    prompt: "the most and least preferable country to live, name 5 from best to worst preferable places based on analysis."
  },
  {
    label: "Movies",
    icon:  faFilm,
    prompt: "the most and least preferable genres of movies, name 5 from best to worst titles to watch based on analysis."
  },
  {
    label: "Social Media",
    icon:  faFacebook,
    prompt: "the most and least preferable social media, ability to monetize on content, list5 from best to worst preferable social media apps."
  },
  {
    label: "Vacation",
    icon:  faPlaneDeparture,
    prompt: "the most and least preferable vacation destinations, guess 5 from best to worst preferable vacation styles between: beach, mountains, cold north, warm tropics, cruise, hotel, ocean, pool, hiking, staying one place, active, relaxing, museums and historical, all inclusive resort."
  },
  {
    label: "Perfumes",
    icon:  faPrescriptionBottle,
    prompt: "the most and least favorite perfumes and cosmetics, brands and styles, what would be the best gift?"
  },
  {
    label: "Gifts",
    icon:  faGifts,
    prompt: "the most and least favorite gifts to receive, what would be the best gift? List 5 best and worst gifts based on analysis."
  },
];
