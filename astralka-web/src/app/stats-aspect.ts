import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ChartSymbol } from "./chart-symbol";
import { ChartText } from "./chart-text";
import { SYMBOL_CUSP, SYMBOL_HOUSE, SYMBOL_PLANET, aspect_color } from "./common";
import _ from "lodash";

@Component({
    selector: "[svgg-stat-aspect]",
    standalone: true,
    imports: [CommonModule, ChartSymbol, ChartText],
    template: `
        <svg:g>
            
            <g *ngFor="let m of matrix; let i = index" transform="translate(4, 4)">
                <rect *ngIf="m.type == 1" [attr.x]="m.x - 9" [attr.y]="m.y - 9" width="18" height="18" stroke="#cccccc" fill="none" ></rect>
                <g svgg-symbol [x]="m.x" [y]="m.y" [name]="m.name" [options]="options(m)"></g>
            </g>
        </svg:g>
    `
})
export class StatsAspect {
    @Input() x: number = 0;
    @Input() y: number = 0;    
    @Input() stats: any[] = [];
    

    private readonly step: number = 18;
    
    public get matrix(): any {
        
        if (!this.stats || this.stats.length < 1) {
            return [];
        }
        const planets = _.values(SYMBOL_PLANET);
        planets.push(SYMBOL_CUSP.Cusp1, SYMBOL_CUSP.Cusp10);
        const pool: any[] = [{
            x: this.x,
            y: this.y,
            name: SYMBOL_PLANET.Sun,
            type: 0
        }];
        for(let i = 1; i < planets.length; i++) {
            let j = 0;
            for(j; j < i; j++) {
                const found: any = _.find(this.stats, x => {
                    const parties = x.parties.map(z => z.name).sort();
                    const matches = [planets[i], planets[j]].sort();
                    return _.isEqual(parties, matches);
                });
                //if (found) {
                    pool.push({
                        x: this.x + j * this.step,
                        y: this.y + i * this.step,
                        name: found ? found.aspect.name : '',
                        aspect_angle: found? found.aspect.angle : 0, 
                        type: 1
                    });
                //}
            }
            pool.push({
                x: this.x + j * this.step,
                y: this.y + i * this.step,
                name: planets[i],
                type: 0
            });
        }
        return pool;       
    }
    public options(m: any): any {
        let options = { scale: 0.7 };
        if (m.type === 0) {
            return options;
        }
        _.merge(options, aspect_color(m.aspect_angle));
        return options;
        
    }
}