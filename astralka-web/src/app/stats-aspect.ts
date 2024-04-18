import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, Input, NgZone, OnChanges, SimpleChanges } from "@angular/core";
import { ChartSymbol } from "./chart-symbol";
import { ChartText } from "./chart-text";
import { SYMBOL_CUSP, SYMBOL_PLANET, aspect_color, convert_DD_to_D, convert_DD_to_DMS } from "./common";
import _ from "lodash";
import { RestService } from "./services/rest.service";
import { StatsLine } from "./stats-line";

@Component({
    selector: "[svgg-stat-aspect]",
    standalone: true,
    imports: [CommonModule, ChartSymbol, ChartText, StatsLine],
    template: `
        <svg:g>
            <g *ngIf="selected" transform="translate(10, 400)">                
                <g svgg-symbol [x]="0" [y]="0" [name]="selected.aspect.parties[0].name" [options]="{scale: 0.7}"></g>
                <g svgg-symbol [x]="13" [y]="0" [name]="selected.name" [options]="options_for_explain(selected)"></g>
                <g svgg-symbol [x]="26" [y]="0" [name]="selected.aspect.parties[1].name" [options]="{scale: 0.7}"></g>
                <g svgg-text [x]="39" [y]="0" [text]="formatted_selected"></g>
                <g *ngFor="let line of formatted_response; let i = index;" svgg-text 
                    [x]="-5.5" [y]="18 + i * (18)" 
                    [text]="line"
                    [options]="{fill: '#336699'}"
                    ></g>
                
            </g>
            <g *ngIf="has_response" transform="translate(10, 500)">
                <g svgg-stat-line [x]="0" [y]="0" [stats]="stats"></g>
                <g *ngFor="let line of formatted_response2; let i = index;" svgg-text 
                    [x]="-5.5" [y]="18 + i * (18)" 
                    [text]="line"
                    [options]="{fill: '#33998d'}"
                    ></g>
                
            </g>
            <!-- MATRIX -->
            <g *ngFor="let m of matrix" transform="translate(4, 4)">
                <rect *ngIf="m.type == 1" [attr.x]="m.x - step/2" [attr.y]="m.y - step/2" [attr.width]="step" [attr.height]="step"                     
                    (click)="show_aspect_details(m)"
                    cursor="pointer"   
                    class="rect"   
                    [class.selected]="selected === m"              
                >
                </rect>
                <rect *ngIf="m.type == 1" [attr.y]="m.x - step/2" [attr.x]="m.y - step/2" [attr.width]="step" [attr.height]="step"                     
                    (click)="show_aspect_details(m)"
                    cursor="pointer"   
                    class="rect"   
                    [class.selected]="selected === m"              
                >
                </rect>
                <g pointer-events="none" svgg-symbol [x]="m.x" [y]="m.y" [name]="m.name" [options]="options(m)"></g>
                <g pointer-events="none" class="angle" svgg-text [y]="m.x" [x]="m.y" [text]="m.aspect ? convert_DD_ro_D(m.aspect.angle) : ''" ></g>
                <g *ngIf="m.type===0 && m.retrograde" svgg-text [x]="m.x + 6" [y]="m.y + 3" [text]="'r'" [options]="{stroke_color: '#000'}"></g>                
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
            ::ng-deep .angle {
                text {
                    font-size: 7px !important;   
                    text-anchor: middle;             
                }
            }
        `
    ]
})
export class StatsAspect implements OnChanges {
    @Input() x: number = 0;
    @Input() y: number = 0;    
    @Input() data: any = {};

    public readonly step: number = 22;
    public selected: any = null;
    private pool: any[] = [];
    private loaded: boolean = false;
    private _stats: any = {};

    public convert_DD_ro_D = convert_DD_to_D;

    constructor(private rest: RestService) {
        this.rest.explain$.subscribe((data: any) => {    
            this._stats = data.params;        
            this._response2 = data.result;
        });
    }

    public get aspects() : any[] {
        return this.data ? this.data.Aspects : [];
    }
    public get sky_objects() : any[] {
        return this.data ? this.data.SkyObjects : [];
    }

