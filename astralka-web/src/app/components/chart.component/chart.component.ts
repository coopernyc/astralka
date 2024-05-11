import {Component, DestroyRef, inject, NgZone, OnInit} from '@angular/core';
import {ChartSymbol} from '../../controls/graphics/chart-symbol';
import _ from "lodash";
import moment from "moment-timezone";
import {
  aspect_color,
  calculate_arrow,
  COLLISION_RADIUS,
  convert_DD_to_D,
  convert_lat_to_DMS,
  convert_long_to_DMS,
  Gender,
  IPersonEntry,
  IPersonInfo,
  IToolbarCmd,
  latinAboutSign,
  nl180,
  nl360,
  one_third_point_on_the_line,
  PersonScope,
  perspectives,
  pos_in_zodiac,
  pos_in_zodiac_sign,
  rnd_suffix,
  rotate_point_around_center,
  SYMBOL_ASPECT,
  SYMBOL_HOUSE,
  SYMBOL_PLANET,
  SYMBOL_SCALE,
  SYMBOL_ZODIAC,
  ToolbarAlign,
  ToolbarCmdMask,
  ToolbarDisplay,
  ToolbarMenuSpan,
  zodiac_sign
} from '../../common';
import {CommonModule} from '@angular/common';
import {ChartCircle} from '../../controls/graphics/chart-circle';
import {ChartLine} from '../../controls/graphics/chart-line';
import {FormsModule} from '@angular/forms';
import {BreakpointObserver, LayoutModule} from '@angular/cdk/layout';
import {ChartText} from '../../controls/graphics/chart-text';
import {StatsLine} from '../../controls/graphics/stats-line';
import {StatsAspect} from '../../controls/graphics/stats-aspect';
import {RestService} from '../../services/rest.service';
import {Observable, shareReplay} from 'rxjs';
import {AstralkaLookupControlComponent} from '../../controls/lookup/lookup';
import {AstralkaSliderControlComponent} from "../../controls/slider/slider";
import {AstralkaAspectSettingsComponent} from "../../controls/settings/aspect.settings";
import {SettingsService} from "../../services/settings.service";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {AstralkaTransitSettingsComponent} from "../../controls/settings/transit.settings";
import {AstralkaPositionDataComponent} from "../../controls/position.data/position.data";
import {AstralkaAspectMatrixComponent} from "../../controls/matrix/matrix";
import {AstralkaLoaderDirective} from "../../controls/loader.directive";
import markdownit from "markdown-it";
import {SafeHtmlPipe} from "../../controls/safe.html.pipe";
import {AstralkaHouseSystemSettingsComponent} from "../../controls/settings/house.system.settings";
import {AstralkaAuthService} from "../../services/auth.service";
import {SessionStorageService} from "../../services/session.storage.service";
import {Router} from "@angular/router";
import {AstralkaPersonComponent} from "../person.component/person.component";
import {AstralkaTransitComponent} from "../transit.component/transit.component";
import {AstralkaToolbarComponent} from "../../controls/toolbar/toolbar";
import {faBaby, faMeteor, faSignOut, faUserAstronaut, faUserNinja} from "@fortawesome/free-solid-svg-icons";
import config from "assets/config.json";
import {AstralkaRotateImageComponent} from "../../controls/rotate.image/rotate.image";

