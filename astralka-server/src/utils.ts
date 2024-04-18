import swisseph from "swisseph";
import { Aspect } from "./common";
import { IAspect, IAspectDef, IChartObject, IHouse } from "./interfaces";
import _ from "lodash";
import { SkyObject } from "./constants";

export function calculate_house(longitude: number, houses: IHouse[]): IHouse {  
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

export function find_aspect(a: IChartObject, b: IChartObject, angle: number, defs: IAspectDef[]) : IAspect | undefined {    
    function orb_index(name: string): number {
        // luminaries
        if (_.includes([SkyObject.Sun, SkyObject.Moon], name)) {
            return 0;
        }
        // major planets
        if (_.includes([SkyObject.Mercury, SkyObject.Venus, SkyObject.Mars, SkyObject.Jupiter, SkyObject.Saturn], name)) {
            return 1;
        }
        // everything else minor
        return 2;
    }
    function is_cusp(name: string): boolean {
        return _.startsWith(name, "Cusp");
    }    
    let def: IAspectDef | undefined = undefined;
    if (is_cusp(a.name) || is_cusp(b.name)) {        
        def = _.find(defs, (x: IAspectDef) => {            
            let delta = is_cusp(a.name) ? x.orbs[orb_index(b.name)] : x.orbs[orb_index(a.name)];
            delta = delta > 5 ? 5 : delta;
            return Math.abs(swisseph.swe_difdeg2n(x.angle, angle).degreeDistance180) <= delta;
        });                
    } else {
        const o_index = Math.max(orb_index(a.name), orb_index(b.name));
        def = _.find(defs, (x: IAspectDef) => Math.abs(swisseph.swe_difdeg2n(x.angle, angle).degreeDistance180) <= x.orbs[o_index]);
    }
    return def ? new Aspect([a, b], angle, def) : undefined;
}