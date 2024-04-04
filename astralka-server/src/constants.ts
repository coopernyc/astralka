import swisseph from "swisseph";

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
    SouthNode: "SouthNode",
    ParsForuna: "ParsFortuna",
    Lilith: "Lilith",
    TrueBalckMoon: "TrueBlackMoon",
    Chiron: "Chiron",
    Ceres: "Ceres",
    Pallas: "Pallas",
    Juno: "Juno",
    Vesta: "Vesta"
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
export const AspectKind = {
    Major: "Major",
    Minor: "Monor"
}
export const AstralkaConfig = {
    Planets: [
        {
            name: SkyObject.Sun,
            symbol: "⊙",
            swisseph_id: swisseph.SE_SUN,
            dignities: {
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
            dignities: {
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
            dignities: {
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
            dignities: {
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
            dignities: {
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
            dignities: {
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
            dignities: {
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
            dignities: {
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
            dignities: {
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
            dignities: {
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
        },
        {
            name: SkyObject.Lilith,
            symbol: "⚜︎",
            swisseph_id: swisseph.SE_MEAN_APOG
        },
        // {
        //     name: SkyObject.TrueBalckMoon,
        //     symbol: "☪︎",
        //     swisseph_id: swisseph.SE_OSCU_APOG
        // },
        {
            name: SkyObject.Chiron,
            symbol: "k",
            swisseph_id: swisseph.SE_CHIRON
        },
        // {
        //     name: SkyObject.Vesta,
        //     symbol: "v",
        //     swisseph_id: swisseph.SE_VESTA
        // },
        // {
        //     name: SkyObject.Ceres,
        //     symbol: "v",
        //     swisseph_id: swisseph.SE_CERES
        // },
        // {
        //     name: SkyObject.Pallas,
        //     symbol: "v",
        //     swisseph_id: swisseph.SE_PALLAS
        // },
        // {
        //     name: SkyObject.Juno,
        //     symbol: "v",
        //     swisseph_id: swisseph.SE_JUNO
        // }
    ],
    Aspects: [
        {            
            name: "Conjunction",
            angle: 0,
            kind: AspectKind.Major,
            delta: 8,
            symbol: '☌',
            keywords: [
                "intencity",
                "strengthening",
                "fusion",
                "integration",
                "conjunction"
            ]            
        },
        {
            name: "Opposition",
            angle: 180,
            kind: AspectKind.Major,
            delta: 8,
            symbol: '☍',
            keywords: [
                "opposition",
                "balance",
                "cooperation"            
            ]
        },
        {
            name: "Trine",
            angle: 120,
            kind: AspectKind.Major,
            delta: 6,
            symbol: '△',
            keywords: [
                "easy going",
                "good luck"
            ]
        },
        {
            name: "Square",
            angle: 90,            
            kind: AspectKind.Major,
            delta: 6,
            symbol: '□',
            keywords: [
                "difficulties",
                "tension"
            ]
        },
        {
            name: "Sextile",
            angle: 60,            
            kind: AspectKind.Major,
            delta: 4,
            symbol: '✶',
            keywords: [
                "possibility",
                "opportunity"
            ]
        },
        {
            name: "Quincunx",
            angle: 150,
            kind: AspectKind.Minor,
            delta: 2,
            symbol: '⊼',
            keywords: [
                "growth"
            ]
        },
        {
            name: "Sesquiquadrate",
            angle: 135,
            kind: AspectKind.Minor,
            delta: 2,
            symbol: '⛋',
            keywords: [
                "trouble",
                "concern"
            ]
        },        
        {
            name: "Semisquare",
            angle: 45,
            kind: AspectKind.Minor,
            delta: 1,
            symbol: '∠',
            keywords: [
                "tension"
            ]
        },        
        {
            name: "Semisextile",
            angle: 30,
            kind: AspectKind.Minor,
            delta: 1,
            symbol: '⊻',
            keywords: [
                "cooperation"
            ]
        },
        {
            name: "Quintile",
            angle: 72,
            kind: AspectKind.Minor,
            delta: 0.5,
            symbol: '⬠',
            keywords: [
                "creativity"
            ]
        },
        {
            name: "Biquintile",
            angle: 144,
            kind: AspectKind.Minor,
            delta: 0.5,
            symbol: 'b',
            keywords: [
                "deep creative powers"
            ]
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