@Component({
  selector: 'astralka-chart',
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
    AstralkaLookupControlComponent,
    AstralkaSliderControlComponent,
    AstralkaAspectSettingsComponent,
    AstralkaTransitSettingsComponent,
    AstralkaPositionDataComponent,
    AstralkaAspectMatrixComponent,
    AstralkaLoaderDirective,
    SafeHtmlPipe,
    AstralkaHouseSystemSettingsComponent,
    AstralkaPersonComponent,
    AstralkaTransitComponent,
    AstralkaToolbarComponent,
    AstralkaRotateImageComponent
  ],
  template: `
    <div class="astralka-container">

      <div style="display: flex; flex-direction: column;" [style.width.px]="width">
        <astralka-toolbar [commands]="commands">
          Name
          <lookup
            style="margin-right: 2px;"
            [query]="selectedPerson? selectedPerson.name : ''"
            (selected)="onPersonSelected($event)">
          </lookup>
        </astralka-toolbar>
        @if (show_entry_form) {
          <astralka-person
            [entry]="entry"
            (clear)="onPersonClear()"
            (saved)="onPersonSaved($event)"
            (deleted)="onPersonRemoved()"
          ></astralka-person>
        }
        @if (show_transit_form) {
          <astralka-transit
            [transit]="transit"
            [person]="selectedPerson"
            (changed)="draw()"
          ></astralka-transit>
        }

        <div id="container">
          @if (data && selectedPerson) {
            <article id="person-info">
              <section><b>Natal Data</b></section>
              <section>Name: {{ selectedPerson.name }}</section>
              <section>Loc: {{ selectedPerson.location.name }}</section>
              <section>Lat: {{ convert_lat_to_DMS(selectedPerson.location.latitude) }}
                , {{ selectedPerson.location.latitude }}°{{ selectedPerson.location.latitude >= 0 ? 'N' : 'S' }}
              </section>
              <section>Long: {{ convert_long_to_DMS(selectedPerson.location.longitude) }}
                , {{ selectedPerson.location.longitude }}°{{ selectedPerson.location.longitude >= 0 ? 'E' : 'W' }}
              </section>
              <section>Offset from UTC: {{ selectedPerson.timezone }}hours,
                Elevation: {{ selectedPerson.location.elevation }}m
              </section>
              <section>DOB: {{ moment(selectedPerson.date).format('DD MMM YYYY, hh:mm a') }}</section>
              <section>Age: {{ age }}, Gender: {{ selectedPerson.gender === Gender.Male ? 'Male' : 'Female' }}</section>
              <section>House System: {{ selectedHouseSystemName }}</section>
              <section>{{ data.dayChart ? "Day Chart" : "Night Chart" }}, Score: {{ avg_score.toFixed(3) }}</section>
              <section>
                <astralka-position-data [positions]="stat_lines">Planets</astralka-position-data>
              </section>
              <section>
                <astralka-position-data [kind]="'houses'" [positions]="stat_lines">Houses</astralka-position-data>
              </section>
              <section>
                <astralka-matrix [data]="data">Matrix</astralka-matrix>
              </section>
            </article>
          }
          @if (data && data.Transit) {
            <article id="transit-info" [style.left.px]="width - 220">
              <section><b>Transit/Progression Data</b></section>
              <!-- <section>Lat/Long: {{transit.latitude}} : {{transit.longitude}}</section> -->
              <section>DateTime (UT): {{ moment($any(calculatedTransitDateStr)).format('DD MMM YYYY HH:mm:ss') }}
              </section>
              <section style="margin-top: 4px; text-align: right">
                <astralka-transit-settings>Show Transits</astralka-transit-settings>
              </section>
              <section>
                <astralka-aspect-settings>Show Aspects</astralka-aspect-settings>
              </section>
              <section>
                <astralka-house-system>House System</astralka-house-system>
              </section>
              <section>
                <button (click)="show_explanation = !show_explanation"
                        [innerHTML]="show_explanation?'Hide Explain':'Show Explain'"></button>
              </section>
            </article>
          }

          <!-- <div style="position: absolute; display: block; top: 0px; left: 0; width: 50px; height: 50px;">
            <img src="assets/astralka-logo.svg">
          </div> -->


          <svg style="position: absolute; left: 0"
               [style.flex]="'flex: 0 ' + width + 'px'" xmlns="http://www.w3.org/2000/svg"
               [attr.width]="width"
               [attr.height]="height"
               [attr.viewBox]="'0 0 ' + width + ' ' + height"
               #chart
          >
            <defs>
              <filter x="0" y="0" width="1" height="1" id="solid">
                <feFlood flood-color="#f4eeeadd" />
                <feComposite in2="SourceGraphic" operator="out" />
              </filter>
            </defs>
            <g>
              <!-- outside rectangle -->
              <rect x="0" y="0" [attr.width]="width" [attr.height]="height" fill="#f4eeea" stroke="#0004"></rect>
              <!-- outer circle -->
              <g svgg-circle [cx]="cx" [cy]="cy" [radius]="outer_radius" [options]="{stroke_width: 2}"></g>
              <!-- colored segments for zodiacs -->
              <g [attr.transform-origin]="cx + ' ' + cy" [attr.transform]="'rotate(' + offset_angle + ')'">
                <svg:circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="outer_radius-3" stroke="#009900" stroke-width="5"
                            pathLength="360" stroke-dasharray="30 90 30 90 30 90" fill="none"/>
                <svg:circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="outer_radius-3" stroke="#cc0000" stroke-width="5"
                            pathLength="360" stroke-dasharray="0 30 30 90 30 90 30 60" fill="none"/>
                <svg:circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="outer_radius-3" stroke="#336699" stroke-width="5"
                            pathLength="360" stroke-dasharray="0 60 30 90 30 90 30 30" fill="none"/>
                <svg:circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="outer_radius-3" stroke="#ffd900" stroke-width="5"
                            pathLength="360" stroke-dasharray="0 90 30 90 30 90 30" fill="none"/>
              </g>
              <!-- inner 2 circles and 1 and 10 deg scale ruler -->
              <g svgg-circle [cx]="cx" [cy]="cy" [radius]="inner_radius"></g>
              <g svgg-circle [cx]="cx" [cy]="cy" [radius]="inner_radius + 5" [options]="{stroke_color: '#777'}"></g>
              <g [attr.transform-origin]="cx + ' ' + cy" [attr.transform]="'rotate(' + offset_angle + ')'" svgg-line
                 *ngFor="let l of lines" [x1]="l.p1.x" [y1]="l.p1.y" [x2]="l.p2.x" [y2]="l.p2.y"
                 [options]="l.options"></g>
              <!-- zodiac symbols -->
              <g svgg-symbol *ngFor="let p of zodiac" [x]="p.x" [y]="p.y" [name]="p.name"
                 [options]="zodiac_options(p)"></g>

              <!-- only when personal data is ready to be displayed and person selected -->
              @if (this.data && this.selectedPerson) {

                <!-- latin phrase for the sign drawn along a circular path -->
                <g>
                  <path
                    id="sector_path_0"
                    [attr.d]="'M '+ cx +' ' + cy + 'm 0 ' + house_radius/2 + ' a ' + house_radius/2 + ',' + house_radius/2 + ' 0 1,1 0,-' + house_radius + ' a ' + house_radius/2 + ',' + house_radius/2 + ' 0 1,1 0 ' + house_radius + ' z'"
                    fill="none"
                  ></path>
                  <text class="segment-label" x="0" y="0" dy="-2">
                    <textPath xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sector_path_0" startOffset="50%"
                              text-anchor="middle">
                      {{ latin_phrase?.phrase }}
                    </textPath>
                  </text>
                </g>

                <!-- inner house circle -->
                <g svgg-circle [cx]="cx" [cy]="cy" [radius]="house_radius"></g>

                <!-- natal planet symbols -->
                <g svgg-symbol *ngFor="let p of planets" [x]="p.x" [y]="p.y" [name]="p.name" [fillBackground]="true" [fillBackgroundColor]="'#f4eeeadd'"></g>
                <!-- natal r for retrograde planet text -->
                <g svgg-text *ngFor="let p of planets" [x]="p.x + 8" [y]="p.y + 5" [text]="p.text"></g>
                <!-- natal planet angle in sign -->
                <g svgg-text *ngFor="let p of planets" [x]="p.label.pos.x" [y]="p.label.pos.y" [text]="p.label.angle"
                   class="planets-angle"></g>

                <g svgg-symbol *ngFor="let p of cusps" [x]="p.x" [y]="p.y" [name]="p.name"></g>
                <g svgg-text *ngFor="let p of cusps" [x]="p.label.pos.x" [y]="p.label.pos.y" [text]="p.label.angle"
                   class="planets-angle"></g>
                <g svgg-symbol *ngFor="let p of houses" class="angle" [x]="p.x" [y]="p.y" [name]="p.name"
                   [options]="{scale: 0.8, stroke_color: '#333'}"></g>
                <g svgg-symbol *ngFor="let p of aspect_labels" [x]="p.x" [y]="p.y" [name]="p.name"
                   [options]="p.options"></g>
                <g svgg-circle [cx]="cx" [cy]="cy" [radius]="20"
                   [options]="{stroke_width: 2, stroke_color: data.dayChart?'black':'goldenrod', fill: data.dayChart?'goldenrod':'black'}"></g>
                <g svgg-symbol [x]="cx" [y]="cy" [name]="sign"
                   [options]="{stroke_color: data.dayChart?'black':'goldenrod', scale: 1}"></g>

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
          @if (show_explanation) {
            <div
              [overlayLoader]="sharedExplain$"
              class="bot-panel"
              [style.top.px]="height - 400 - 2" [style.width.px]="width - 4"
            >
              <div class="bot-panel-handler">
                {{ latin_phrase?.eng }}
              </div>
              <div style="flex: 1; display: flex; flex-direction: row; overflow: hidden">
                <div class="bot-panel-content" id="explanation">
                  @for (e of explanation; track e; let idx = $index) {
                    @if (idx !== 0) {
                      <hr class="una"/>
                    }
                    <p [innerHTML]="e.text | safeHtml"></p>
                    <!-- + <span style='padding-right: 4px; color: #777; font-size: 10px;'>{{e.timestamp}}</span> -->
                  }
                </div>
                <!-- placeholder for a rotating image component -->
                @if (config.rotate_images && rotate_image) {
                  <div style="flex: 0 320px; display: flex;">
                    <astralka-rotate-image [rotator]="rotate_image" [width]="320"
                                           [height]="400"></astralka-rotate-image>
                  </div>
                }
              </div>
            </div>
          }
        </div>

      </div>
    </div>

  `,
  styleUrls: ['./chart.component.scss']
})
export class AstralkaChartComponent implements OnInit {
  public width: number = 800;
  public height: number = 1200;
  public margin: number = 100;
  public show_entry_form: boolean = false;
  public show_transit_form: boolean = false;
  public cx: number = 0;
  public cy: number = 0;
  public outer_radius: number = 0;
  public inner_radius: number = 0;
  public house_radius: number = 0;
  public offset_angle: number = 90;
  public show_explanation: boolean = false;

