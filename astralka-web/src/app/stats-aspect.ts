import { CommonModule } from "@angular/common";
import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import { ChartSymbol } from "./chart-symbol";
import { ChartText } from "./chart-text";
import { SYMBOL_CUSP, SYMBOL_HOUSE, SYMBOL_PLANET, aspect_color, convert_DD_to_DMS, nl180 } from "./common";
import _ from "lodash";

@Component({
    selector: "[svgg-stat-aspect]",
    standalone: true,
    imports: [CommonModule, ChartSymbol, ChartText],
    template: `
        <svg:g>
            <g *ngIf="selected" transform="translate(200, 18)">
                <!--<rect x="0" y="0" width="40" height="40" stroke="#cccccc" fill="#ffffff"></rect>-->
                <g svgg-symbol [x]="0" [y]="0" [name]="selected.aspect.parties[0].name" [options]="{scale: 0.7}"></g>
                <g svgg-symbol [x]="13" [y]="0" [name]="selected.name" [options]="options(selected)"></g>
                <g svgg-symbol [x]="26" [y]="0" [name]="selected.aspect.parties[1].name" [options]="{scale: 0.7}"></g>
                <g svgg-text [x]="39" [y]="0" [text]="formatted_selected"></g>
            </g>
            <g *ngFor="let m of matrix" transform="translate(4, 4)">
                <rect *ngIf="m.type == 1" [attr.x]="m.x - 9" [attr.y]="m.y - 9" width="18" height="18"                     
                    (click)="show_aspect_details(m)"
                    cursor="pointer"   
                    class="rect"   
                    [class.selected]="selected === m"              
                >
                </rect>
                <g pointer-events="none" svgg-symbol [x]="m.x" [y]="m.y" [name]="m.name" [options]="options(m)"></g>                
            </g>
        </svg:g>
    `,
    styles: [
        `
            .rect {
                stroke: #cccccc;                
                fill: #ffffff;
                cursor: "pointer";                                
            }
            .rect.selected {
                fill: #fcfbc7;
                stroke: #999999;                
            }
            .rect:hover {
                fill: #e5e7e7;        
            }
        `
    ]
})
export class StatsAspect implements OnChanges {
    @Input() x: number = 0;
    @Input() y: number = 0;    
    @Input() stats: any[] = [];

    private readonly step: number = 18;
    public selected: any = null;
    private pool: any[] = [];
    private loaded: boolean = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["stats"]) {
            this.loaded = false;
        }
    }

    public get matrix(): any {
        
        if (!this.stats || this.stats.length < 1) {
            return [];
        }
        if (this.loaded) {
            return this.pool;
        }
        this.pool.push({
            x: this.x,
            y: this.y,
            name: SYMBOL_PLANET.Sun,
            type: 0
        });
        const planets = _.values(SYMBOL_PLANET);
        planets.push(SYMBOL_CUSP.Cusp1, SYMBOL_CUSP.Cusp10);        
        for(let i = 1; i < planets.length; i++) {
            let j = 0;
            for(j; j < i; j++) {
                const found: any = _.find(this.stats, x => {
                    const parties = x.parties.map(z => z.name).sort();
                    const matches = [planets[i], planets[j]].sort();
                    return _.isEqual(parties, matches);
                });
                //if (found) {
                    this.pool.push({
                        x: this.x + j * this.step,
                        y: this.y + i * this.step,
                        name: found ? found.aspect.name : '',
                        aspect_angle: found? found.aspect.angle : 0, 
                        type: 1,
                        aspect: found
                    });
                //}
            }
            this.pool.push({
                x: this.x + j * this.step,
                y: this.y + i * this.step,
                name: planets[i],
                type: 0
            });
        }
        this.loaded = true;
        return this.pool;       
    }
    public options(m: any): any {
        let options = { scale: 0.7 };
        if (m.type === 0) {
            return options;
        }
        _.merge(options, aspect_color(m.aspect_angle));
        return options;
        
    }
    public show_aspect_details(m: any): void {
        this.pool = _.flatten(_.partition(this.pool, x => x !== m));
        if (m && m.type === 1 && m.aspect) {  
            this.selected = m;
        }
    }
    public get formatted_selected(): string {
        if (!this.selected) { return '' };
        const angle = this.selected.aspect_angle == 0 && this.selected.aspect.angle > 180 ? 360 - this.selected.aspect.angle : this.selected.aspect.angle;
        return `${this.selected.aspect.aspect.name} (${this.selected.aspect_angle}°) : ${convert_DD_to_DMS(angle)}`;
    }
}