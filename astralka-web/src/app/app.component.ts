import { Component } from '@angular/core';
import { ChartSymbol } from './chart-symbol';
import _ from "lodash";
import { COLLISION_RADIUS, SYMBOL_SCALE, SYMBOL_ZODIAC, format_pos_in_zodiac, nl180, nl360, pos_in_zodiac_sign } from './common';
import { CommonModule } from '@angular/common';
import { ChartCircle } from './chart-circle';
import { ChartLine } from './chart-line';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver, LayoutModule, Breakpoints } from '@angular/cdk/layout';
import { ChartText } from './chart-text';

@Component({
  selector: 'astralka-root',
  standalone: true,
  imports: [ChartSymbol, ChartCircle, ChartLine, ChartText, CommonModule, HttpClientModule, FormsModule, LayoutModule],
  template: `
    <div style="margin: 2px;">
      <button (click)="draw('Sasha')">Sasha</button>
      <button (click)="draw('Lana')">Lana</button>
      <button (click)="draw('Maria')">Maria</button>
      <button (click)="draw('Jenna')">Jenna</button>
      <button (click)="draw('Samantha')">Samantha</button>
      <div style="display: inline-block; margin-left: 8px;">        
        <select [ngModel]="hsy" (ngModelChange)="hsy_change($event)">
          <option *ngFor="let sh of house_system" [selected]="sh.value === hsy" [value]="sh.value">{{sh.display}}</option>
        </select>
      </div>
      <button (click)="interpret()" [disabled]="!has_name" style="margin-left: 4px;">Interpret</button>
    </div>    
    <div id="container">
      <svg xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        version="1.1"
        [attr.width]="width"
        [attr.height]="height"
        [attr.viewBox]="'0 0 ' + width + ' ' + height"        
        >
        <g>
          <rect x="0" y="0" [attr.width]="width" [attr.height]="height" fill="none" stroke="#000"></rect> 
          <g svgg-circle [cx]="cx" [cy]="cy" [radius]="outer_radius"></g>
          <g svgg-circle [cx]="cx" [cy]="cy" [radius]="inner_radius"></g>
          <g svgg-circle [cx]="cx" [cy]="cy" [radius]="house_radius"></g>
          <g svgg-line *ngFor="let l of lines" [x1]="l.p1.x" [y1]="l.p1.y" [x2]="l.p2.x" [y2]="l.p2.y" [options]="l.options"></g>
          <g svgg-symbol *ngFor="let p of planets" [x]="p.x" [y]="p.y" [name]="p.name"></g>
          <g svgg-text *ngFor="let p of planets" [x]="p.x + 6" [y]="p.y + 5" [text]="p.text"></g>
          <g svgg-symbol *ngFor="let p of zodiac" [x]="p.x" [y]="p.y" [name]="p.name" [options]="zodiac_options(p)"></g>
          <g svgg-symbol *ngFor="let p of cusps" [x]="p.x" [y]="p.y" [name]="p.name"></g>
          <!--
          <g svgg-symbol [x]="20" [y]="520"  [name]="'ParsFortuna'"></g>
          <g svgg-line [x1]="10" [y1]="520" [x2]="30" [y2]="520"></g>
          <g svgg-line [x1]="20" [y1]="510" [x2]="20" [y2]="530"></g>
          //-->
        </g>        
      </svg>
    </div>
    <div id="details" *ngIf="has_name && explain">
      <!-- <div *ngFor="let p of sky_objects" class="roboto-medium">
        <div style="display: inline-block; width: 16px; text-align: center" [title]="p.name">{{p.symbol}}</div> {{format_position(p.position)}}
      </div>   -->
      <div>Interpretation for {{data?.query.name}}</div>
      <pre>{{explain}}</pre>
    </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  public width: number = 600;
  public height: number = 600;
  public margin: number = 50;

  public cx: number = 0;
  public cy: number = 0;
  public outer_radius: number = 0;
  public inner_radius: number = 0;
  public house_radius: number = 0;
  
  title = 'astralka-web';

  private _planets: any[] = [];
  private _zodiac: any[] = [];
  private _houses: any[] = [];
  private _cusps: any[] = [];
  private _lines: any[] = [];
  private serverUrl: string = "";
  public data: any = {};

  public house_system = [
    { display: "Placidus", value: "P" },
    { display: "Koch", value: "K" }
  ];

  public hsy = _.first(this.house_system)?.value;

  constructor(private http: HttpClient, private responsive: BreakpointObserver ) {
    const responsive_matrix = [
      {
        breakpoint: '(min-width: 375px)',        
        width: 370,
        height: 370,
        margin: 1
        
      },
      {
        breakpoint: '(min-width: 428px)',        
        width: 410,
        height: 410,
        margin: 1        
      },
      {
        breakpoint: '(min-width: 600px)',        
        width: 590,
        height: 590,
        margin: 50        
      }
    ];
    this.responsive.observe(responsive_matrix.map(x => x.breakpoint)).subscribe(result => {
      if (result.matches) {
        responsive_matrix.forEach((r: any) => {
          if (result.breakpoints[r.breakpoint]) {
            this.width = r.width;
            this.height = r.height;
            this.margin = r.margin;
          }
        });
      }
      this.init();
    });
  }

  public format_position(p: number): string {
    return format_pos_in_zodiac(p);
  }

  public zodiac_options(p: any): any {
    let color = "#000";
    switch (p.name) {
      case SYMBOL_ZODIAC.Aries:
      case SYMBOL_ZODIAC.Leo:
      case SYMBOL_ZODIAC.Sagittarius:
        color = "#b00";
        break;
      case SYMBOL_ZODIAC.Taurus:
      case SYMBOL_ZODIAC.Virgo:
      case SYMBOL_ZODIAC.Capricorn:
        color = "#060";
        break;
      case SYMBOL_ZODIAC.Gemini:
      case SYMBOL_ZODIAC.Libra:
      case SYMBOL_ZODIAC.Aquarius:
          color = "#069";
          break;  
      case SYMBOL_ZODIAC.Cancer:
      case SYMBOL_ZODIAC.Scorpio:
      case SYMBOL_ZODIAC.Pisces:
        color = "#006";
        break;  
    }
    return { stroke_color: color };
  }

  private init(): void {
    this._planets = [];
    this._zodiac = [];
    this._houses = [];
    this._cusps = [];
    this._lines = [];

    this.http.get("config.json").subscribe((data:any) => {
      this.serverUrl = data.server;
    });

    this._explanation = "";

    this.cx = Math.trunc(this.width/2);
    this.cy = Math.trunc(this.height/2);
    this.outer_radius = Math.min(this.width/2, this.height/2) - this.margin;
    this.inner_radius = this.outer_radius - this.outer_radius / 5;
    this.house_radius = 2 * this.outer_radius / 5;
    
    for (let i = 0; i < 360; i++) {
      const n = i % 30 === 0 ? this.outer_radius - this.inner_radius : i % 10 === 0 ? 10 : 5;
      const p1 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius + n, i);
      const p2 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius, i);
      this.lines.push({
        p1,
        p2,
        options: { stroke_color: i % 30 === 0 ? "#000" : "#0007" }        
      });      
    }
    let index = 0;
    _.forOwn(SYMBOL_ZODIAC, (name) => {
      const p = this.get_point_on_circle(this.cx, this.cy, (this.outer_radius - this.inner_radius) / 2 + this.inner_radius, index * 30 + 15);
      this._zodiac.push({
        name,
        ...p        
      })
      index++;
    });
  }

  public draw(name: string) {   
    this.http.get(`${this.serverUrl}/natal?name=${name}&hsys=${this.hsy}`).subscribe((data: any) => {
      
      this.init();

      this.data = _.clone(data);
      console.log(data);

      for (let i = 0; i < 12; i++) {
        const house: any = _.find(data.Houses, (x: any) => x.index == i);        
        const a = house.position;
        const p1 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius, a);
        const p2 = this.get_point_on_circle(this.cx, this.cy, this.house_radius, a);
        this._lines.push({
          p1,
          p2,
          options: _.includes([0, 3, 6, 9], house.index) 
            ? house.index == 0 
              ? { stroke_color: "#090", stroke_width: 1.5 }
              : house.index == 9
                ? { stroke_color: "#900", stroke_width: 1.5 }
                : {} 
            : { stroke_dasharray: "3, 2" }
        }); 
        const b = i == 11 
          ? _.find(data.Houses, (x: any) => x.index == 0 )
          : _.find(data.Houses, (x: any) => x.index == i + 1 );          
        const c = nl360(a + nl180(b.position - a)/2);
        let p = this.get_point_on_circle(this.cx, this.cy, this.house_radius + 10, c);
        this._cusps.push(
          {
            name: 'Cusp' + house.symbol,
            ...p
          }
        );        
      }      
            
      const skyObjectsAdjusted = this.adjust(data.SkyObjects);

      skyObjectsAdjusted.forEach((so: any) => {

        const x = _.find(data.SkyObjects, x => x.name === so.name);        
        const p = this.get_point_on_circle(this.cx, this.cy, this.inner_radius - 15, so.angle);

        const p1 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius, x.position);
        const p2 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius -5, x.position);
        this._lines.push({
          p1,
          p2
        })
        this._planets.push({
          name: x.name,
          ...p,
          text: (x.speed < 0 ? 'R': '')
        });
      });
    });
  }

  public get sky_objects(): any[] {
    if (_.isEmpty(this.data)) { return []; }
    return this._planets.map(p => {
      return this.data.SkyObjects.find(x => x.name === p.name);
    }) || [];
  }

  private adjust(sos: any[]): any[] {
    const so_radius = this.inner_radius - 15;
    let points: any[] = [];
    sos.forEach(so => {
      const position = this.get_point_on_circle(this.cx, this.cy, so_radius, so.position);
      const point = { name: so.name, ...position, r: COLLISION_RADIUS * SYMBOL_SCALE, angle: so.position, pointer: so.position };
      points = this.locate(points, point, so_radius);
    });
    return points;
  }

  private in_collision(a: any, b: any): boolean {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx*dx + dy*dy) <= a.r + b.r;
  }

  private adjust_collision(p1: any, p2: any) {
    const step = 1;
    if (
        (p1.pointer <= p2.pointer && Math.abs(p1.pointer - p2.pointer) <= COLLISION_RADIUS) ||
        (p1.pointer >= p2.pointer && Math.abs(p1.pointer - p2.pointer) >= COLLISION_RADIUS)
      ) {
        p1.angle = nl360(p1.angle - step);
        p2.angle = nl360(p2.angle + step);
      } else {
        p1.angle = nl360(p1.angle + step);
        p2.angle = nl360(p2.angle - step);
      }
  }

  private locate(points: any[], point: any, radius: number): any[] {
    if (points.length == 0) {
      points.push(point);
      return points;
    }
    if ((2*Math.PI*radius) - (2*COLLISION_RADIUS*SYMBOL_SCALE*(points.length + 1)) <= 0) {
      throw new Error("Cannot resolve collistion");
    }
    let is_collision = false;
    points = _.sortBy(points, 'angle');
    let cp: any;
    for(let i = 0, len = points.length; i < len; i++) {        
        if (this.in_collision(points[i], point)) {
          is_collision = true;
          cp = points[i];
          cp.index = i;
          console.log(`Resolve conflict: ${cp.name} vs ${point.name}`);
          break;
        }
    }
    if (is_collision) {
      this.adjust_collision(cp, point);
      let p = this.get_point_on_circle(this.cx, this.cy, radius, cp.angle);
      cp.x = p.x;
      cp.y = p.y;
      p = this.get_point_on_circle(this.cx, this.cy, radius, point.angle);
      point.x = p.x;
      point.y = p.y;
      points.splice(cp.index, 1);

      points = this.locate(points, cp, radius);
      points = this.locate(points, point, radius);
    } else {
      points.push(point);
    }
    return points;
  }

  public get planets() {
    return this._planets;    
  }
  public get zodiac() {
    return this._zodiac;    
  }
  public get houses() {
    return this._houses;    
  }
  public get cusps() {
    return this._cusps;    
  }

  public get lines(): any[] {
    return this._lines;
  }

  public get_point_on_circle(cx: number, cy: number, radius: number, angle: number): { x: number, y: number  } {
    const a = (180 - angle) * Math.PI / 180;
    return { x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a) };
  }

  private _explanation: string = "";
  public get explain(): string {    
    return this._explanation;
  }

  public hsy_change(hsy: string) {    
    this.hsy = hsy;
    const name = _.get(this, "data.query.name", null);
    if (name) {
      //const query_string = Object.entries(this.data.query).map(([key, val]) => `${key}=${val}`).join('&');
      this.draw(name);
    }
  }

  public async interpret(): Promise<void> {
    const name = _.get(this, "data.query.name", null);
    if (name) {
      this.http.get(`${this.serverUrl}/interpretation?name=${name}&hsys=${this.hsy}`).subscribe((data: any) => {
        if (data && data.result) {
          this._explanation = data.result;
        }
      });
    }
  }

  public get has_name(): boolean {
    return !!_.get(this, "data.query.name", null);
  }
}
