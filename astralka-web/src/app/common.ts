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

export enum AppMode {
  Compact,
  Full
}

/**
 * Normalizes the given angle to be within the range of 0 to 359 degrees.
 *
 * @param {number} a - The angle to be normalized.
 * @return {number} The normalized angle ranging from 0 to 359 degrees.
 */
export function nl360(a: number): number {
  return (a + 360) % 360;
}

/**
 * Calculates the modulo 180 of a given number after transforming it.
 *
 * @param {number} a - The input number to be transformed.
 * @return {number} The result of the transformation modulo 180.
 */
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

/**
 * Pads a given number or string to ensure it has at least two characters.
 *
 * @param {number|string} n - The number or string to pad.
 * @return {string} The padded string.
 */
export function pad2(n: number | string): string {
  return _.padStart(n + '', 2);
}

/**
 * Converts decimal degrees (DD) to degrees, minutes, and seconds (DMS) format.
 *
 * @param {number} degrees - The value in decimal degrees to be converted.
 * @param {string} [sign="°"] - The sign symbol to be used in the output. Default is "°".
 * @return {string} The formatted string representing the input in DMS format.
 */
export function convert_DD_to_DMS(degrees: number, sign = "°"): string {
  const deg = degrees | 0;
  const frac = Math.abs(degrees - deg);
  const min = (frac * 60) | 0;
  const sec = Math.round(frac * 3600 - min * 60);
  return pad2(deg) + sign + pad2(min) + "'" + pad2(sec) + "\"";
}

/**
 * Converts latitude from decimal degrees format to degrees, minutes, and seconds (DMS) format.
 *
 * @param {number} lat - The latitude in decimal degrees.
 * @return {string} The latitude in DMS format with N/S suffix.
 */
export function convert_lat_to_DMS(lat: number): string {
  const suffix = lat >= 0 ? 'N' : 'S';
  const l = Math.abs(lat);
  return `${convert_DD_to_DMS(l)}${suffix}`;
}

/**
 * Converts a longitude in decimal degrees (DD) to degrees, minutes, and seconds (DMS) format with an appropriate suffix (E for positive, W for negative).
 *
 * @param {number} long - The longitude in decimal degrees to be converted.
 * @return {string} The formatted longitude in DMS representation with the corresponding suffix.
 */
export function convert_long_to_DMS(long: number): string {
  const suffix = long >= 0 ? 'E' : 'W';
  const l = Math.abs(long);
  return `${convert_DD_to_DMS(l)}${suffix}`;
}

/**
 * Converts a decimal degree value to a simplified degree notation.
 *
 * @param {number} degrees - The decimal degree value to be converted.
 * @param {string} [sign="°"] - The sign/notation to append at the end of the converted value.
 * @return {string} - The converted degree value in simplified notation.
 */
export function convert_DD_to_D(degrees: number, sign = "°"): string {
  var deg = degrees | 0;
  var frac = Math.abs(degrees - deg);
  var dec = (frac * 10) | 0;
  return `${deg}${dec !== 0 ? '.' + dec : ''}${sign}`;
}

/**
 * Calculates the position within a zodiac sign based on the given longitude.
 *
 * @param {number} longitude - The longitude of the celestial object.
 * @return {number} The position within the current zodiac sign (0-29 degrees).
 */
export function pos_in_zodiac_sign(longitude: number): number {
  return longitude % 30;
}

/**
 * Determines the zodiac sign based on the input longitude.
 *
 * @param {number} longitude - The longitude to determine the zodiac sign for.
 * @return {string} The corresponding zodiac sign.
 */
export function zodiac_sign(longitude: number): string {
  return ZodiacSigns[Math.floor(longitude / 30)];
}

/**
 * Calculates a point on the line segment between points p1 and p2, at a fractional distance 1/n from p1.
 *
 * @param {number} n - The subdivision factor that dictates the fraction along the segment, where 1/n determines the position.
 * @param {Object} p1 - The starting point of the line segment.
 * @param {number} p1.x - The x-coordinate of the starting point.
 * @param {number} p1.y - The y-coordinate of the starting point.
 * @param {Object} p2 - The end point of the line segment.
 * @param {number} p2.x - The x-coordinate of the end point.
 * @param {number} p2.y - The y-coordinate of the end point.
 * @return {Object} - The point on the line segment at a fractional distance 1/n from p1.
 * @return {number} return.x - The x-coordinate of the calculated point.
 * @return {number} return.y - The y-coordinate of the calculated point.
 */
