
import * as swisseph from "swisseph";

export const SkyObject = {
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
    ParsForuna: "ParsFortuna"
};

export const ZodiacSign = {
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
export const HouseSystem = {
    Alcabitius: { id: "B", name: "Alcabitius" },
    Campanus: { id: "C", name: "Campanus" },
    Placidus: { id: "P", name: "Placidus" },
    Koch: { id: "K", name: "Koch" },
    Parphyrius: { id: "O", name: "Parphyrius" },
    Krusinski: { id: "U", name: "Krusinski" }
}
export const RomanNumbers = ['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ','Ⅷ','Ⅸ','Ⅹ','Ⅺ','Ⅻ'];
export const AstralkaConfig = {
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
export const ZodiacSigns: string[] = [
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
export const ZodiaSymbols: string[] = ['♈', "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", '♑', "♒", "♓"];
