import swisseph from "swisseph";
import { Aspect } from "./common";
import { IAspect, IAspectDef, IChartObject, IHouse } from "./interfaces";
import _ from "lodash";

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
    const def: IAspectDef | undefined = _.find(defs, (x: IAspectDef) => Math.abs(swisseph.swe_difdeg2n(x.angle, angle).degreeDistance180) <= x.delta);
    return def ? new Aspect([a, b], angle, def) : undefined;
}