export function point_on_the_line(n: number, p1: { x: number, y: number }, p2: { x: number, y: number }): {
  x: number,
  y: number
} {
  if (n == 0 || (p1.x == p2.x && p1.y == p2.y)) {
    return p1;
  }
  if (p2.x == p1.x) {
    return {x: p1.x, y: (p2.x - p1.x) / n};
  } else {
    const a = (p2.y - p1.y) / (p2.x - p1.x);
    const b = p1.y - a * p1.x;
    const m = p1.x + (p2.x - p1.x) / n;
    return {x: m, y: a * m + b};
  }
}

/**
 * Formats a party object into a descriptive string.
 *
 * @param {Object} party - The party object containing details such as name, symbol, position, speed, and house.
 * @param {string} party.name - The name of the party.
 * @param {string} party.symbol - The symbol representing the party.
 * @param {number} party.position - The position of the party in the zodiac.
 * @param {number} [party.speed] - The speed of the party (if available).
 * @param {Object} party.house - The house object associated with the party.
 * @param {string} party.house.symbol - The symbol of the house.
 * @param {number} party.house.position - The position of the house in the zodiac.
 * @return {string} A formatted string describing the party's position and house.
 */
export function format_party(party: any): string {
  const r = _.isUndefined(party.speed) || party.speed >= 0 ? '' : 'retrograde ';
  let result: string;
  if (_.startsWith(party.name, 'Cusp')) {
    result = `${party.symbol} House in ${zodiac_sign(party.position)}`;
  } else {
    //result = `${r}${party.name} in ${zodiac_sign(party.position)} and in ${party.house.symbol} House in ${zodiac_sign(party.house.position)}`;
    result = `${r}${party.name} in ${zodiac_sign(party.position)} and in ${party.house.symbol} House`;
  }
  return result;
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

/**
 * Calculates the point located one third of the way from the first point to the second point on a straight line.
 *
 * @param {Object} p1 - The starting point with coordinates x and y.
 * @param {number} p1.x - The x-coordinate of the starting point.
 * @param {number} p1.y - The y-coordinate of the starting point.
 * @param {Object} p2 - The ending point with coordinates x and y.
 * @param {number} p2.x - The x-coordinate of the ending point.
 * @param {number} p2.y - The y-coordinate of the ending point.
 * @return {Object} The point located one third of the way from p1 to p2, with coordinates x and y.
 */
export function one_third_point_on_the_line(p1: { x: number, y: number }, p2: { x: number, y: number }): {
  x: number,
  y: number
} {
  return point_on_the_line(3, p1, p2);
}

/**
 * Rotates a point around a given center by a specified angle.
 *
 * @param {Object} c - The center point.
 * @param {number} c.x - The x-coordinate of the center.
 * @param {number} c.y - The y-coordinate of the center.
 * @param {Object} p - The point to rotate.
 * @param {number} p.x - The x-coordinate of the point.
 * @param {number} p.y - The y-coordinate of the point.
 * @param {number} angle - The angle of rotation in degrees.
 * @return {Object} The rotated point.
 * @return {number} return.x - The x-coordinate of the rotated point.
 * @return {number} return.y - The y-coordinate of the rotated point.
 */
export function rotate_point_around_center(c: { x: number, y: number }, p: { x: number, y: number }, angle: number): {
  x: number,
  y: number
} {
  const d = {x: p.x - c.x, y: p.y - c.y};

  const n = {x: Math.cos(angle * Math.PI / 180), y: Math.sin(angle * Math.PI / 180)};
  const r = {x: d.x * n.x - d.y * n.y, y: d.x * n.y + d.y * n.x};
  return {
    x: r.x + c.x,
    y: r.y + c.y
  }
}

/**
 * Calculates the age based on the given birth date.
 *
 * @param {any} date - The birth date to calculate the age from. It can be in any format recognized by moment.js.
 * @return {number} The calculated age in years.
 */
export function age(date: any): number {
  const bd = moment.utc(date);
  return moment.utc().diff(bd, 'years');
}

/**
 * Converts a given position in degrees to its corresponding position within the zodiac system.
 * The result includes the degree, minute, and second components of the position as well as formatted strings and the associated zodiac sign.
 *
 * @param {number} position - The position in degrees to convert.
 * @return {Object} An object containing the position in degrees, and its equivalent in degrees, minutes, seconds, formatted strings, and the zodiac sign.
 */
export function pos_in_zodiac(position: number): any {
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
    min_fmt: min + "'",
    sec_fmt: sec + "\"",
    sign: ZodiacSigns[Math.floor(position / 30)]
  };
}

