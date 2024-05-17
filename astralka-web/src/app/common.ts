import _ from "lodash";
import moment from "moment";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {
  faArrowDownUpAcrossLine,
  faBabyCarriage,
  faBank,
  faBook,
  faBookSkull,
  faBottleDroplet,
  faBrain,
  faBriefcase,
  faBurger,
  faCar,
  faChalkboardTeacher,
  faChessRook,
  faChurch,
  faClover,
  faCocktail,
  faCommentDollar,
  faCouch,
  faCrown,
  faDog,
  faFan,
  faFilm,
  faGem,
  faGifts,
  faGlobe,
  faHeart,
  faHeartPulse,
  faHouse,
  faLuggageCart,
  faMarsAndVenus,
  faMasksTheater,
  faMicrochip,
  faMobile,
  faMoneyBill1,
  faMusic,
  faPalette,
  faPeopleGroup,
  faPeopleRoof,
  faPersonChalkboard,
  faPlaneDeparture,
  faPlateWheat,
  faRing,
  faShirt,
  faSmile,
  faSmokingBan,
  faVolleyballBall
} from "@fortawesome/free-solid-svg-icons";
import {faFacebook, faPagelines, faSpeakerDeck} from "@fortawesome/free-brands-svg-icons";

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
export const ZodiacSignMode = {
  Cardinal: "Cardinal",
  Fixed: "Fixed",
  Mutable: "Mutable"
}
export const ZodiacSignElement = {
  Fire: "Fire",
  Earth: "Earth",
  Air: "Air",
  Water: "Water"
}
export enum StaticDataType {
  Sign,
  Planet,
  Aspect
}
export function contextStaticData(context: string): any {
  if (_.includes(ZodiacSigns, context)) {
    return {
      type: StaticDataType.Sign,
      data: SymbolStaticData.ZodiacSign.find(x => x.sign === context)
    };
  }
  return undefined;
}
export const SYMBOL_TAROT = {
  Emperor: "Emperor",
  Hierophant: "Hierophant",
  Lover: "Lover",
  Chariot: "Chariot",
  Strength: "Strength",
  Hermit: "Hermit",
  Justice: "Justice",
  Death: "Death",
  Temperance: "Temperance",
  Devil: "Devil",
  Star: "Star",
  Moon: "Moon",
  Sun: "Sun"
}
export const SymbolStaticData = {
  Planets: [
    {
      name: SYMBOL_PLANET.Sun,
      tarotCard: SYMBOL_TAROT.Sun,
      Description: `
        <p>As the sun puts forth light, so it brings forth life. This planet (also known as a luminary and a star) represents the self, one’s personality and ego, the spirit and what it is that makes the individual unique. It is our identity and our face to the world. The sun also speaks to creative ability and the power of the individual to meet the challenges of everyday life.</p>
        <p></p>One’s natural father, husband and other male influences are ruled by the sun, as are children. The sun’s energy is a forceful one, and in its wake comes authority, the ability to lead and an individual’s essence, their core being. Through the will of this planet, we learn to manifest ourselves in the world.</p>
      `
    }
  ],
  ZodiacSign: [
    {
      sign: SYMBOL_ZODIAC.Aries,
      dates: "Mar 21 - Apr 19",
      symbol: "The Ram",
      mode: ZodiacSignMode.Cardinal,
      element: ZodiacSignElement.Fire,
      house: 1,
      mantra: "I am",
      bodyParts: "Head",
      tarotCard: SYMBOL_TAROT.Emperor,
      colors: [
        {
          name: "Red",
          code: "red"
        },
        {
          name: "Mustard",
          code: "goldenrod"
        }
      ],
      description: `
        <p>Aries is the first sign of the zodiac, and that's pretty much how those born under this sign see themselves: first. Aries are the leaders of the pack, first in line to get things going. Whether or not everything gets done is another question altogether, for an Aries prefers to initiate rather than to complete.</p>
        <p>Do you have a project needing a kick-start? Call an Aries, by all means. The leadership displayed by Aries is most impressive, so don't be surprised if they can rally the troops against seemingly insurmountable odds—they have that kind of personal magnetism.</p>
        <p>An Aries sign won't shy away from new ground, either. Those born under this zodiac sign are often called the pioneers of the zodiac, and it's their fearless trek into the unknown that often wins the day. Aries is a bundle of energy and dynamism, kind of like a Pied Piper, leading people along with its charm and charisma. The dawning of a new day—and all of its possibilities—is pure bliss to an Aries.</p>
      `
    },
    {
      sign: SYMBOL_ZODIAC.Taurus,
      dates: "Apr 20 - May 20",
      symbol: "The Bull",
      mode: ZodiacSignMode.Fixed,
      element: ZodiacSignElement.Earth,
      house: 2,
      mantra: "I have",
      bodyParts: "Throat",
      tarotCard: SYMBOL_TAROT.Hierophant,
      colors: [
        {
          name: "Green",
          code: "green"
        },
        {
          name: "Light Pink",
          code: "lightpink"
        }
      ],
      description: `
        <p>Taurus, the second sign of the zodiac and the ruler of the second house, is all about reward. Unlike the Aries love of the game, the typical Taurus personality loves the rewards of the game. Think physical pleasures and material goods, for those born under this sign revel in delicious excess. This zodiac sign is also tactile, enjoying a tender, even sensual, touch.</p>
        <p>Taurus zodiac sign adores comfort and likes being surrounded by pleasing, soothing things. Along these lines, they also favor a good meal and a fine wine. The good life in all its guises, whether it's the arts or art of their own making (yes, these folks are artistic as well), is heaven on Earth to the Taurus-born.</p>
      `
    },
    {
      sign: SYMBOL_ZODIAC.Gemini,
      dates: "May 21 - Jun 20",
      symbol: "The Twins",
      mode: ZodiacSignMode.Mutable,
      element: ZodiacSignElement.Air,
      house: 3,
      mantra: "I think",
      bodyParts: "Arms, hands and lungs",
      tarotCard: SYMBOL_TAROT.Lover,
      colors: [
        {
          name: "Yellow",
          code: "yellow"
        },
        {
          name: "Blue",
          code: "blue"
        }
      ],
      description: `
        <p>Gemini is the third sign of the zodiac, and those born under this sign will be quick to tell you all about it. That's because they love to talk! It's not just idle chatter with these folks, either. The driving force behind a Gemini zodiac sign's conversation is their mind. Ruling the third house, the Gemini-born are intellectually inclined, forever probing people and places in search of information.</p>
        <p>The more information a Gemini collects, the better. Sharing that information later on with those they love is also a lot of fun, for Geminis are supremely interested in developing their relationships. Dalliances with those of this astrology sign are always enjoyable, since Geminis are bright, quick-witted, and the proverbial life of the party. Even though their intellectual minds can rationalize forever and a day, Geminis also have a surplus of imagination waiting to be tapped. Can a Gemini be boring? Never!</p>
      `
    },
    {
      sign: SYMBOL_ZODIAC.Cancer,
      dates: "Jun 21 - Jul 22",
      symbol: "The Crab",
      mode: ZodiacSignMode.Cardinal,
      element: ZodiacSignElement.Water,
      house: 4,
      mantra: "I feel",
      bodyParts: "Stomach, brain and breasts",
      tarotCard: SYMBOL_TAROT.Chariot,
      colors: [
        {
          name: "Silver",
          code: "silver"
        },
        {
          name: "White",
          code: "white"
        }
      ],
      description: `
        <p>Leo is the fifth sign of the zodiac. These folks are impossible to miss since they love being center stage. Making an impression is Job #1 for Leos, and when you consider their personal magnetism, you see the job is quite easy. Leos are an ambitious lot, and their strength of purpose allows them to accomplish a great deal. The fact that this horoscope sign is also creative makes their endeavors fun for them and everyone else.</p>
        <p>It's quite common to see a Leo on stage or in Hollywood since these folks never shy away from the limelight. They are also supremely talented and have a flair for the dramatic. Warmth and enthusiasm seem to seep from every Leo pore, making these folks a pleasure to be around. They do love pleasure and being the center of attention!</p>
      `
    },
    {
      sign: SYMBOL_ZODIAC.Leo,
      dates: "Jun 23 - Aug 22",
      symbol: "The Lion",
      mode: ZodiacSignMode.Fixed,
      element: ZodiacSignElement.Fire,
      house: 5,
      mantra: "I will",
      bodyParts: "Heart",
      tarotCard: SYMBOL_TAROT.Strength,
      colors: [
        {
          name: "Gold",
          code: "gold"
        },
        {
          name: "Purple",
          code: "purple"
        }
      ],
      description: `
        <p>Leo is the fifth sign of the zodiac. These folks are impossible to miss since they love being center stage. Making an impression is Job #1 for Leos, and when you consider their personal magnetism, you see the job is quite easy. Leos are an ambitious lot, and their strength of purpose allows them to accomplish a great deal. The fact that this horoscope sign is also creative makes their endeavors fun for them and everyone else.</p>
        <p>It's quite common to see a Leo on stage or in Hollywood since these folks never shy away from the limelight. They are also supremely talented and have a flair for the dramatic. Warmth and enthusiasm seem to seep from every Leo pore, making these folks a pleasure to be around. They do love pleasure and being the center of attention!</p>
      `
    },
    {
      sign: SYMBOL_ZODIAC.Virgo,
      dates: "Aug 23 - Sep 22",
      symbol: "The Virgin",
      mode: ZodiacSignMode.Mutable,
      element: ZodiacSignElement.Earth,
      house: 6,
      mantra: "I analyze",
      bodyParts: "Digestive system",
      tarotCard: SYMBOL_TAROT.Hermit,
      colors: [
        {
          name: "Tan",
          code: "tan"
        },
        {
          name: "Warm Yellow",
          code: "yellow"
        }
      ],
      description: `
        <p>Virgo is the sixth sign of the zodiac, to be exact, and that's the way Virgos like it: exacting. Those born under this horoscope sign are forever the butt of jokes for being so picky and critical (and they can be), but their 'attention to detail' is for a reason: to help others. Virgos, more than any other zodiac sign, were born to serve, and it gives them great joy. They are also tailor-made for the job, since common Virgo traits are being industrious, methodical, and efficient. The sense of duty borne by these folks is considerable, and it ensures that they will always work for the greater good.</p>
      `
    },
    {
      sign: SYMBOL_ZODIAC.Libra,
      dates: "Sep 23 - Oct 22",
      symbol: "The Scales",
      mode: ZodiacSignMode.Cardinal,
      element: ZodiacSignElement.Air,
      house: 7,
      mantra: "I relate",
      bodyParts: "Lover back and kidneys",
      tarotCard: SYMBOL_TAROT.Justice,
      colors: [
        {
          name: "Ivory",
          code: "ivory"
        },
        {
          name: "Pink",
          code: "pink"
        },
        {
          name: "Light Blue",
          code: "lightblue"
        }
      ],
      description: `
        <p>Libra is the seventh sign of the zodiac, and it's at this point in the zodiac that we start to see a shift. While the first six signs of the zodiac focus on the individual, the last six focus on the individual's contact with others and with the world. The Libra zodiac sign is first and foremost focused on others and how they relate to them. We can call this the sign of Partnership with a capital 'P' because these folks do not want to be alone!</p>
        <p>For a Libra, everything is better if it's done as a pair. Libras are good when paired up, too, since they epitomize balance, harmony, and a sense of fair play. While they are true team players at work, their favorite partnership is at home: marriage. Libras feel most complete when they are coupled up with their lover, forever.</p>
      `
    },
    {
      sign: SYMBOL_ZODIAC.Scorpio,
      dates: "Oct 23 - Nov 21",
      symbol: "The Scorpion",
      mode: ZodiacSignMode.Fixed,
      element: ZodiacSignElement.Water,
      house: 8,
      mantra: "I transform",
      bodyParts: "Genitals and bowels",
      tarotCard: SYMBOL_TAROT.Death,
      colors: [
        {
          name: "Red",
          code: "red"
        },
        {
          name: "Black",
          code: "black"
        }
      ],
      description: `
        <p>Scorpio is the eighth sign of the zodiac, and that shouldn't be taken lightly—nor should Scorpios! Those born under this sign are dead serious in their mission to learn about others. There's no fluff or chatter for Scorpios, either; these folks will zero-in on the essential questions, gleaning the secrets that lie within.</p>
        <p>The Scorpio zodiac sign concerns itself with beginnings and endings, and is unafraid of either. They also travel in a world that is black and white and has little use for gray. The curiosity of Scorpios is immeasurable, which may be why they are such adept investigators.</p>
        <p>The folks with a Scorpio horoscope sign love to probe and know how to get to the bottom of things. The fact that they have a keen sense of intuition certainly helps.</p>
      `
    },
    {
      sign: SYMBOL_ZODIAC.Sagittarius,
      dates: "Nov 22 - Dec 21",
      symbol: "The Centaur / Archer",
      mode: ZodiacSignMode.Mutable,
      element: ZodiacSignElement.Fire,
      house: 9,
      mantra: "I see",
      bodyParts: "Hips, thighs and liver",
      tarotCard: SYMBOL_TAROT.Temperance,
      colors: [
        {
          name: "Maroon",
          code: "maroon"
        },
        {
          name: "Navy Blue",
          code: "navy"
        }
      ],
      description: `
        <p>Sagittarius, the ninth sign of the zodiac, is the home of the wanderers of the zodiac. It's not a mindless ramble for these folks, either. Sags are truth-seekers, and the best way for them to do this is to hit the road, talk to others and get some answers.</p>
        <p>Knowledge is key to these folks since it fuels their broad-minded approach to life. Those born with a Sagittarius zodiac sign are keenly interested in philosophy and religion, and they find that these disciplines aid their internal quest. At the end of the day, what Sagittarius wants most is to know the meaning of life, and to accomplish this while feeling free and easy.</p>
      `
    },
    {
      sign: SYMBOL_ZODIAC.Capricorn,
      dates: "Dec 22 - Jan 19",
      symbol: "The Sea-Goat",
      mode: ZodiacSignMode.Cardinal,
      element: ZodiacSignElement.Earth,
      house: 10,
      mantra: "I use",
      bodyParts: "Knees",
      tarotCard: SYMBOL_TAROT.Devil,
      colors: [
        {
          name: "Brown",
          code: "brown"
        },
        {
          name: "Khaki",
          code: "khaki"
        }
      ],
      description: `
        <p>Capricorn, the tenth sign and mountain goat of the zodiac, is all about hard work. Those born under this sign are more than happy to put in a full day at the office, realizing that it will likely take a lot of those days to get to the top. That's no problem, since Capricorns are both ambitious and determined: they will get there. Life is one big project for these folks, and they adapt to this by adopting a businesslike approach to most everything they do.</p>
        <p>Capricorns are practical as well, taking things one step at a time and being as realistic and pragmatic as possible. Those with a Capricorn zodiac sign are extremely dedicated to their goals, almost to the point of stubbornness. Those victories sure smell sweet, though, and that thought alone will keep Capricorns going.</p>
      `
    },
    {
      sign: SYMBOL_ZODIAC.Aquarius,
      dates: "Jan 20 - Feb 18",
      symbol: "The Water-Bearer",
      mode: ZodiacSignMode.Fixed,
      element: ZodiacSignElement.Air,
      house: 11,
      mantra: "I know",
      bodyParts: "Shins",
      tarotCard: SYMBOL_TAROT.Star,
      colors: [
        {
          name: "Silver",
          code: "silver"
        },
        {
          name: "Blue",
          code: "blue"
        }
      ],
      description: `
        <p>Aquarius is the eleventh sign of the zodiac, and Aquarians are the perfect representatives for the Age of Aquarius. Those born under this horoscope sign have the social conscience needed to carry us into the new millennium. Those of the Aquarius zodiac sign are humanitarian, philanthropic, and keenly interested in making the world a better place. Along those lines, they'd like to make the world work better, which is why they focus much of their energy on our social institutions and how they work (or don't work).</p>
        <p>Aquarians are visionaries, progressive souls who love to spend time thinking about how things can be better. They are also quick to engage others in this process, which is why they have so many friends and acquaintances. Making the world a better place is a collaborative effort for Aquarians.</p>
      `
    },
    {
      sign: SYMBOL_ZODIAC.Pisces,
      dates: "Feb 19 - Mar 20",
      symbol: "The Two Fishes",
      mode: ZodiacSignMode.Mutable,
      element: ZodiacSignElement.Water,
      house: 12,
      mantra: "I believe",
      bodyParts: "Feet",
      tarotCard: SYMBOL_TAROT.Moon,
      colors: [
        {
          name: "Purple",
          code: "purple"
        },
        {
          name: "White",
          code: "white"
        }
      ],
      description: `
        <p>Pisces is the twelfth sign of the zodiac, and it is also the final sign in the zodiacal cycle. Hence, this sign brings together many of the characteristics of the eleven signs that have come before it. Pisces, however, are happiest keeping many of these qualities under wraps. These folks are selfless, spiritual, and very focused on their inner journey.</p>
        <p>They also place great weight on what they are feeling. Yes, feelings define the Pisces zodiac sign, and it's not uncommon for them to feel their own burdens (and joys) as well as those of others. The intuition of the Pisces-born is highly evolved. Many people associate Pisces with dreams and secrets, and it's a fair association, since those born under this sign feel comfortable in an illusory world.</p>
      `
    }
  ]
}

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

