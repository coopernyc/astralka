import * as _ from "lodash";
import * as swisseph from "swisseph";
import { HouseSystem, SkyObject, AstralkaConfig, RomanNumbers } from "./constants";
import { IAspect, IAspectDef, IHouse, ISkyObject } from "./interfaces";
import { calculate_house, find_aspect, pad2 } from "./utils";
import { AspectDef, House, Planet } from "./common";

const sky_objects: ISkyObject[] = [];
const aspect_defs: IAspectDef[] = [];

function init() {
    AstralkaConfig.Planets.forEach(planet => {
        sky_objects.push(new Planet(planet.name));
    });
    AstralkaConfig.Aspects.forEach(aspect => {
        aspect_defs.push(new AspectDef(aspect.name));
    });
}

export * from "./constants";

export default function natal_chart_data(
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
    : { SkyObjects: ISkyObject[], Houses: IHouse[], Aspects: IAspect[] } {

    init();

    const julian: any = swisseph.swe_utc_to_jd(year, month, day, hour, minutes, seconds, swisseph.SE_GREG_CAL);
    const julian_ut: number = julian.julianDayUT;

    swisseph.swe_set_topo(latitude, longitude, elevation);
    let fl: number = swisseph.SEFLG_SPEED | swisseph.SEFLG_TOPOCTR;
    fl = fl | flag;

    const hse: any = swisseph.swe_houses_ex(julian_ut, swisseph.SEFLG_SIDEREAL, latitude, longitude, hsy);
    const houses: IHouse[] = [];
    hse.house.forEach((x: number, index: number) => {
        const h = new House({
            index,
            name: pad2(index + 1) + ' house',
            symbol: (index + 1)+'',  //RomanNumbers[index],
            position: x            
        });
        houses.push(h);
    });    

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
            const sun_house = calculate_house(sun, houses); 
            const is_night = 0 <= sun_house.index && sun_house.index <= 5;                      
            x.position = is_night 
                ? swisseph.swe_degnorm(asc + sun - moon).x360
                : swisseph.swe_degnorm(asc + moon - sun).x360;
            x.speed = 0;
        }
        x.house = calculate_house(x.position, houses);        
    });

    const aspects: IAspect[] = [];
    const only_asc_and_mc: IHouse[] = houses.filter((x:IHouse) => [0, 9].indexOf(x.index) !== -1);
    for(let i=0; i< sky_objects.length; i++) {
        for(let j = i; j < sky_objects.length; j++ ) {
            if (i === j) continue;
            const a = sky_objects[i];
            const b = sky_objects[j]; 
            if ((a.name === SkyObject.SouthNode && b.name === SkyObject.NorthNode) || (b.name === SkyObject.SouthNode && a.name === SkyObject.NorthNode))
            continue;
            const angle = swisseph.swe_difdegn(a.position, b.position).degreeDiff;
            const found = find_aspect(a, b, angle, aspect_defs);
            if (found) {
                aspects.push(found);
            }
        }        
        for(let j = 0; j < only_asc_and_mc.length; j++) {
            const a = sky_objects[i];
            const b = only_asc_and_mc[j]; 
            const angle = swisseph.swe_difdegn(a.position, b.position).degreeDiff;
            const found = find_aspect(a, b, angle, aspect_defs);
            if (found) {
                aspects.push(found);
            }
        }
    }
    return {
        SkyObjects: sky_objects,
        Houses: houses.sort((a: IHouse, b: IHouse) => a.index - b.index),
        Aspects: aspects
    }
}

// const data = natal_chart_data(1970, 4, 1, 7, 20, 0, 37.545556, 55.431111, 160, HouseSystem.Placidus.id);

// console.log('--- Houses ---');
// data.Houses.forEach((h: IHouse) => console.log(h.print()));

// console.log('\n--- Planets ---');
// data.SkyObjects.forEach((sk: ISkyObject) => console.log(sk.print()));

// console.log('\n--- Aspects ---');
// data.Aspects.forEach((a: IAspect) => console.log(a.print()));