/**
 * Returns the stroke color and optional stroke properties based on the given angle.
 *
 * @param {number} angle - The angle for which to determine the stroke properties.
 * @return {Object} An object containing the stroke color and optional stroke properties.
 */
export function aspect_color(angle: number): any {
  let options = {};
  switch (angle) {
    case 0:
      options = {stroke_color: "#49c1c1", stroke_width: 1};
      break;

    case 180:
    case 90:
      options = {stroke_color: "#fb5757"};
      break;
    case 45:
    case 135:
      options = {stroke_color: "#fb5757", stroke_dasharray: "1,2"};
      break;

    case 120:
    case 60:
      options = {stroke_color: "#7ffa7f"};
      break;
    case 150:
    case 30:
      options = {stroke_color: "#7ffa7f", stroke_dasharray: "1,2"};
      break;


    case 144:
    case 72:
      options = {stroke_color: "#9c9cfb"};
      break;
    case 36:
    case 18:
    case 108:
      options = {stroke_color: "#9c9cfb", stroke_dasharray: "1,2"};
      break;

    case 80:
    case 40:
      options = {stroke_color: "#9c9cfb"};
      break;
    case 100:
    case 20:
      options = {stroke_color: "#9c9cfb", stroke_dasharray: "1,2"};
      break;


    case 102.8:
    case 51.4:
      options = {stroke_color: "#ffe100"};
      break;
    case 154.2:
      options = {stroke_color: "#ffe100", stroke_dasharray: "1,1"};
      break;
  }
  return options;
}

//stroke_dasharray: "5,3"

/**
 * This function calculates the coordinates of the two points that form the arrowhead
 * of a line segment represented by points `p1` and `p2`.
 *
 * @param {number} L - Length of the arrowhead.
 * @param {number} W - Width of the arrowhead.
 * @param {Object} p1 - Starting point of the line segment with properties `x` and `y`.
 * @param {Object} p2 - Ending point of the line segment with properties `x` and `y`.
 * @param {Object} options - Additional options or properties to be included in the returned arrowhead points.
 * @return {Array} Array of two objects each representing a point of the arrowhead, including the `p1`, `p2`, and `options` properties.
 */
export function calculate_arrow(L: number, W: number, p1: any, p2: any, options: any): any[] {
  const [dx, dy] = [p2.x - p1.x, p2.y - p1.y];
  const Norm = Math.sqrt(dx * dx + dy * dy);
  const [udx, udy] = [dx / Norm, dy / Norm];
  const [upx, upy] = [-udy, udx];
  return [
    {
      p1: {x: p2.x - udx * L + W * upx, y: p2.y - udy * L + W * upy},
      p2,
      options,
    },
    {
      p1: {x: p2.x - udx * L - W * upx, y: p2.y - udy * L - W * upy},
      p2,
      options
    }
  ];
}

/**
 * Calculates the rank weight of a given sky object.
 *
 * @param {string} so - The symbol representing the sky object.
 * @return {number} The rank weight of the sky object.
 */
export function getSkyObjectRankWeight(so: string): number {
  let weight = 0.1;
  switch (so) {
    case SYMBOL_PLANET.Sun:
    case SYMBOL_PLANET.Moon:
      weight = 1;
      break;
    case SYMBOL_PLANET.Mercury:
    case SYMBOL_PLANET.Venus:
    case SYMBOL_PLANET.Mars:
    case SYMBOL_PLANET.Jupiter:
    case SYMBOL_PLANET.Saturn:
    case SYMBOL_PLANET.Uranus:
    case SYMBOL_PLANET.Neptune:
    case SYMBOL_PLANET.Pluto:
      weight = 0.75;
      break;
    case SYMBOL_PLANET.SouthNode:
    case SYMBOL_PLANET.NorthNode:
    case SYMBOL_PLANET.Chiron:
    case SYMBOL_PLANET.Lilith:
    case SYMBOL_CUSP.Cusp1:
    case SYMBOL_CUSP.Cusp10:
    case SYMBOL_CUSP.Cusp4:
    case SYMBOL_CUSP.Cusp7:
      weight = 0.5;
      break;
    case SYMBOL_PLANET.ParsFortuna:
      weight = 0.25;
      break;
  }
  return weight;
}

