import swisseph from "swisseph";

/**
 * The list of real and fantastic calculated sky bodies flying over earthman head
 */
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

/**
 * List of Zodiac signs
 */
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

/**
 * List of commonly know House Systems
 * 
 * 'A' equal (cusp 1 is ascendant)
 * 'E' equal (cusp 1 is ascendant)
 * 'B' Alcabitius
 * 'C' Campanus
 * 'G' 36 Gauquelin sectors
 * 'H' azimuthal or horizontal system
 * 'K' Koch
 * 'M' Morinus
 * 'O' Porphyrius
 * 'P' Placidus
 * 'R' Regiomontanus
 * 'T' Polich/Page ('topocentric' system)
 * 'U' Krusinski-Pisa-Goelzer
 * 'V' Vehlow equal (asc. in middle of house 1)
 * 'X' axial rotation system/ Meridian houses
 * 'W' equal, whole sign
 * 'X' axial rotation system/ Meridian houses
 * 'Y' APC houses
*/
export const HouseSystem = {
    Equal: { id: "E", name: "Equal (cusp 1 is asc)" },
    Alcabitius: { id: "B", name: "Alcabitius" },
    Campanus: { id: "C", name: "Campanus" },
    Gauquelin36Sectors: { id: "G", name: "36 Gauquelin sectors" },
    Azimuthal: { id: "H", name: "Azimuthal" },
    Koch: { id: "K", name: "Koch" },
    Morinus: { id: "M", name: "Morinus" },
    Parphyrius: { id: "O", name: "Parphyrius" },
    Placidus: { id: "P", name: "Placidus" },
    Regiomontanus: { id: "R", name: "Regiomontanus" },
    PolichPage: { id: "T", name: "Polich/Page" },
    KrusinskiPisaGoelzer: { id: "U", name: "Krusinski/Pisa/Goelzer" },
    VehlowEqual: { id: "V", name: "Vehlow Equal" },
    Meridian: { id: "X", name: "Meridian" },
    EqualWholeSign: { id: "W", name: "Equal, whole sign" }
}

/**
 * Orderred array of Zodiac signs
 */
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

export const AspectName = {
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
    Septile: "Septile",

    /* those are rare */
    Septagon: "Septagon",
    Binonile: "Binonile",
    Seminonile: "Seminonile",
    Sesquiquintile: "Sesquiquintile",
    Semiquintile: "Semiquintile",    
    Biseptile: "Biseptile",
    Triseptile: "Triseptile"   
}

/**
 * Order array of Zodiac signs symbols
 */
export const ZodiaSymbols: string[] = ['♈', "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", '♑', "♒", "♓"];

/**
 * Hardcoded configuration
 */
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
        //     swisseph_id: swisseph.SE_OSCU_APOG,
            // orb: 5
        
        // },
        {
            name: SkyObject.Chiron,
            symbol: "k",
            swisseph_id: swisseph.SE_CHIRON          
        },
        // {
        //     name: SkyObject.Vesta,
        //     symbol: "v",
        //     swisseph_id: swisseph.SE_VESTA,
        // },
        // {
        //     name: SkyObject.Ceres,
        //     symbol: "v",
        //     swisseph_id: swisseph.SE_CERES,
        // },
        // {
        //     name: SkyObject.Pallas,
        //     symbol: "v",
        //     swisseph_id: swisseph.SE_PALLAS,
        // },
        // {
        //     name: SkyObject.Juno,
        //     symbol: "v",
        //     swisseph_id: swisseph.SE_JUNO,
        // }
    ],
    Aspects: [
        {
            name: AspectName.Conjunction,
            angle: 0,
            delta: 8,
            orbs: [7, 5, 6]           
        },
        {
            name: AspectName.Opposition,
            angle: 180,
            delta: 8,
            orbs: [7, 5, 6]
        },
        {
            name: AspectName.Trine,
            angle: 120,
            delta: 6,
            orbs: [7, 5, 6]     
        },
        {
            name: AspectName.Square,
            angle: 90,
            delta: 6,
            orbs: [6, 4, 5]            
        },
        {
            name: AspectName.Sextile,
            angle: 60,
            delta: 4,
            orbs: [7, 5, 6]          
        },
        {
            name: AspectName.Quincunx,
            angle: 150,
            delta: 2,
            orbs: [3.5, 2, 3]
        },
        {
            name: AspectName.Sesquisquare,
            angle: 135,
            delta: 2,
            orbs: [3.5, 2, 3]
        },
        {
            name: AspectName.Semisquare,
            angle: 45,
            delta: 1,
            orbs: [1.5, 0.7, 1]
        },
        {
            name: AspectName.Semisextile,
            angle: 30,
            delta: 1,
            orbs: [1.5, 0.7, 1]
        },
        {
            name: AspectName.Quintile,
            angle: 72,
            delta: 0.5,
            orbs: [3, 2, 2]
        },
        {
            name: AspectName.Biquintile,
            angle: 144,
            delta: 0.5,
            orbs: [1.5, 1, 1]
        },
        {
            name: AspectName.Nonile,
            angle: 40,
            delta: 0.5,
            orbs: [3, 2, 2]
        },    
        {
            name: AspectName.Septile,
            angle: 51.4,
            delta: 0.5,
            orbs: [3, 2, 2]
        },

        // {
        //     name: AspectName.Binonile,
        //     angle: 80,
        //     delta: 0.5,
        //     orbs: [1.5, 1, 1]
        // },
        // {
        //     name: AspectName.Seminonile,
        //     angle: 20,
        //     delta: 0.5,
        //     orbs: [1, 0.5, 0.5]
        // },
        // {
        //     name: AspectName.Septagon,
        //     angle: 100,
        //     delta: 0.5,
        //     orbs: [2, 1.5, 1.5]
        // },
        // {
        //     name: AspectName.Sesquiquintile,
        //     angle: 108,
        //     delta: 0.5,
        //     orbs: [2, 1.5, 1.5]
        // },
        // {
        //     name: AspectName.Semiquintile,
        //     angle: 36,
        //     delta: 0.5,
        //     orbs: [1, 0.5, 0.5]
        // },        
        // {
        //     name: AspectName.Biseptile,
        //     angle: 102.8,
        //     delta: 0.5,
        //     orbs: [0.25, 0.1, 0.1]
        // },
        // {
        //     name: AspectName.Triseptile,
        //     angle: 154.2,
        //     delta: 0.5,
        //     orbs: [0.25, 0.1, 0.1]
        // }        
    ]
}

