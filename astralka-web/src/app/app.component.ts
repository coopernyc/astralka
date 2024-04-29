import { Component, OnInit } from '@angular/core';
import { ChartSymbol } from './chart-symbol';
import _ from "lodash";
import moment from "moment-timezone";
import { COLLISION_RADIUS, IPersonInfo, SYMBOL_ASPECT, SYMBOL_CUSP, SYMBOL_HOUSE, SYMBOL_PLANET, SYMBOL_SCALE, SYMBOL_ZODIAC, aspect_color, claculate_arrow, convert_DD_to_D, format_pos_in_zodiac, nl180, nl360, pos_in_zodiac, pos_in_zodiac_sign, random_point_on_the_line, rotate_point_around_center, zodiac_sign } from './common';
import { CommonModule } from '@angular/common';
import { ChartCircle } from './chart-circle';
import { ChartLine } from './chart-line';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { ChartText } from './chart-text';
import { StatsLine } from './stats-line';
import { StatsAspect } from './stats-aspect';
import { RestService } from './services/rest.service';
import { take } from 'rxjs';
import { PeopleLookup } from './controls/lookup';

@Component({
  selector: 'astralka-root',
  standalone: true,
  imports: [
    ChartSymbol, 
    ChartCircle, 
    ChartLine, 
    ChartText, 
    StatsLine,
    StatsAspect,
    CommonModule, 
    FormsModule, 
    LayoutModule,
    PeopleLookup
  ],
  template: `      
    
    <div style="margin: 2px; height: 32px;">            
      <lookup style="margin-right: 2px;" (selected)="onPersonSelected($event)"></lookup>
      <button (click)="show_entry_form = !show_entry_form">Person</button>
      <button (click)="show_transit_form = !show_transit_form">Transit</button>
      <div style="display: inline-block; margin-left: 2px;">        
        <select [ngModel]="hsy" (ngModelChange)="hsy_change($event)">
          <option *ngFor="let sh of house_systems" [selected]="sh.value === hsy" [value]="sh.value">{{sh.display}}</option>
        </select>
      </div>   
      <!--<button (click)="it_traits()" [disabled]="_.isEmpty(data)">IT traits</button>-->      
    </div>    
      
    @if (show_entry_form) {
      <form name="entry" class="entry-form" (submit)="onSubmitPerson()">
        <div class="entry-body">
          <div class="entry-group">
            <label>Name</label>
            <input class="triple" type="text" [(ngModel)]="entry.name" name="name">
          </div>
          <div class="entry-group">
            <label>Location name</label>
            <input class="triple" type="text" [(ngModel)]="entry.locationName" name="locationName">
          </div>
          <div class="entry-group">
            <label>Lattitude</label>
            <input class="double" type="number" [(ngModel)]="entry.latitude" min="-90" max="90" name="latitude">
          </div>
          <div class="entry-group">
            <label>Longitude</label>
            <input class="double" type="number" [(ngModel)]="entry.longitude" min="-180" max="180" name="longitude">
          </div>
          <div class="entry-group">
            <label>Elevation (m)</label>
            <input class="single" type="number" [(ngModel)]="entry.elevation" min="0" max="10000" name="elevation">
          </div>
          <div class="entry-group">
            <label>Date Time (Local)</label>
            <input type="datetime-local" [(ngModel)]="entry.dob" name="dob">
          </div>
          <div class="entry-group">
            <label>Time Zone</label>
            <input class="single" type="number" [(ngModel)]="entry.timezone" min="-12" max="12" name="timezone">
          </div>
        </div>
        
        <div class="entry-footer">
          <button type="button" name="btn-submit" (click)="onSavePerson()">Save</button>
          <button type="button" name="btn-submit">Clear</button>          
        </div> 
      </form>
    }
    

    @if (show_transit_form) {
      <form name="entry" class="entry-form" (submit)="onSubmitTransit()">
        <div class="entry-body">
          <!-- <div class="entry-group">
                <label>Lattitude</label>
                <input class="double" type="number" [(ngModel)]="transit.latitude" min="-90" max="90" name="latitude">
          </div>
          <div class="entry-group">
            <label>Longitude</label>
            <input class="double" type="number" [(ngModel)]="transit.longitude" min="-180" max="180" name="longitude">
          </div>
          <div class="entry-group">
            <label>Elevation</label>
            <input class="single" type="number" [(ngModel)]="transit.elevation" min="0" max="10000" name="elevation">
          </div> -->
          <div class="entry-group">
            <label>Date Time</label>
            <input type="datetime-local" [(ngModel)]="transit.date" name="date">
          </div>          
        </div>
        <div class="entry-footer">
            <button type="submit" name="btn-submit">Draw Chart</button>  
        </div> 
      </form>
    }

    <div id="container">
      @if (data && selectedPerson) {
        <article id="person-info">
          <section><b>Natal Data</b></section>
          <section>Name: {{selectedPerson.name}}</section>
          <section>Location: {{selectedPerson.location.name}}</section>
          <section>Lat/Long: {{selectedPerson.location.latitude}} : {{selectedPerson.location.longitude}}</section>
          <section>DateTime (UT): {{moment(selectedPerson.date).format('DD MMM YYYY hh:mm:ss')}}</section>
          <section>Age: {{age}}</section>
          <section>House System: {{houseSystemById}}</section>
          <section>{{data.dayChart?"Day Chart":"Night Chart"}}</section>
        </article>
      }
      @if (data && data.Transit) {
        <article id="transit-info" [style.left.px]="width - 180">    
          <section><b>Transit Data</b></section>      
          <!-- <section>Lat/Long: {{transit.latitude}} : {{transit.longitude}}</section> -->
          <section>DateTime (UT): {{moment(transit.date).format('DD MMM YYYY hh:mm:ss')}}</section>
          <!-- <section>House System: {{houseSystemById}}</section> -->
        </article>
      }
      
      <!-- <div style="position: absolute; display: block; top: 0px; left: 0; width: 50px; height: 50px;">
        <img src="assets/astralka-logo.svg">
      </div> -->
      <svg xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        version="1.1"
        [attr.width]="width"
        [attr.height]="height"
        [attr.viewBox]="'0 0 ' + width + ' ' + height"
        >
        <g>
          <rect x="0" y="0" [attr.width]="width" [attr.height]="height" fill="#f4eeea" stroke="#0004"></rect>           
          <g svgg-circle [cx]="cx" [cy]="cy" [radius]="outer_radius" [options]="{stroke_width: 2}"></g>
          <g [attr.transform-origin]="cx + ' ' + cy"  [attr.transform]="'rotate(' + offset_angle + ')'">
            <svg:circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="outer_radius-3" stroke="#009900" stroke-width="5" pathLength="360" stroke-dasharray="30 90 30 90 30 90" fill="none" />
            <svg:circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="outer_radius-3" stroke="#cc0000" stroke-width="5" pathLength="360" stroke-dasharray="0 30 30 90 30 90 30 60" fill="none" />
            <svg:circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="outer_radius-3" stroke="#336699" stroke-width="5" pathLength="360" stroke-dasharray="0 60 30 90 30 90 30 30" fill="none" />
            <svg:circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="outer_radius-3" stroke="#ffd900" stroke-width="5" pathLength="360" stroke-dasharray="0 90 30 90 30 90 30" fill="none" />
          </g>
          <g svgg-circle [cx]="cx" [cy]="cy" [radius]="inner_radius"></g>  
          <g [attr.transform-origin]="cx + ' ' + cy"  [attr.transform]="'rotate(' + offset_angle + ')'" svgg-line *ngFor="let l of lines" [x1]="l.p1.x" [y1]="l.p1.y" [x2]="l.p2.x" [y2]="l.p2.y" [options]="l.options"></g>
          <g svgg-symbol *ngFor="let p of zodiac" [x]="p.x" [y]="p.y" [name]="p.name" [options]="zodiac_options(p)"></g>
          @if (this.data && this.selectedPerson) {  
            <g svgg-circle [cx]="cx" [cy]="cy" [radius]="house_radius"></g>
            
            <g svgg-symbol *ngFor="let p of planets" [x]="p.x" [y]="p.y" [name]="p.name"></g>
            <g svgg-text *ngFor="let p of planets" [x]="p.x + 8" [y]="p.y + 5" [text]="p.text"></g>
            <g svgg-text *ngFor="let p of planets" [x]="p.label.pos.x" [y]="p.label.pos.y" [text]="p.label.angle" class="planets-angle"></g>
            
            <g svgg-symbol *ngFor="let p of cusps" [x]="p.x" [y]="p.y" [name]="p.name"></g>
            <g svgg-text *ngFor="let p of cusps" [x]="p.label.pos.x" [y]="p.label.pos.y" [text]="p.label.angle" class="planets-angle"></g>
            <g svgg-symbol *ngFor="let p of houses" class="angle" [x]="p.x" [y]="p.y" [name]="p.name" [options]="{scale: 0.8, stroke_color: '#333'}"></g>
            <g svgg-symbol *ngFor="let p of aspect_labels" [x]="p.x" [y]="p.y" [name]="p.name" [options]="p.options"></g>
            <g svgg-circle [cx]="cx" [cy]="cy" [radius]="20" [options]="{stroke_width: 2, stroke_color: data.dayChart?'black':'goldenrod', fill: data.dayChart?'goldenrod':'black'}"></g>
            <g svgg-symbol [x]="cx" [y]="cy" [name]="sign" [options]="{stroke_color: data.dayChart?'black':'goldenrod', scale: 1}"></g>
          }

          <!-- <g svgg-symbol [x]="30" [y]="30" [options]="{ scale: 1 }"></g>
          <g svgg-line [x1]="20" [y1]="30" [x2]="40" [y2]="30"></g>
          <g svgg-line [x1]="30" [y1]="20" [x2]="30" [y2]="40"></g>

          <g svgg-symbol [x]="60" [y]="30" [options]="{ scale: 2 }"></g>
          <g svgg-line [x1]="50" [y1]="30" [x2]="70" [y2]="30"></g>
          <g svgg-line [x1]="60" [y1]="20" [x2]="60" [y2]="40"></g>

          <g svgg-symbol [x]="90" [y]="30" [options]="{ scale: 0.5 }"></g>
          <g svgg-line [x1]="80" [y1]="30" [x2]="100" [y2]="30"></g>
          <g svgg-line [x1]="90" [y1]="20" [x2]="90" [y2]="40"></g> 

          <g svgg-symbol *ngFor="let p of aspects; let i = index;" [x]="30 + i * 30" [y]="60" [name]="p.name"></g>
          <g svgg-line [x1]="20" [y1]="60" [x2]="550" [y2]="60"></g> -->
        </g>        
      </svg>
      <svg xmlns="http://www.w3.org/2000/svg" 
          xmlns:xlink="http://www.w3.org/1999/xlink" 
          version="1.1"
          [attr.width]="width"
          [attr.height]="height"
          [attr.viewBox]="'0 0 ' + width + ' ' + height"             
          >
          <g>
            <rect x="0" y="0" [attr.width]="width" [attr.height]="height" fill="none" stroke="#0004"></rect>             
            <g svgg-stat-aspect [x]="10" [y]="10" [data]="data"></g>
          </g>
      </svg>
    </div>
    <div id="stats">
      <svg xmlns="http://www.w3.org/2000/svg" 
          xmlns:xlink="http://www.w3.org/1999/xlink" 
          version="1.1"
          [attr.width]="width"
          [attr.height]="320"
          [attr.viewBox]="'0 0 ' + width + ' 320'"        
          >
          <g>
            <rect x="0" y="0" [attr.width]="width" [attr.height]="320" fill="none" stroke="#0004"></rect> 
            <g svgg-text *ngIf="has_name" [x]="12" [y]="12" [text]="formatted_header"></g>
            <g svgg-stat-line *ngFor="let s of stat_lines" [x]="s.x" [y]="s.y" [stats]="s.stats"></g>
          </g>
      </svg>      
    </div>        
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  public width: number = 800;
  public height: number = 800;
  public margin: number = 100;
  public show_entry_form: boolean = false;
  public show_transit_form: boolean = false;
  public cx: number = 0;
  public cy: number = 0;
  public outer_radius: number = 0;
  public inner_radius: number = 0;
  public house_radius: number = 0;

  public offset_angle: number = 90;

  public entry = {
    name: '',
    locationName: '',
    latitude: 0,
    longitude: 0,
    dob: Date(),
    timezone: 0,
    elevation: 0
  };

  public transit: any = {
    latitude: 0,
    longitude: 0,
    date: moment.utc().toISOString().replace('Z',''),    
    elevation: 0
  };
  
  title = 'astralka-web';

  private _planets: any[] = [];
  private _zodiac: any[] = [];
  private _houses: any[] = [];
  private _cusps: any[] = [];
  private _lines: any[] = [];
  private _aspect_labels: any[] = [];
  private _stat_lines: any[] = [];
  private _aspects: any[] = [];
  private _house_systems: any[] = [];

  public data: any = {};
  public hsy: string = "P";

  constructor(private responsive: BreakpointObserver, private rest: RestService ) {

    const responsive_matrix = [      
      {
        breakpoint: '(min-width: 428px)',        
        width: 600,
        height: 600,
        margin: 50        
      },
      {
        breakpoint: '(min-width: 805px)',        
        width: 800,
        height: 800,
        margin: 100       
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

  public get houseSystemById(): string {
    return this.house_systems.find(x => x.value === this.hsy)?.display ?? '';
  }

  public get age(): string {
    if (this.data && this.selectedPerson) {
      const bd = moment.utc(this.selectedPerson.date);
      return moment.utc().diff(bd, 'years')+ '';
    }
    return '';
  }

  ngOnInit(): void {
    this.rest.ready$.pipe(take(1)).subscribe(() => {
      this.rest.house_systems().subscribe((data: any[]) => {
        console.log(data);
        this._house_systems = data.map(x => {
          return {
            display: x.name,
            value: x.id
          };
        });
        this.hsy = _.find(this.house_systems, x => x.value === "P")?.value;        
      });
    });    
  }

  public get sign(): string {
    if (this.data && this.data.SkyObjects) {
      return zodiac_sign(this.data.SkyObjects.find(x => x.name === SYMBOL_PLANET.Sun).position);
    }
    return '';
  }

  public onSubmitPerson() {    
    console.log(this.entry);
    this.draw2();
  }

  public onSubmitTransit() {
    this.draw2();
  }
  
  public get house_systems(): any[] {
    return this._house_systems;
  }

  public format_position(p: number): string {
    return format_pos_in_zodiac(p);
  }

  public zodiac_options(p: any): any {
    let color = "#ffdd00";
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
          color = "#930";
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
    this._cusps = [];
    this._lines = [];
    this._aspect_labels = [];
    this._houses = [];
    this._aspects = [];
    this.data = {};

    this._explanation = "";

    this.cx = Math.trunc(this.width/2);
    this.cy = Math.trunc(this.height/2);
    this.outer_radius = Math.min(this.width/2, this.height/2) - this.margin;
    this.inner_radius = this.outer_radius - this.outer_radius / 6;
    this.house_radius = this.inner_radius * 5 / 7;
    
    //  assemble ruller lines
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
    // assemble zodiac signs
    let index = 0;
    _.forOwn(SYMBOL_ZODIAC, (name) => {
      const p = this.get_point_on_circle(this.cx, this.cy, (this.outer_radius - this.inner_radius) / 2 + this.inner_radius, index * 30 + 15 - this.offset_angle);
      this._zodiac.push({
        name,
        ...p        
      })
      index++;
    });
  }

  private handleChartData(data: any) {
    this.offset_angle = data.Houses[0].position;

      this.init();

      this.data = _.clone(data);
      console.log(data);

      for (let i = 0; i < 12; i++) {
        // assemble houses
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
                : { stroke_color: "#000", stroke_width: 1}
            : { stroke_color: "#000", stroke_width: 1}
        }); 

        if (_.includes([0, 3, 6, 9], i)) {
          const p1 = this.get_point_on_circle(this.cx, this.cy, this.outer_radius, a);
          const p2 = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 25, a);
          const options = _.includes([0, 3, 6, 9], house.index) 
          ? house.index == 0 
            ? { stroke_color: "#090", stroke_width: 1.5 }
            : house.index == 9
              ? { stroke_color: "#900", stroke_width: 1.5 }
              : { stroke_color: "#000", stroke_width: 1}
          : { stroke_color: "#000", stroke_width: 1};
          this._lines.push({
            p1,
            p2,
            options
          }); 
          if (i == 0 || i == 9) {
            this._lines.push(
              ...claculate_arrow(9, 4, p1, p2, options)
            );          
          }
        }

        const b = i == 11 
          ? _.find(data.Houses, (x: any) => x.index == 0 )
          : _.find(data.Houses, (x: any) => x.index == i + 1 );     
             
        const c = nl360(a + nl180(b.position - a)/2) - this.offset_angle;
        let p = this.get_point_on_circle(this.cx, this.cy, this.house_radius + 10, c);
        const p_label = this.get_point_on_circle(this.cx, this.cy, this.house_radius + 22, c);
        this._cusps.push(
          {
            name: 'Cusp' + house.symbol,
            ...p,
            label: {
              angle: convert_DD_to_D(pos_in_zodiac_sign(a)),
              pos: {
                ...p_label
              }
            }
          }
        ); 
        if (_.includes([0, 3, 6, 9], i)) {
          const c = house.position - this.offset_angle;
          let p = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 35, c);
          this._houses.push({
            name: i == 0 
              ? SYMBOL_HOUSE.Ascendant 
              : i == 3 
                ? SYMBOL_HOUSE.ImmumCoeli
                : i == 9
                  ? SYMBOL_HOUSE.MediumCoeli
                  : SYMBOL_HOUSE.Descendant,
            ...p
          });
        }
      }      
      
      // resolve sky objects collision
      const skyObjectsAdjusted = this.adjust(data.SkyObjects);
      skyObjectsAdjusted.forEach((so: any) => {
        // assemble sky objects
        const x = _.find(data.SkyObjects, x => x.name === so.name);        
        const p = this.get_point_on_circle(this.cx, this.cy, this.inner_radius - 15, so.angle - this.offset_angle);
        const p1 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius, x.position);
        const p2 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius -5, x.position);
        const p_label = this.get_point_on_circle(this.cx, this.cy, this.inner_radius - 32.5, so.angle - this.offset_angle);
        this._lines.push({
          p1,
          p2
        })
        this._planets.push({
          name: x.name,
          ...p,
          text: (x.speed < 0 ? 'r': ''),
          label: {
            angle: convert_DD_to_D(pos_in_zodiac_sign(x.position)),
            pos: {
              ...p_label
            }
          }
        });
      });

      if (data.Transit) {
        const skyObjectsTransitAdjusted = this.adjust(data.Transit.SkyObjects.filter(x => {
          return _.includes([
            SYMBOL_PLANET.Sun,
            SYMBOL_PLANET.Moon,
            SYMBOL_PLANET.Mercury,
            SYMBOL_PLANET.Venus,
            SYMBOL_PLANET.Mars,
            SYMBOL_PLANET.Jupiter,
            SYMBOL_PLANET.Saturn,
            SYMBOL_PLANET.Uranus,
            SYMBOL_PLANET.Neptune,
            SYMBOL_PLANET.Pluto,
            SYMBOL_PLANET.Lilith,
            SYMBOL_PLANET.Chiron
          ], x.name)
        }));
        skyObjectsTransitAdjusted.forEach((so: any) => {
          // assemble sky objects
          const x = _.find(data.Transit.SkyObjects, x => x.name === so.name);        
          const p = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 15, so.angle - this.offset_angle);
          const p1 = this.get_point_on_circle(this.cx, this.cy, this.outer_radius, x.position);
          const p2 = this.get_point_on_circle(this.cx, this.cy, this.outer_radius +5, x.position);
          const p_label = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 36, so.angle - this.offset_angle);
          this._lines.push({
            p1,
            p2
          })
          this._planets.push({
            name: x.name,
            ...p,
            text: (x.speed < 0 ? 'r': ''),
            label: {
              angle: convert_DD_to_D(pos_in_zodiac_sign(x.position)),
              pos: {
                ...p_label
              }
            }
          });
        });
      }

      const aspects = this.data.Aspects.filter((x: any) => 
        _.includes([0, 180, 90, 120, 60, 150, 30, 45, 135, 40, 51.4, 72, 144, 36, 100, 108, 102.8, 154.2, 18], x.aspect.angle) && !_.some(x.parties, p => _.includes(['2 house', '3 house', '5 house', '6 house', '8 house', '9 house', '11 house', '12 house'], p.name))
      );      
      _.uniqBy(aspects.flatMap((x: any) => x.parties), 'name')           
      .forEach((x: any) => {
        const p1 = this.get_point_on_circle(this.cx, this.cy, this.house_radius + 2, x.position);
        const p2 = this.get_point_on_circle(this.cx, this.cy, this.house_radius - 2, x.position);
        this.lines.push({
          p1,
          p2,
          options: { stroke_color: "#000000" }
        });
      });

      aspects.forEach((x: any) => {
        const p1 = this.get_point_on_circle(this.cx, this.cy, this.house_radius - 2, x.parties[0].position);
        const p2 = this.get_point_on_circle(this.cx, this.cy, this.house_radius - 2, x.parties[1].position);        
        let options = aspect_color(x.aspect.angle);                
        this.lines.push({
          p1,
          p2,
          options
        });

        if (x.aspect.name !== SYMBOL_ASPECT.Conjunction) {
          const rnd_p = random_point_on_the_line(p1, p2);
          const p = rotate_point_around_center({x: this.cx, y: this.cy}, rnd_p, this.offset_angle);
          this.aspect_labels.push({
            ...p,
            name: x.aspect.name,
            options
          });
        }
      });

      // stat lines
      let cnt = 1;
      this._stat_lines = [];  
      const sun_house = this.data.SkyObjects.find(so => so.name === SYMBOL_PLANET.Sun).house.index + 1;    
      this.data.dayChart = _.includes([7,8,9,10,11,12], sun_house);
      this.data.SkyObjects.forEach((so: any) => {
        const STAT_MARGIN = 12;
        this._stat_lines.push({
          x: STAT_MARGIN,
          y: STAT_MARGIN + cnt * 18,
          stats: {
            name: so.name,
            label: so.name,
            position: pos_in_zodiac(so.position),
            speed: so.speed,
            house: so.house.symbol + ' House',
            dignities: this.format_dignities(so)
          }
        });
        cnt++;
      });
      cnt = 1;
      this.data.Houses.forEach((so: any) => {
        const STAT_MARGIN = 12;
        this._stat_lines.push({
          x: 300,
          y: STAT_MARGIN + cnt * 18,
          stats: {            
            name: 'Cusp' + so.symbol,
            label: "House",            
            position: pos_in_zodiac(so.position)
          }
        });
        cnt++;
      });
      this._aspects = aspects;  
  }

  public draw2() {
    if (this.selectedPerson) {
      const load: any = {
        natal: _.assign({}, this.selectedPerson, {hsys: this.hsy})      
      };
      if (this.transit) {
        load.transit = {
          name: 'TRANSIT',
          date: this.transit.date,
          location: {
            latitude: this.transit.latitude,
            longitude: this.transit.longitude,
            elevation: this.transit.elevation
          },
          hsys: this.hsy
        };
      }
      this.rest.chart_data(load).subscribe(this.handleChartData.bind(this));
    }
  }

  public selectedPerson!: IPersonInfo;

  public onPersonSelected(person: IPersonInfo): void {
    console.log(person);
    this.selectedPerson = person;     
    this.entry.name = person.name;
    this.entry.locationName = person.location.name;
    this.entry.longitude = person.location.longitude;
    this.entry.latitude = person.location.latitude;
    this.entry.elevation = person.location.elevation;
    this.entry.timezone = Math.ceil(person.location.longitude / 15);
    this.entry.dob = moment(person.date).add(this.entry.timezone, 'hours').toISOString().replace('Z','');
    this.draw2();       
  }


  private format_dignities(so: any): string {
    const sign: string = zodiac_sign(so.position);
    let result: string[] = [];
    let score: number = 6;
    if (_.some(_.get(so, "dignities.domicile", []), x => x === sign)) {
      result.push("Dom");
      score += 3;
    } else if (_.some(_.get(so, "dignities.exaltation", []), x => x === sign)) {
      result.push("Exl");
      score += 2;
    } else if (_.some(_.get(so, "dignities.detriment", []), x => x === sign)) {
      result.push("Det");
      score -= 3;
    } else if (_.some(_.get(so, "dignities.fall", []), x => x === sign)) {
      result.push("Fall");
      score -= 2;
    } else if (_.some(_.get(so, "dignities.friend", []), x => x === sign)) {
      result.push("Fnd");
      score += 1;
    } else if (_.some(_.get(so, "dignities.enemy", []), x => x === sign)) {
      result.push("Emy");
      score -= 1;
    }
    if (so.oriental) {
      result.push("Ori");
      score += 1;
    } else {
      result.push("Occ");
      score -= 1;
    }
    if (so.speed >= 0) {
      score += 1;
    } else {
      score -= 1;
    }
    if (_.includes([1, 4, 7, 10], so.house.index + 1)) {
      score += 1;
    } else if (_.includes([12, 9, 6, 3], so.house.index + 1)) {
      score -= 1;
    }
    if (this.data.dayChart) {
      if (_.includes([SYMBOL_PLANET.Sun, SYMBOL_PLANET.Mars, SYMBOL_PLANET.Jupiter, SYMBOL_PLANET.Uranus], so.name)) {
        score += 1;
      }
      if (so.oriental && _.includes([SYMBOL_PLANET.Mercury, SYMBOL_PLANET.Neptune], so.name)) {
        score += 1;
      }
    } else {
      if (_.includes([SYMBOL_PLANET.Venus, SYMBOL_PLANET.Moon, SYMBOL_PLANET.Saturn, SYMBOL_PLANET.Pluto], so.name)) {
        score += 1;
      }
      if (!so.oriental && _.includes([SYMBOL_PLANET.Mercury, SYMBOL_PLANET.Neptune], so.name)) {
        score += 1;
      }
    }
    //result.push(` (${score})`);

    return result.join('.');
  } 

  public get formatted_header(): string {    
    return `Details for ${this.data.query.name} ${this.data.query.lat}`;
  }

  public get sky_objects(): any[] {
    if (_.isEmpty(this.data)) { return []; }
    return this._planets.map(p => {
      return this.data.SkyObjects.find(x => x.name === p.name);
    }) || [];
  }

  private adjust(sos: any[], transit: boolean = false): any[] {
    const so_radius = transit ? this.outer_radius + 15 : this.inner_radius - 15;
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
          //console.log(`Resolve conflict: ${cp.name} vs ${point.name}`);
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
  public get aspect_labels(): any[] {
    return this._aspect_labels;
  }

  public get aspects(): any[] {
    return this._aspects;
  }

  public get stat_lines(): any[] {
    return this._stat_lines;
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
    if (this.selectedPerson) {
      this.draw2();
    }    
  }

  public get has_name(): boolean {
    return !!_.get(this, "data.query.name", null);
  }

  public it_traits(): void {   
    const planets: string[] = _.reduce(this.stat_lines, (acc: string[], line: any) => {
      if (_.startsWith(line.stats.name, 'Cusp')) {
        return acc;
      }
      const stats = line.stats;
      acc.push(`${stats.label} in ${stats.position.sign}/${stats.house}`);
      return acc;
    }, []);
    console.log(planets.join(', '));

    //const prompt = `Write summary about what are programmer's traits, prefered programming language and favorable IT sphere based on the following information:  ${planets.join(', ')}.`;
    const prompt = `Write summary about what is the preferred careers and list specific professions based on the following information:  ${planets.join(', ')}.`;

    this.rest.explain({prompt}).subscribe((data: any) => {
      console.log(data);
    });
  }

  public async onSavePerson(): Promise<void> {
    const save = {
      name: this.entry.name,
      date: moment.utc(this.entry.dob).add(-this.entry.timezone, 'hours').toDate(),
      location: {
        latitude: this.entry.latitude,
        longitude: this.entry.longitude,
        elevation: this.entry.elevation,
        name: this.entry.locationName
      }
    }
    this.rest.save(save).subscribe();
  }

  public _ = _;
  public moment = moment;
}