/**
 * Generates a random string suffix composed of hexadecimal characters.
 *
 * @return {string} A randomly generated string consisting of four segments.
 */
export function rnd_suffix(): string {
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
  id: string;
  mask: ToolbarCmdMask,
  hidden?: boolean,
  align?: ToolbarAlign | number,
}

export interface IToolbarItem {
  display: ToolbarDisplay;
  disabled: () => boolean;
  label?: string;
  icon?: IconDefinition;
  iconResolver?: () => { icon: IconDefinition | string, cssClass: string };
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

export const Dao = {
  Yin: "Yin",
  Yang: "Yang"
}

export interface IPersonInfo {
  _id?: string,
  name: string,
  description: string,
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
  description: string,
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

// AI Generated static content
// provide 5 safe latin phrases related to each Zodiac sign in sequence starting from Aries in a json format: [ { sign: "Aries", phrases: [ { latin: "Nostra patria magna et pulhra est", english: "OUr motherland is beautiful" } ]
export const latinPhrases = [
  {
    "sign": "Aries",
    "phrases": [
      { "latin": "Fortis et Audax", "english": "Strong and Bold" },
      { "latin": "Virtus in arduis", "english": "Courage in difficulties" },
      { "latin": "Ad astra per aspera", "english": "A rough road leads to the stars" },
      { "latin": "Fléctere si néqueo súperos, Acheronta movebo", "english": "If I cannot move Heaven, I will raise hell" },
      { "latin": "Audentes fortuna iuvat", "english": "Fortune favors the bold" }
    ]
  },
  {
    "sign": "Taurus",
    "phrases": [
      { "latin": "Pax et tranquillitas", "english": "Peace and tranquility" },
      { "latin": "Amor et amicitia", "english": "Love and friendship" },
      { "latin": "Fides et constantia", "english": "Faith and steadfastness" },
      { "latin": "De gustibus non est disputandum", "english": "There's no arguing about taste" },
      { "latin": "Veni, vidi, vici", "english": "I came, I saw, I conquered" }
    ]
  },
  {
    "sign": "Gemini",
    "phrases": [
      { "latin": "Scientia est potestas", "english": "Knowledge is power" },
      { "latin": "Mens sana in corpore sano", "english": "A healthy mind in a healthy body" },
      { "latin": "Cogito, ergo sum", "english": "I think, therefore I am" },
      { "latin": "Veritas vincit", "english": "Truth conquers" },
      { "latin": "Perfer et obdura; dolor hic tibi proderit olim", "english": "Endure and harden yourself; this pain will be of benefit to you someday" }
    ]
  },
  {
    "sign": "Cancer",
    "phrases": [
      { "latin": "Domus et familia", "english": "Home and family" },
      { "latin": "Amor et cura", "english": "Love and care" },
      { "latin": "Sensus et intuitus", "english": "Senses and intuition" },
      { "latin": "In hoc signo vinces", "english": "In this sign you will conquer" },
      { "latin": "Sine Cerere et Baccho friget Venus", "english": "Without Ceres and Bacchus, Venus grows cold" }
    ]
  },
  {
    "sign": "Leo",
    "phrases": [
      { "latin": "Rex et regina", "english": "King and queen" },
      { "latin": "Fortitudo et dignitas", "english": "Strength and dignity" },
      { "latin": "Gloria et honor", "english": "Glory and honor" },
      { "latin": "Amor et libertas", "english": "Love and freedom" },
      { "latin": "Audentes fortuna iuvat", "english": "Fortune favors the bold" }
    ]
  },
  {
    "sign": "Virgo",
    "phrases": [
      { "latin": "Sapientia et prudentia", "english": "Wisdom and prudence" },
      { "latin": "Labor et perseverantia", "english": "Labor and perseverance" },
      { "latin": "Veritas et integritas", "english": "Truth and integrity" },
      { "latin": "Omnia vincit labor", "english": "Labor conquers all" },
      { "latin": "Ad astra per aspera", "english": "A rough road leads to the stars" }
    ]
  },
  {
    "sign": "Libra",
    "phrases": [
      { "latin": "Aequitas et justitia", "english": "Fairness and justice" },
      { "latin": "Harmonia et pax", "english": "Harmony and peace" },
      { "latin": "Amor et amicitia", "english": "Love and friendship" },
      { "latin": "Fides et constantia", "english": "Faith and steadfastness" },
      { "latin": "Veni, vidi, vici", "english": "I came, I saw, I conquered" }
    ]
  },
  {
    "sign": "Scorpio",
    "phrases": [
      { "latin": "Potestas et mysterium", "english": "Power and mystery" },
      { "latin": "Transformātiō et renāscentia", "english": "Transformation and rebirth" },
      { "latin": "Amor et passio", "english": "Love and passion" },
      { "latin": "Fides et constantia", "english": "Faith and steadfastness" },
      { "latin": "Veni, vidi, vici", "english": "I came, I saw, I conquered" }
    ]
  },
  {
    "sign": "Sagittarius",
    "phrases": [
      { "latin": "Libertas et explorātiō", "english": "Liberty and exploration" },
      { "latin": "Philosophia et sapientia", "english": "Philosophy and wisdom" },
      { "latin": "Amor et amicitia", "english": "Love and friendship" },
      { "latin": "Fides et constantia", "english": "Faith and steadfastness" },
      { "latin": "Veni, vidi, vici", "english": "I came, I saw, I conquered" }
    ]
  },
  {
    "sign": "Capricorn",
    "phrases": [
      { "latin": "Ambitio et successus", "english": "Ambition and success" },
      { "latin": "Disciplina et responsabilitas", "english": "Discipline and responsibility" },
      { "latin": "Fides et constantia", "english": "Faith and steadfastness" },
      { "latin": "Veni, vidi, vici", "english": "I came, I saw, I conquered" },
      { "latin": "Perfer et obdura; dolor hic tibi proderit olim", "english": "Endure and harden yourself; this pain will be of benefit to you someday" }
    ]
  },
  {
    "sign": "Aquarius",
    "phrases": [
      { "latin": "Humanitas et libertas", "english": "Humanity and freedom" },
      { "latin": "Inventio et progressus", "english": "Invention and progress" },
      { "latin": "Amor et amicitia", "english": "Love and friendship" },
      { "latin": "Fides et constantia", "english": "Faith and steadfastness" },
      { "latin": "Veni, vidi, vici", "english": "I came, I saw, I conquered" }
    ]
  },
  {
    "sign": "Pisces",
    "phrases": [
      { "latin": "Somnium et imaginātiō", "english": "Dream and imagination" },
      { "latin": "Compassiō et spiritualitas", "english": "Compassion and spirituality" },
      { "latin": "Amor et amicitia", "english": "Love and friendship" },
      { "latin": "Fides et constantia", "english": "Faith and steadfastness" },
      { "latin": "Veni, vidi, vici", "english": "I came, I saw, I conquered" }
    ]
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

export const PromptKind = {
  "Natal": "Natal",
  "Transit": "Transit"
};

export const perspectives = [
  {
    label: "Health",
    icon: faHeartPulse,
    prompt: "prospects of health, longivity, mental stability and emotional balance, list 2 body organs to pay attention to."
  },
  {
    label: "Money",
    icon: faMoneyBill1,
    prompt: "liklyhood of being rich. List 5 the best potential sources and worst obstacles of getting rich."
  },
  {
    label: "Intellect",
    icon: faBrain,
    prompt: "intellectual capabilities. Make a list of 5 specific areas with the most intellectual interest."
  },
  {
    label: "Books",
    icon: faBook,
    prompt: "preferences in literature, list the genres, styles of the most and least favorite books. List 5 must and never read books: author."
  },
  {
    label: "Emotions",
    icon: faSmile,
    prompt: "emotional balance. List 3 the areas of live where calm and harmonious or tense and stressful emotions will prevail."
  },
  {
    label: "Sexuality",
    icon: faMarsAndVenus,
    prompt: "potential clues into this individual's personality and relationship dynamics, which could indirectly relate to their romantic and sexual tendencies. Make a guess list of 3 the most and least suitable sexual genres and behaviors."
  },
  {
    label: "Family",
    icon: faPeopleRoof,
    prompt: "family relations. List 3 areas where the family will be helpful the most."
  },
  {
    label: "Friends",
    icon: faPeopleGroup,
    prompt: "frendship, amout of friends and closiness to them. List 3 the most and least compatible signs to be friends with."
  },
  {
    label: "Cars",
    icon: faCar,
    prompt: "preferences in cars styles, makers and models. List 3 the most and the least suitable cars : brand : maker."
  },
  {
    label: "Romance",
    icon: faHeart,
    prompt: "romantic relationships. Make a list of the most and least preferable partner qualities such as: age, height, hair color and hair style, curvy of skinny, experienced or not. Draw the overall picture."
  },
  {
    label: "Jobs",
    icon: faBriefcase,
    prompt: "the most and the least suitable professions. List 5 the best and the worst jobs to choose."
  },
  {
    label: "Kids",
    icon: faBabyCarriage,
    prompt: "potential of having kids. Guess on a potential number of kids and their gender."
  },
  {
    label: "Marriage",
    icon: faRing,
    prompt: "liklyhood of getting married and in what period of live. List the most and the least compatible signs for spouse. Guess number of marriages."
  },
  {
    label: "Leadership",
    icon: faPersonChalkboard,
    prompt: "potential of taking leadership and areas where can easily lead and areas conflicting with authorities."
  },
  {
    label: "Food",
    icon: faBurger,
    prompt: "preferable world cuisines. List 5 the most and least preferable foods : dishes. Guess the favorite fast food brand."
  },
  {
    label: "Travel",
    icon: faLuggageCart,
    prompt: "desire to travel or stay home. If travel, then list the most and least preferable world destinations in the format country : city."
  },
  {
    label: "Sports",
    icon: faVolleyballBall,
    prompt: "the most and the least suitable sports and physical activities, list 5 the most and the least favorite sports."
  },
  {
    label: "Drinks",
    icon: faCocktail,
    prompt: "the preferences in drinks, make a list 5 of the most and the least suitable brand : label."
  },
  {
    label: "Clothes",
    icon: faShirt,
    prompt: "the most and least preferable clothes, brands and styles, list 5 the most and the least favorite styles such as: classic, modern, excentric, cheap, expensive etc and brands."
  },
  {
    label: "Hobbies",
    icon: faCouch,
    prompt: "the most and the least favorite hobbies. List 5 the most and the least suitable hobbies for example: watching tv, gaming, cooking, drinking, collecting, gambling, sex, physical exersises, reading, hiking, gardering, sports, pets, yachting, sleeping, martial arts, traveling, creative arts, speding money, racing, programming, far niente (doing nothing) and similar hobbies"
  },
  {
    label: "Jewelries",
    icon: faCrown,
    prompt: "the most and least suitable jewelries and types such as: ring, tiara, bling, collar, earings, piercings, neckleses, beads, puzzle, bracelets, brosh, gold chains and etc. Given gender and age list 5 the most and the least favorite of them."
  },
  {
    label: "Gemstones",
    icon: faGem,
    prompt: "the most and least suitable gem stones. List 5 most suitable gem stones."
  },
  {
    label: "Colors",
    icon: faPalette,
    prompt: "the most and the least preferable colors and their combination. List 5 the most and the least favorite colors."
  },
  {
    label: "Pets",
    icon: faDog,
    prompt: "the most and the least preferable kinds, breeds and sizes of pets. List 3 the most and the least suitable pets."
  },
  {
    label: "Luck",
    icon: faClover,
    prompt: "the chances in gambling, risky activities and lottery numbers suggestions. Guess 6 lucky numbers."
  },
  {
    label: "Trees",
    icon: faPagelines,
    prompt: "the most and the least preferable kinds of trees. List 3 the best and worst suitable in format kind : name "
  },
  {
    label: "Religiousness",
    icon: faChurch,
    prompt: "the religiousness, most inclined to be atheist or believer, list 3 of the most and least suitable world religions."
  },
  {
    label: "Flowers",
    icon: faFan,
    prompt: `the most and the least likable flowers. List 5 the most and the least suitable flowers in a format: flower: what is symbolizes`
  },
  {
    label: "Music",
    icon: faMusic,
    prompt: `the most and the least preferable genres, styles in music. Indicate 5 the most and the least favorite of genres: bands. List potential to play on a specific music instrument in an format: instrumet: genre`
  },
  {
    label: "Arts",
    icon: faMasksTheater,
    prompt: "the most and the least favorite genres, kinds, styles of art, potentials to be an artist, musician, dancer, singer, writer or dancer, list 7 preferable titles/names/authors in those arts."
  },
  {
    label: "Inheritance",
    icon: faBookSkull,
    prompt: "possibilities of getting any inheritance and will it be smooth or with family litigation."
  },
  {
    label: "Investments",
    icon: faBank,
    prompt: "the most and least preferable ways to invest and kinds of investments. Guess and list 5 the most and the least favorite stocks to invest."
  },
  {
    label: "Technology",
    icon: faMicrochip,
    prompt: "the most and least preferable areas of technology. For information technology, specify which area, role and favorite programming languages and programming style."
  },
  {
    label: "Gadgets",
    icon: faMobile,
    prompt: "the most and least preferable gadgets and devices, brands and styles. List 5 the most and the least suitable gadget : name."
  },
  {
    label: "Housing",
    icon: faHouse,
    prompt: "the most and least preferable housing, living in the city or suburbs, in apartment or private house, renting or owning, draw the overall picture."
  },
  {
    label: "Country",
    icon: faGlobe,
    prompt: "the most and the least suitable country to be living. List 5 the best and the worst suitable places to settle down."
  },
  {
    label: "Movies",
    icon: faFilm,
    prompt: "the most and least preferable genres of movies, name 5 from best to worst titles to watch based on age, gender and analysis."
  },
  {
    label: "Social Media",
    icon: faFacebook,
    prompt: "the most and least preferable social media, ability to monetize on content, list 5 from best to worst preferable social media apps."
  },
  {
    label: "Vacation",
    icon: faPlaneDeparture,
    prompt: "the most and least preferable vacation destinations, guess 5 from best to worst preferable vacation styles between: beach, mountains, cold north, warm tropics, cruise, hotel, ocean, pool, hiking, staying one place, active, relaxing, museums and historical, all inclusive resort."
  },
  {
    label: "Perfumes",
    icon: faBottleDroplet,
    prompt: "the most and least favorite perfumes and cosmetics, for woman indicate if heavy makeup or natural look more suitable, given age and gender list 3 of the best and worst perfume brand and label to gift."
  },
  {
    label: "Gifts",
    icon: faGifts,
    prompt: "the most and least favorite gifts to receive, given age and gender what would be the best gift? List 5 best and worst gifts based on analysis."
  },
  {
    label: "Politics",
    icon: faSpeakerDeck,
    prompt: "the most and least political preferences. Based on age and analysis guess the most and least preferable party between: communist, ultra lefts, socialists, liberals, democrats, centrists, republicans, conservators, capitalists, ultra right, nationalists."
  },
  {
    label: "Habits",
    icon: faSmokingBan,
    prompt: "possibility of having the good and bad habits, traits and addictions. Based on analysis guess 3 of the worst and best of them."
  },
  {
    label: "Study",
    icon: faChalkboardTeacher,
    prompt: "the best and the least suitable fields of study. Guess level of education achievable and list of best choice study subjects."
  },
  {
    label: "Diet",
    icon: faPlateWheat,
    prompt: "the best and the least suitable diet, guess the possibility of being overweight or underweight, list 5 most and least preferable dishes."
  },
  {
    label: "Spendings",
    icon: faCommentDollar,
    prompt: "the spending habits, such as frugal and saving or careless and incautious, financial security, long-term saving for retirement or short-term and living fully every single day."
  },
  {
    label: "Stability",
    icon: faChessRook,
    prompt: "the stability factor of live, guess on would it be easy going and calm verse bumpy road and stormy unrest, list periods of live with most and least stability."
  },
  {
    label: "Immigration",
    icon: faArrowDownUpAcrossLine,
    prompt: "the possibility of immigration to another country, in what period of life and guess what countries are most and the least suitable for that."
  }
];