  public entry: IPersonEntry = {
    name: '',
    locationName: '',
    latitude: 0,
    longitude: 0,
    dob: Date(),
    timezone: 0,
    elevation: 0,
    gender: Gender.Male,
    scope: PersonScope.Private
  };

  public transit: any = {
    latitude: 0,
    longitude: 0,
    date: moment.utc().toISOString().replace('Z', ''),
    elevation: 0,
    offset: 0
  };

  private _planets: any[] = [];
  private _zodiac: any[] = [];
  private _houses: any[] = [];
  private _cusps: any[] = [];
  private _lines: any[] = [];
  private _aspect_labels: any[] = [];
  private _stat_lines: any[] = [];
  private _aspects: any[] = [];
  public data: any = {};
  public selectedPerson: IPersonInfo | undefined;

  public moment = moment;
  private _explanation: any[] = [];
  private _destroyRef = inject(DestroyRef);

  public sharedExplain$!: Observable<any>;

  public commands: IToolbarCmd[] = [];

  public rotate_image!: any;

  constructor(
    private responsive: BreakpointObserver,
    private rest: RestService,
    private settings: SettingsService,
    private auth: AstralkaAuthService,
    private session: SessionStorageService,
    private router: Router,
    private zone: NgZone
  ) {
  }

  ngOnInit(): void {

    this.commands = [
      {
        mask: ToolbarCmdMask.All,
        type: 'item',
        hidden: false,
        align: ToolbarAlign.Left,
        display: ToolbarDisplay.Icon,
        iconResolver: () => {
          return this.show_entry_form
            ? { icon: faUserAstronaut, cssClass: 'icon-on'  }
            : { icon: faUserAstronaut, cssClass: ''  }
        },
        disabled: () => false,
        tooltip: 'Person Natal Data Entry',
        action: () => {
          this.show_entry_form = !this.show_entry_form;
        }
      },
      {
        mask: ToolbarCmdMask.All,
        type: 'item',
        hidden: false,
        align: ToolbarAlign.Left,
        display: ToolbarDisplay.Icon,
        iconResolver: () => {
          return this.show_transit_form
            ? { icon: faMeteor, cssClass: 'icon-on'  }
            : { icon: faMeteor, cssClass: ''  }
        },
        disabled: () => false,
        tooltip: 'Transits or Progression Date',
        action: () => {
          this.show_transit_form = !this.show_transit_form;
        }
      },
      {
        mask: ToolbarCmdMask.NavBar,
        type: 'menu',
        hidden: false,
        display: ToolbarDisplay.Icon,
        menuSpan: ToolbarMenuSpan.Triple,
        icon: faBaby,
        //label: "Perspectives",
        disabled: () => !(this.data && this.selectedPerson),
        tooltip: 'Perspectives',
        commands: perspectives
          .sort((a: any, b: any) => a.label.localeCompare(b.label, 'standard', { sensitivity: 'case'}))
          .map((perspective: any) => {
          return {
            mask: ToolbarCmdMask.NavBar,
            type: 'item',
            hidden: false,
            display: ToolbarDisplay.IconAndText,
            icon: perspective.icon,
            label: perspective.label,
            disabled: () => false,
            tooltip: perspective.tooltip ?? perspective.label,
            action: () => {
              this.perspective(perspective.prompt);
            }
          };
        })
      },
      {
        mask: ToolbarCmdMask.All,
        type: 'item',
        hidden: false,
        align: ToolbarAlign.Right,
        display: ToolbarDisplay.IconAndText,
        icon: faUserNinja,
        label: this.username,
        disabled: () => false,
        tooltip: 'Profile',
        action: () => {
        }
      },
      {
        mask: ToolbarCmdMask.All,
        type: 'item',
        hidden: false,
        align: ToolbarAlign.Right,
        display: ToolbarDisplay.Icon,
        icon: faSignOut,
        disabled: () => false,
        tooltip: 'Sign Out',
        action: () => {
          this.logout();
        }
      }
    ];

    const responsive_matrix = [
      {
        breakpoint: '(min-width: 428px)',
        width: 600,
        height: 900,
        margin: 50
      },
      {
        breakpoint: '(min-width: 805px)',
        width: 800,
        height: 1100,
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
      if (this.selectedPerson) {
        this.draw();
      }
    });

    const loggedIn = this.session.isLoggedIn();
    if (!loggedIn) {
      this.router.navigate(['']).then();
      return;
    }

    this.settings.settings_change$.pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe(_ => {
      this.draw();
    });

    this.sharedExplain$ = this.rest.explain$.pipe(
      takeUntilDestroyed(this._destroyRef),
      shareReplay(2)
    );

    this.sharedExplain$.subscribe((data: any) => {
      this.show_explanation = true;
      if (data.result === 'LOADING!') {
        let name: string;
        if (data.context) {
          name = data.context;
        } else {
          const names: string[] = [
            ..._.values(SYMBOL_ZODIAC),
            ..._.values(SYMBOL_PLANET),
            //..._.values(SYMBOL_ASPECT)
          ];
          name = names[_.random(names.length - 1)];
        }
        this.rotate_image = {
          name: name + '.' + rnd_suffix(),
          description: name
        };
        return;
      }
      const md = markdownit('commonmark');
      const result = md.render(data.result);
      this._explanation.push({text: result, info: data.params, timestamp: moment().format("HH:mm:ss")});
      _.delay(() => {
        this.zone.run(() => {
          const div = document.getElementById("explanation") as HTMLDivElement;
          if (div) {
            this.scrollToBottom(div);
          }
        });
      }, 300);
    });
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


  public get stat_lines(): any[] {
    return this._stat_lines;
  }


  public get aspects(): any[] {
    return this._aspects;
  }

  public get selectedHouseSystemName(): string {
    return this.settings.house_system_selected.name;
  }

  public get age(): number {
    if (this.data && this.selectedPerson) {
      const bd = moment.utc(this.selectedPerson.date);
      return moment.utc().diff(bd, 'years');
    }
    return NaN;
  }

  public get sign(): string {
    if (this.data && this.data.SkyObjects) {
      return zodiac_sign(this.data.SkyObjects.find((x: any) => x.name === SYMBOL_PLANET.Sun).position);
    }
    return '';
  }

  public get latin_phrase(): any {
    if (this.sign) {
      return latinAboutSign.find((x: any) => x.sign === this.sign);
    }
    return null;
  }

  public get sky_objects(): any[] {
    if (_.isEmpty(this.data)) {
      return [];
    }
    return this._planets.map(p => {
      return this.data.SkyObjects.find((x: any) => x.name === p.name);
    }) || [];
  }

  public get explanation(): any[] {
    return this._explanation;
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
    return {stroke_color: color};
  }

  public get calculatedTransitDateStr(): string {
    if (this.transit) {
      return moment(this.transit.date).utc().add(this.transit.offset, 'days').toISOString().replace('Z', '')
    }
    return '';
  }

  public draw() {
    if (this.selectedPerson) {
      const load: any = {
        natal: _.assign({}, this.selectedPerson, {hsys: this.settings.house_system_selected.id})
      };
      if (this.transit) {
        load.transit = {
          name: 'TRANSIT',
          date: this.calculatedTransitDateStr,
          location: {
            latitude: this.transit.latitude,
            longitude: this.transit.longitude,
            elevation: this.transit.elevation
          },
          hsys: this.settings.house_system_selected.id
        };
      }
      this.rest.chart_data(load).subscribe(this.handleChartData.bind(this));
    }
  }

  public onPersonSelected(person?: IPersonInfo): void {
    if (person) {
      //console.log(`Selected ${person}`);
      this.selectedPerson = person;
      this.entry = {
        name: person.name,
        locationName: person.location.name,
        longitude: person.location.longitude,
        latitude: person.location.latitude,
        elevation: person.location.elevation,
        timezone: person.timezone,
        dob: moment.utc(person.date).toISOString().replace('Z', ''),
        gender: person.gender ?? Gender.Male,
        scope: person.scope ?? PersonScope.Private,
      };
      this.draw();
    } else {
      this.selectedPerson = undefined;
      this.init();
    }
  }

  public get_point_on_circle(cx: number, cy: number, radius: number, angle: number): { x: number, y: number } {
    const a = (180 - angle) * Math.PI / 180;
    return {x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a)};
  }