export function point_on_the_line(n: number, p1: {x: number, y: number}, p2: {x: number, y: number}) : {x: number, y: number} {
  if (n == 0 || (p1.x == p2.x && p1.y == p2.y)) {
    return p1;
  }
  if (p2.x == p1.x) {
    return { x: p1.x, y: (p2.x - p1.x) / n };
  } else {
    const a = (p2.y - p1.y) / (p2.x - p1.x);
    const b = p1.y - a * p1.x;
    const m = p1.x + (p2.x - p1.x) / n;
    return {x: m, y: a * m + b};
  }
}

export interface IDraggableOptions {
  zones?: string[],
  data?: any
}
export interface IDroppableOptions {
  data?: any;
  zone?: string;
}
export interface IDroppableEventObject {
  data: any;
  zone: any;
}

export function one_third_point_on_the_line(p1: {x: number, y: number}, p2: {x: number, y: number}) : {x: number, y: number} {
  return point_on_the_line(3, p1, p2);
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
            options = { stroke_color: "#49c1c1", stroke_width: 1 };
            break;

        case 180:
        case 90:
            options = { stroke_color: "#fb5757" };
            break;
        case 45:
        case 135:
            options = { stroke_color: "#fb5757", stroke_dasharray: "1,2" };
            break;

        case 120:
        case 60:
            options = { stroke_color: "#7ffa7f" };
            break;
        case 150:
        case 30:
            options = { stroke_color: "#7ffa7f", stroke_dasharray: "1,2" };
            break;


        case 144:
        case 72:
            options = { stroke_color: "#9c9cfb" };
            break;
        case 36:
        case 18:
        case 108:
            options = { stroke_color: "#9c9cfb", stroke_dasharray: "1,2" };
            break;

        case 80:
        case 40:
            options = { stroke_color: "#9c9cfb" };
            break;
        case 100:
        case 20:
            options = { stroke_color: "#9c9cfb", stroke_dasharray: "1,2" };
            break;


        case 102.8:
        case 51.4:
            options = { stroke_color: "#ffe100"};
            break;
        case 154.2:
            options = { stroke_color: "#ffe100", stroke_dasharray: "1,1"};
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
    _id?: string,
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
    sign: SYMBOL_ZODIAC.Aries,
    phrase: "Martius animus",
    eng: "Martial Spirit"
  },
  {
    sign: SYMBOL_ZODIAC.Aries,
    phrase: "Audax et fortis",
    eng: "Bold and Strong"
  },
  {
    sign: SYMBOL_ZODIAC.Aries,
    phrase: "Semper audere",
    eng: "Always to dare"
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

export function getContext(data: any): string {
  if (data && data.context) {
    return data.context;
  } else {
    const names: string[] = [
      ..._.values(SYMBOL_ZODIAC),
      ..._.values(SYMBOL_PLANET),
      ..._.values(SYMBOL_ASPECT)
    ];
    return names[_.random(names.length - 1)];
  }
}

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
    label: "Books",
    icon:  faBook,
    prompt: "preferences in literature, list the genres, styles of the most and least favorite books, list 5 must and never read books and authors."
  },
  {
    label: "Emotions",
    icon:  faSmile,
    prompt: "emotional capabilities, list the areas of live where calm and harmonious or tense and stressful emotions will show."
  },
  {
    label: "Sexuality",
    icon:  faMarsAndVenus,
    prompt: "sexual attractiveness and sexual behavior, list the most and least preferable sexual genres and behaviors."
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
    icon:  faPersonChalkboard,
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
    prompt: "the most and the least suitable sports and physical activities, list 5 the most and the least favorite sports."
  },
  {
    label: "Drinks",
    icon:  faCocktail,
    prompt: "the most and least preferable alcoholic drinks, list 5 the most and the least favorite labels."
  },
  {
    label: "Clothes",
    icon:  faShirt,
    prompt: "the most  and least preferable clothes, brands and styles, list 5 the most and the least favorite styles and brands."
  },
  {
    label: "Hobbies",
    icon:  faCouch,
    prompt: "the most and the least preferable hobbies and interest activities, list 5 the most and the least suitable of them."
  },
  {
    label: "Jewelries",
    icon:  faCrown,
    prompt: "the most and least suitable jewelries, list 5 brands and most favorite jewelry kinds and styles."
  },
  {
    label: "Gemstones",
    icon:  faGem,
    prompt: "the most and least suitable gem stones, list 5 of each."
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
    label: "Religiousness",
    icon:  faChurch,
    prompt: "the religiousness, most inclined to be atheist or believer, list 2 of the most and least suitable world religions."
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
    icon:  faMicrochip,
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
    prompt: "the most and least preferable genres of movies, name 5 from best to worst titles to watch based on age, gender and analysis."
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
    icon:  faBottleDroplet,
    prompt: "the most and least favorite perfumes and cosmetics, for woman indicate if heavy makeup or natural look more suitable, given age and gender list 3 of the best and worst perfume brand and label to gift."
  },
  {
    label: "Gifts",
    icon:  faGifts,
    prompt: "the most and least favorite gifts to receive, given age and gender what would be the best gift? List 5 best and worst gifts based on analysis."
  },
  {
    label: "Politics",
    icon:  faSpeakerDeck,
    prompt: "the most and least political preferences. Based on age and analysis guess the most and least preferable party between: communist, ultra lefts, socialists, liberals, democrats, centrists, republicans, conservators, capitalists, ultra right, nationalists."
  },
  {
    label: "Habits",
    icon:  faSmokingBan,
    prompt: "possibility of having the good and bad habits, traits and addictions. Based on analysis guess 3 of the worst and best of them."
  },
  {
    label: "Study",
    icon:  faChalkboardTeacher,
    prompt: "the best and the least suitable fields of study. Guess level of education achievable and list of best choice study subjects."
  },
  {
    label: "Diet",
    icon:  faPlateWheat,
    prompt: "the best and the least suitable diet, guess the possibility of being overweight or underweight, list 5 most and least preferable dishes."
  },
  {
    label: "Spendings",
    icon:  faCommentDollar,
    prompt: "the spending habits, such as frugal and saving or careless and incautious, financial security, long-term saving for retirement or short-term and living fully every single day."
  },
  {
    label: "Stability",
    icon:  faChessRook,
    prompt: "the stability factor of live, guess on would it be easy going and calm verse bumpy road and stormy unrest, list periods of live with most and least stability."
  },
  {
    label: "Immigration",
    icon:  faArrowDownUpAcrossLine,
    prompt: "the possibility of immigration to another country, in what period of life and guess what countries are most and the least suitable for that."
  }
];
