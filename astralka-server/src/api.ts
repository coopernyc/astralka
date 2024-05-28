import swisseph from "swisseph";
import {IAspect, IAspectDef, IHouse, ISkyObject} from "./interfaces";
import {AstralkaConfig, SkyObject} from "./constants";
import {AspectDef, House, Planet} from "./common";
import {calculate_house, find_aspect} from "./utils";
import moment from "moment";
import _ from "lodash";

export interface ILocation {
    latitude: number;
    longitude: number;
    elevation?: number;
    name?: string;
}
export interface IChartInput {
    name: string;
    date: string;
    dateUT: string;
    location: ILocation,    
    hsys: string
}
export interface IQuery {
    natal: IChartInput,    
    transit?: IChartInput
}
export function chart_data(query: IQuery): any {
    try {
        const sky_objects: ISkyObject[] = [];
        const aspect_defs: IAspectDef[] = [];
        const ephe_path: string = _.get(process.env, "EPHE_DIR", "./node_modules/swisseph/ephe");
        swisseph.swe_set_ephe_path(ephe_path);
        AstralkaConfig.Planets.forEach(planet => {
            sky_objects.push(new Planet(planet.name));
        });
        AstralkaConfig.Aspects.forEach(aspect => {
            aspect_defs.push(new AspectDef(aspect.name));
        });

        // NATAL
        const natal = query.natal;
        const date = moment.utc(natal.dateUT);

        //console.log(date.year() + '-' + (date.month() + 1) + 'm' + date.date() + 'd ' + date.hours() + 'h' + date.minutes() + 'm' + date.seconds());

        let julian: any = swisseph.swe_utc_to_jd(
            date.year(), date.month() + 1, date.date(),
            date.hours(), date.minutes(), date.seconds(),
            swisseph.SE_GREG_CAL);
        let julian_ut: number = julian.julianDayUT;
        let loc = natal.location;

        const hse: any = swisseph.swe_houses_ex(julian_ut, 0, loc.latitude, loc.longitude, natal.hsys);
        const houses: IHouse[] = [];
        hse.house.forEach((x: number, index: number) => {
            const h = new House({
                index,
                name: 'Cusp' + (index + 1),
                symbol: (index + 1).toString(),
                position: x
            });
            houses.push(h);
        });
        const fl: number = swisseph.SEFLG_SPEED; // | swisseph.SEFLG_TOPOCTR;
        sky_objects.forEach((x: ISkyObject) => {
            let calc: any;
            if (x.name !== SkyObject.ParsFortuna) {
                const id = x.name === SkyObject.SouthNode ? swisseph.SE_TRUE_NODE : x.swisseph_id!;
                calc = swisseph.swe_calc_ut(julian_ut, id, fl);
                x.position = x.name === SkyObject.SouthNode ? swisseph.swe_degnorm(calc.longitude + 180).x360 : calc.longitude;
                x.speed = calc.longitudeSpeed;
                calc = swisseph.swe_calc_ut(julian_ut, id, swisseph.SEFLG_EQUATORIAL);
                x.declination = calc.declination;
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
            if (x.name === SkyObject.Sun) {
                x.oriental = _.includes([4,5,6,10,11,12], x.house.index + 1);
            } else {
                const angle = swisseph.swe_degnorm(x.position - sky_objects.find(x => x.name === SkyObject.Sun)!.position).x360;
                x.oriental = angle > 180;
            }

        });
        const aspects: IAspect[] = [];
        const only_asc_and_mc: IHouse[] = houses.filter((x:IHouse) => [0, 9].indexOf(x.index) !== -1);
        for(let i=0; i< sky_objects.length; i++) {
            for(let j = i; j < sky_objects.length; j++ ) {
                if (i === j) continue;
                const a = sky_objects[i];
                const b = sky_objects[j];
                if (
                    (a.name === SkyObject.SouthNode && b.name === SkyObject.NorthNode) ||
                    (b.name === SkyObject.SouthNode && a.name === SkyObject.NorthNode)
                ) {
                    continue;
                }
                const angle = swisseph.swe_difdegn(a.position, b.position).degreeDiff;
                const found = find_aspect(a, b, angle, aspect_defs);
                if (found) {
                    aspects.push(found);
                }
            }
            for(let j = 0; j < only_asc_and_mc.length; j++) {
                const a = sky_objects[i];
                // if (a.name === SkyObject.ParsFortuna) {
                //     continue;
                // }
                const b = only_asc_and_mc[j];
                const angle = swisseph.swe_difdegn(a.position, b.position).degreeDiff;
                const found = find_aspect(a, b, angle, aspect_defs);
                if (found) {
                    aspects.push(found);
                }
            }
        }
        const result: any = {
            SkyObjects: sky_objects,
            Houses: houses.sort((a: IHouse, b: IHouse) => a.index - b.index),
            Aspects: aspects
        }
        if (!_.isUndefined(query.transit)) {
            const transit = query.transit;
            const date = moment(transit.date);
            let julian: any = swisseph.swe_utc_to_jd(
                date.year(), date.month() + 1, date.date(),
                date.hours(), date.minutes(), date.seconds(),
                swisseph.SE_GREG_CAL);
            let julian_ut: number = julian.julianDayUT;
            let loc = transit.location;
            swisseph.swe_set_topo(loc.latitude, loc.longitude, loc.elevation ?? 0);
            const hse1: any = swisseph.swe_houses_ex(julian_ut, 0, loc.latitude, loc.longitude, transit.hsys);
            const houses1: IHouse[] = [];
            hse1.house.forEach((x: number, index: number) => {
                const h = new House({
                    index,
                    name: 'Cusp' + (index + 1),
                    symbol: (index + 1)+'',
                    position: x
                });
                houses1.push(h);
            });

            result.Transit = {};
            result.Transit.Houses = houses1;

            const sky_objects1 = _.cloneDeep(sky_objects);
            sky_objects1.forEach((x: ISkyObject) => {
                let calc: any;
                if (x.name !== SkyObject.ParsFortuna) {
                    const id = x.name === SkyObject.SouthNode ? swisseph.SE_TRUE_NODE : x.swisseph_id!;
                    calc = swisseph.swe_calc_ut(julian_ut, id, fl);
                    x.position = x.name === SkyObject.SouthNode ? swisseph.swe_degnorm(calc.longitude + 180).x360 : calc.longitude;
                    x.speed = calc.longitudeSpeed;
                    calc = swisseph.swe_calc_ut(julian_ut, id, swisseph.SEFLG_EQUATORIAL);
                    x.declination = calc.declination;
                } else {
                    const sun = sky_objects1.find(x => x.name === SkyObject.Sun)!.position;
                    const moon = sky_objects1.find(x => x.name === SkyObject.Moon)!.position;
                    const asc = hse1.ascendant;
                    const sun_house = calculate_house(sun, houses1);
                    const is_night = 0 <= sun_house.index && sun_house.index <= 5;
                    x.position = is_night
                        ? swisseph.swe_degnorm(asc + sun - moon).x360
                        : swisseph.swe_degnorm(asc + moon - sun).x360;
                    x.speed = 0;
                }
                x.house = calculate_house(x.position, _.cloneDeep(houses)); // position in Natal houses
                // calculate_house(x.position, houses1);
            });
            result.Transit.SkyObjects = sky_objects1;

            // Transit Aspects calculation
            const aspects1: IAspect[] = [];
            const only_asc_and_mc: IHouse[] = houses.filter((x:IHouse) => [0, 9].indexOf(x.index) !== -1);
            for(let i= 0; i< sky_objects1.length; i++) {
                for(let j = 0; j < sky_objects.length; j++ ) {
                    const a = sky_objects1[i];
                    const b = sky_objects[j];
                    const angle = swisseph.swe_difdegn(a.position, b.position).degreeDiff;
                    const found = find_aspect(a, b, angle, aspect_defs);
                    if (found) {
                        aspects1.push(found);
                    }
                }
                for(let j = 0; j < only_asc_and_mc.length; j++) {
                    const a = sky_objects1[i];
                    const b = only_asc_and_mc[j];
                    const angle = swisseph.swe_difdegn(a.position, b.position).degreeDiff;
                    const found = find_aspect(a, b, angle, aspect_defs);
                    if (found) {
                        aspects1.push(found);
                    }
                }
            }
            result.Transit.Aspects = aspects1;
        }
        return result;
    } catch (err) {
        console.log(err);
    }
    return null;
}