    public get stats(): any {
        return this._stats || {};
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes["data"]) {
            this.loaded = false;
            
            if (!changes["data"].currentValue || _.isEmpty(changes["data"].currentValue) ) {
                this.selected = null;
                this._response = "";
                this._response2 = "";
                this._stats = {};
            }
        }
    }

    public get matrix(): any {
        
        if (!this.aspects || this.aspects.length < 1) {
            return [];
        }
        if (this.loaded) {
            return this.pool;
        }
        this.pool.push({
            x: this.x,
            y: this.y,
            name: SYMBOL_PLANET.Sun,
            type: 0,
            retrograde: false            
        });
        const planets: any[] = _.values(SYMBOL_PLANET);
        //const len = planets.length;
        planets.push(SYMBOL_CUSP.Cusp1, SYMBOL_CUSP.Cusp10);        
        for(let i = 1; i < planets.length; i++) {
            let j = 0;
            //for(j; j < Math.min(i, len); j++) {
            for(j; j < i; j++) {
                const found: any = _.find(this.aspects, x => {
                    const parties = x.parties.map(z => z.name).sort();
                    const matches = [planets[i], planets[j]].sort();
                    return _.isEqual(parties, matches);
                });                
                this.pool.push({
                    x: this.x + j * this.step,
                    y: this.y + i * this.step,
                    name: found ? found.aspect.name : '',
                    aspect_angle: found? found.aspect.angle : 0, 
                    type: 1,
                    aspect: found                    
                });                
            }
            const so = this.sky_objects.find(x => x.name === planets[i]);
            const retrograde = so && so.speed && so.speed < 0;
            this.pool.push({
                x: this.x + j * this.step,
                y: this.y + i * this.step,
                name: planets[i],
                type: 0,
                retrograde: retrograde
            });
        }
        this.loaded = true;
        return this.pool;       
    }
    public options(m: any): any {
        let options = { scale: 1 };
        if (m.type === 0) {
            return options;
        }
        _.merge(options, aspect_color(m.aspect_angle));
        return options;
        
    }
    public options_for_explain(m: any): any {
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
            const [r0, r1] = [
                _.isUndefined(this.selected.aspect.parties[0].speed) || this.selected.aspect.parties[0].speed >= 0 ? '' : 'retrograde ',
                _.isUndefined(this.selected.aspect.parties[0].speed) || this.selected.aspect.parties[0].speed >= 0 ? '' : 'retrograde '
            ];
            const prompt = { prompt: `Write in maximum 30 words interpretation of ${r0}${this.selected.aspect.parties[0].name} is in ${this.selected.aspect.aspect.name} with ${r1}${this.selected.aspect.parties[1].name} in?`};
            this._response = "... processing ...";
            this.explain(prompt);
        }
    }
    public get formatted_selected(): string {
        if (!this.selected) { return '' };
        const angle = this.selected.aspect_angle == 0 && this.selected.aspect.angle > 180 ? 360 - this.selected.aspect.angle : this.selected.aspect.angle;
        return `${this.selected.aspect.aspect.name} (${this.selected.aspect_angle}°) : ${convert_DD_to_DMS(angle)}`;
    }

    private _response: string = "";
    public async explain(prompt: any): Promise<void> {
        this.rest.explain(prompt).subscribe((text: string) => {
            this._response = text;
        });
    }

    public get formatted_response(): string[] {     
        if (this._response) {
            //const result = this._response.match(/.{1,60}/g) as string[];
            const chunks: string[] = this._response.split(/\s+/);
            let i = 0;
            const test = _.reduce(chunks, (acc: string[], v: string) => {
                if (acc.length == 0) {
                    acc.push(v);
                } else if (acc[i].length + v.length > 75) {
                    acc.push(v);
                    i++;
                } else {
                    acc[i] += ' ' + v;
                }
                return acc;
            }, []);
            return test;
        }   
        
        return [];
    }
    private _response2: string = "";
    public get has_response(): boolean {
        return this._response2 !== "";
    }
    public get formatted_response2(): string[] {     
        if (this._response2) {
            //const result = this._response.match(/.{1,60}/g) as string[];
            const chunks: string[] = this._response2.split(/\s+/);
            let i = 0;
            const test = _.reduce(chunks, (acc: string[], v: string) => {
                if (acc.length == 0) {
                    acc.push(v);
                } else if (acc[i].length + v.length > 75) {
                    acc.push(v);
                    i++;
                } else {
                    acc[i] += ' ' + v;
                }
                return acc;
            }, []);
            return test;
        }   
        
        return [];
    }
}