export const SYMBOL_SCALE = 1;
export const COLLISION_RADIUS = 7.5;
export const SYMBOL_STROKE_COLOR = "#000";
export const SYMBOL_STROKE_WIDTH = "1";
export const CHART_MARGIN = 50;


export function nl360(a: number): number {
    return (a + 360) % 360;
}
export function nl180(a: number): number {
    return nl360(a) % 180;
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