  private get natal_description_for_ai(): string {
    const planets: string[] = _.reduce(this.stat_lines, (acc: string[], line: any) => {
      if (_.startsWith(line.stats.name, 'Cusp')) {
        return acc;
      }
      const stats = line.stats;
      acc.push(`${stats.label} in ${stats.position.sign}/${stats.house}`);
      return acc;
    }, []);
    _.reduce(this.aspects, (acc: string[], asp: any) => {
      acc.push(`${asp.parties[0].name} in ${asp.aspect.name} with ${asp.parties[1].name}`);
      return acc;
    }, planets);
    return planets.join(", ");
  }

  public perspective(kind: string): void {
    this.show_explanation = true;
    const prompt = `Given the following information as an outline natal data for a ${this.selectedPerson!.gender ? 'male' : 'female'}: ${this.natal_description_for_ai}. Write a summary about live perspectives, opportunities, and also difficulties and set backs ${kind}`;
    this.rest.do_explain({prompt});
  }

  public resetEntry(): void {
    this.entry = {
      name: '',
      locationName: '',
      latitude: 0,
      longitude: 0,
      dob: '',
      timezone: 0,
      elevation: 0,
      gender: Gender.Male,
      scope: PersonScope.Private
    };
  }

  public onPersonClear(): void {
    this.resetEntry();
    this.onPersonSelected();
  }

  public onPersonSaved(person: IPersonInfo): void {
    this.onPersonSelected(person);
  }

  public onPersonRemoved(): void {
    this.show_entry_form = false;
    this.resetEntry();
    this.onPersonSelected();
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

    this._explanation = [];

    this.cx = Math.trunc(this.width / 2);
    this.cy = Math.trunc(this.width / 2) - this.margin / 2;
    this.outer_radius = Math.min(this.width / 2, this.width / 2) - this.margin;
    this.inner_radius = this.outer_radius - this.outer_radius / 6;
    this.house_radius = this.inner_radius * 5 / 7;

    //  assemble ruler lines
    for (let i = 0; i < 360; i++) {
      const n = i % 30 === 0 ? this.outer_radius - this.inner_radius : i % 10 === 0 ? 10 : 5;
      const p1 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius + n, i);
      const p2 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius, i);
      this.lines.push({
        p1,
        p2,
        options: {stroke_color: i % 30 === 0 ? "#000" : "#0007"}
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
    //debug
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
          ? house.index == 0 || house.index == 6
            ? {stroke_color: "#090", stroke_width: 4}
            : {stroke_color: "#900", stroke_width: 4}
          : {stroke_color: "#000", stroke_width: 1}
      });

      if (_.includes([0, 3, 6, 9], i)) {
        const p1 = this.get_point_on_circle(this.cx, this.cy, this.outer_radius, a);
        const p2 = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 25, a);
        const options = _.includes([0, 3, 6, 9], house.index)
          ? house.index == 0 || house.index == 6
            ? {stroke_color: "#090", stroke_width: 2}
            : {stroke_color: "#900", stroke_width: 2}
          : {stroke_color: "#000", stroke_width: 1};
        this._lines.push({
          p1,
          p2,
          options
        });
        if (i == 0 || i == 9) {
          this._lines.push(
            ...calculate_arrow(9, 4, p1, p2, options)
          );
        }
      }

      const b = i == 11
        ? _.find(data.Houses, (x: any) => x.index == 0)
        : _.find(data.Houses, (x: any) => x.index == i + 1);

      const c = nl360(a + nl180(b.position - a) / 2) - this.offset_angle;
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
      const p2 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius - 5, x.position);
      const p_label = this.get_point_on_circle(this.cx, this.cy, this.inner_radius - 32.5, so.angle - this.offset_angle);
      this._lines.push({
        p1,
        p2
      })
      this._planets.push({
        name: x.name,
        ...p,
        text: (x.speed < 0 ? 'r' : ''),
        label: {
          angle: convert_DD_to_D(pos_in_zodiac_sign(x.position)),
          pos: {
            ...p_label
          }
        }
      });
    });

    if (data.Transit) {
      const enabled_transit_names = Array
        .from(this.settings.transit_settings_iter)
        .filter(x => x.enabled)
        .map(x => x.name);
      const skyObjectsTransitAdjusted = this.adjust(data.Transit.SkyObjects.filter((x: any) => {
        return _.includes(enabled_transit_names, x.name)
      }));
      skyObjectsTransitAdjusted.forEach((so: any) => {
        // assemble sky objects
        const x = _.find(data.Transit.SkyObjects, x => x.name === so.name);
        const p = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 15, so.angle - this.offset_angle);
        const p1 = this.get_point_on_circle(this.cx, this.cy, this.outer_radius, x.position);
        const p2 = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 5, x.position);
        const p_label = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 36, so.angle - this.offset_angle);
        this._lines.push({
          p1,
          p2
        })
        this._planets.push({
          name: x.name,
          ...p,
          text: (x.speed < 0 ? 'r' : ''),
          label: {
            angle: convert_DD_to_D(pos_in_zodiac_sign(x.position)),
            pos: {
              ...p_label
            }
          }
        });
      });
    }

    const aspect_names_enabled: string[] = Array
      .from(this.settings.aspect_settings_iter)
      .filter(x => x.enabled)
      .map(x => x.name);

    const aspects = this.data.Aspects.filter((x: any) =>
      _.includes(aspect_names_enabled, x.aspect.name) &&
      !_.some(x.parties, p => _.includes(['2 house', '3 house', '5 house', '6 house', '8 house', '9 house', '11 house', '12 house'], p.name))
    );
    _.uniqBy(aspects.flatMap((x: any) => x.parties), 'name')
      .forEach((x: any) => {
        const p1 = this.get_point_on_circle(this.cx, this.cy, this.house_radius + 2, x.position);
        const p2 = this.get_point_on_circle(this.cx, this.cy, this.house_radius - 2, x.position);
        this.lines.push({
          p1,
          p2,
          options: {stroke_color: "#000000"}
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
        const rnd_p = one_third_point_on_the_line(p1, p2); //random_point_on_the_line(p1, p2);
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
    const sun_house = this.data.SkyObjects.find((so: any) => so.name === SYMBOL_PLANET.Sun).house.index + 1;
    this.data.dayChart = _.includes([7, 8, 9, 10, 11, 12], sun_house);
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

  public avg_score: number = -1;

  private format_dignities(so: any): string {

    if (_.includes([SYMBOL_PLANET.ParsFortuna], so.name)) {
      return '';
    }

    const sign: string = zodiac_sign(so.position);
    let result: string[] = [];
    let score: number = 6;
    if (_.some(_.get(so, "dignities.domicile", []), x => x === sign)) {
      result.push("Domicile");
      score += 3;
    } else if (_.some(_.get(so, "dignities.exaltation", []), x => x === sign)) {
      result.push("Exaltation");
      score += 2;
    } else if (_.some(_.get(so, "dignities.detriment", []), x => x === sign)) {
      result.push("Detriment");
      score -= 3;
    } else if (_.some(_.get(so, "dignities.fall", []), x => x === sign)) {
      result.push("Fall");
      score -= 2;
    } else if (_.some(_.get(so, "dignities.friend", []), x => x === sign)) {
      result.push("Friend");
      score += 1;
    } else if (_.some(_.get(so, "dignities.enemy", []), x => x === sign)) {
      result.push("Enemy");
      score -= 1;
    }
    if (so.oriental) {
      result.push("Oriental");
      score += 1;
    } else {
      result.push("Occidental");
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

    // house sign
    const house_sign = pos_in_zodiac(so.house.position).sign;
    // check if so also a ruler or detriment
    const dom = _.some(this.sky_objects.filter(x => x.dignities && _.includes(x.dignities.domicile, house_sign)), z => z.name === so.name);
    if (dom) {
      score += 2;
      result.push("HDom");
      //console.log(`${so.name} ${house_sign} ${so.dignities.domicile.join('|')}`);
    }
    const det = _.some(this.sky_objects.filter(x => x.dignities && _.includes(x.dignities.detriment, house_sign)), z => z.name === so.name);
    if (det) {
      score -= 2;
      result.push("HDet");
      //console.log(`${so.name} ${house_sign} ${so.dignities.detriment.join('|')} ${found.name}`);
    }

    let aspect_score = 0;
    this.data.Aspects.forEach((a: any) => {
      if (so.name === a.parties[0].name || so.name === a.parties[1].name) {
        switch (a.aspect.angle) {
          case 180:
            aspect_score -= 3;
            break;
          case 0:
            aspect_score += 3;
            break;
          case 90:
            aspect_score -= 2;
            break;
          case 45:
            aspect_score -= 1;
            break;
          case 120:
            aspect_score += 2;
            break;
          case 60:
            aspect_score += 1;
            break;
        }
        //console.log(a);
      }
    });

    result.push(` (${score})`);

    this.avg_score = (this.avg_score > -1 ? (this.avg_score + score) / 2 : score) + aspect_score;


    return result.join(', ');
  }

  private adjust(sos: any[], transit: boolean = false): any[] {
    const so_radius = transit ? this.outer_radius + 15 : this.inner_radius - 15;
    let points: any[] = [];
    sos.forEach(so => {
      const position = this.get_point_on_circle(this.cx, this.cy, so_radius, so.position);
      const point = {
        name: so.name, ...position,
        r: COLLISION_RADIUS * SYMBOL_SCALE,
        angle: so.position,
        pointer: so.position
      };
      points = this.locate(points, point, so_radius);
    });
    return points;
  }

  private in_collision(a: any, b: any): boolean {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy) <= a.r + b.r;
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
    if ((2 * Math.PI * radius) - (2 * COLLISION_RADIUS * SYMBOL_SCALE * (points.length + 1)) <= 0) {
      throw new Error("Cannot resolve collision");
    }
    let is_collision = false;
    points = _.sortBy(points, 'angle');
    let cp: any;
    for (let i = 0, len = points.length; i < len; i++) {
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

  private scrollToBottom(element: HTMLDivElement) {
    element.scroll({top: element.scrollHeight, behavior: 'smooth'});
  }

  public logout(): void {
    const user: any = this.session.restoreUser();
    this.auth.logout(user.username).subscribe({
      next: () => {
        //console.log(res);
        this.session.clean();
        window.location.reload();
      },
      error: (err: any) => {
        console.log(err);
      }
    });
  }

  public get username(): string {
    const user = this.session.restoreUser();
    return user ? user.username : '';
  }

  protected readonly Gender = Gender;
  protected readonly convert_lat_to_DMS = convert_lat_to_DMS;
  protected readonly convert_long_to_DMS = convert_long_to_DMS;
  public _ = _;
  public config: any = config;
}


