import {
  AfterViewInit,
  ApplicationRef,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  createComponent,
  DestroyRef,
  inject,
  NgZone,
  OnInit,
  ViewChild
} from '@angular/core';
import {ChartSymbol} from '../../controls/graphics/chart-symbol';
import _ from "lodash";
import moment from "moment";
import {
  AppMode,
  aspect_color,
  calculate_arrow,
  COLLISION_RADIUS,
  convert_DD_to_D,
  convert_lat_to_DMS,
  convert_long_to_DMS,
  Dao,
  Gender,
  getContext,
  getSkyObjectRankWeight,
  IPersonEntry,
  IPersonInfo,
  IToolbarCmd,
  latinPhrases,
  nl180,
  nl360,
  one_third_point_on_the_line,
  PersonScope,
  perspectives,
  point_on_the_line,
  pos_in_zodiac,
  pos_in_zodiac_sign,
  PromptKind,
  rnd_suffix,
  rotate_point_around_center,
  SYMBOL_ASPECT,
  SYMBOL_HOUSE,
  SYMBOL_PLANET,
  SYMBOL_ZODIAC,
  ToolbarAlign,
  ToolbarCmdMask,
  ToolbarDisplay,
  ToolbarMenuSpan,
  UserRole,
  zodiac_sign
} from '../../common';
import {CommonModule} from '@angular/common';
import {ChartCircle} from '../../controls/graphics/chart-circle';
import {ChartLine} from '../../controls/graphics/chart-line';
import {FormsModule} from '@angular/forms';
import {BreakpointObserver, LayoutModule} from '@angular/cdk/layout';
import {ChartText} from '../../controls/graphics/chart-text';
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
import {
  faBaby,
  faBars,
  faDatabase,
  faDice, faElevator,
  faEye,
  faHatWizard,
  faLocationPin,
  faMarsAndVenus,
  faMeteor,
  faPlus,
  faSignOut,
  faTools,
  faUserAstronaut,
  faWandMagicSparkles
} from "@fortawesome/free-solid-svg-icons";
// @ts-ignore
import * as config from "assets/config.json";
import {AstralkaRotateImageComponent} from "../../controls/rotate.image/rotate.image";
import {LocalStorageService} from "../../services/local.storage.service";
import {AstralkaQuickPickComponent} from "../quick.pick.component/quick.pick.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {AstralkaTransitMatrixComponent} from "../../controls/matrix/transit.matrix";
import {AngularSplitModule, SplitComponent} from "angular-split";
import {AstroPipe} from "../../controls/astro.pipe";

/**
 * AstralkaChartComponent is an Angular standalone component responsible for displaying astrological charts,
 * including natal and transit/progression data, using a variety of subcomponents and visual elements.
 *
*/
@Component({
  selector: 'astralka-chart',
  standalone: true,
  imports: [
    ChartSymbol,
    ChartCircle,
    ChartLine,
    ChartText,
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
    AstralkaRotateImageComponent,
    AstralkaQuickPickComponent,
    FaIconComponent,
    AstralkaTransitMatrixComponent,
    AngularSplitModule,
    AstroPipe
  ],
  template: `
    <div class="astralka-container">
      <div style="height: 100vh; display: flex; flex-direction: column; width: 800px;" [style.width.px]="width">
        <astralka-toolbar [commands]="commands">
          <lookup
            [query]="selectedPerson? selectedPerson.name : ''"
            (selected)="onPersonSelected($event)">
          </lookup>
        </astralka-toolbar>
        @if (show_quick_pick) {
          <astralka-quick-pick
            [picks]="picks"
            (select)="onPersonSelected($event)"
            (remove)="removePersonFromQuickPick($event)"
            (swapped)="reSaveQuickPick($event)"
          ></astralka-quick-pick>
        }
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

        <div style="flex: 1; display: flex; justify-content: center; align-content: center;">

          <as-split direction="vertical" (dragEnd)="onSplitterDragEnd()" unit="pixel" #split>

            <as-split-area [size]="splitter_height" [minSize]="height/5" [maxSize]="height" style="display: flex;">

              <div id="container">

                @if (data && selectedPerson) {
                  <article id="person-info">
                    <section><b>Natal Data</b></section>
                    <section>{{ selectedPerson.name }}
                      <button (click)="savePersonToQuickPick()" class="xs">
                        <fa-icon [icon]="faPlus"></fa-icon>
                      </button>
                    </section>
                    <section *ngIf="entry.description">{{ selectedPerson.description }}</section>
                    <section>{{ moment(selectedPerson.date).format('DD MMM YYYY, hh:mm a') }}</section>
                    <section>Loc: {{ selectedPerson.location.name }}</section>
                    <section>Lat: {{ convert_lat_to_DMS(selectedPerson.location.latitude) }}
                      , {{ selectedPerson.location.latitude.toFixed(4) }}
                      °{{ selectedPerson.location.latitude >= 0 ? 'N' : 'S' }}
                    </section>
                    <section>Long: {{ convert_long_to_DMS(selectedPerson.location.longitude) }}
                      , {{ selectedPerson.location.longitude.toFixed(4) }}
                      °{{ selectedPerson.location.longitude >= 0 ? 'E' : 'W' }}
                    </section>
                    <section>Offset UTC: {{ selectedPerson.timezone }} hours</section>
                    <section>Elevation: {{ selectedPerson.location.elevation }}m</section>
                    <section>Age: {{ age }} yo</section>
                    <section>Gender: {{ selectedPerson.gender === Gender.Male ? 'Male' : 'Female' }}</section>
                    <section>{{ data.dayChart ? "Day Chart" : "Night Chart" }}</section>
                    <section><span
                      [class.goldenrod]="!show_natal_aspects">{{ show_natal_aspects ? "Natal" : "Transit" }}
                      Aspects</span></section>
                    <section>Pos Score: {{ natal_position_score.toFixed(2) }}</section>
                    <section [innerHTML]="formatted_energy_score | safeHtml"></section>
                    <section style="margin-top: 1em">
                      <astralka-position-data [kind]="'planets'" [positions]="stat_lines"
                                              [title]="'Natal Planets Position'">
                        <fa-icon [icon]="faBaby"/>
                        Planets
                      </astralka-position-data>
                    </section>
                    <section>
                      <astralka-position-data [kind]="'houses'" [positions]="stat_lines"
                                              [title]="'Natal Houses Position'">
                        <fa-icon [icon]="faBaby"/>
                        Houses
                      </astralka-position-data>
                    </section>
                    <section>
                      <astralka-matrix [data]="data" [title]="'Natal Aspects Matrix'">
                        <fa-icon [icon]="faBaby"/>
                        Matrix
                      </astralka-matrix>
                    </section>
                  </article>
                }
                @if (data && data.Transit) {
                  <article id="transit-info" [style.left.px]="width - 220">
                    <section><b>Transit/Progression Data</b></section>
                    <!-- <section>Lat/Long: {{transit.latitude}} : {{transit.longitude}}</section> -->
                    <section>Date Time: {{ moment($any(calculatedTransitDateStr)).format('MMMM Do YYYY, h:mm:ss a') }}
                    </section>
                    <section>House System: {{ selectedHouseSystemName }}</section>
                    <section style="margin-top: 1em; text-align: right">
                      <astralka-house-system>
                        <fa-icon [icon]="faTools"/>
                        House System
                      </astralka-house-system>
                    </section>
                    <section>
                      <astralka-transit-settings>
                        <fa-icon [icon]="faEye"/>
                        Transits
                      </astralka-transit-settings>
                    </section>
                    <section>
                      <astralka-aspect-settings>
                        <fa-icon [icon]="faEye"/>
                        Aspects
                      </astralka-aspect-settings>
                    </section>
                    <section>
                      <astralka-position-data [kind]="'transits'" [positions]="stat_lines"
                                              [title]="'Transit Planets Position'">
                        <fa-icon [icon]="faMeteor"/>
                        Planets
                      </astralka-position-data>
                    </section>
                    <section>
                      <astralka-transit-matrix [data]="data" [title]="'Transit Aspects Matrix'">
                        <fa-icon [icon]="faMeteor"/>
                        Matrix
                      </astralka-transit-matrix>
                    </section>
                  </article>
                }

                <!-- <div style="position: absolute; display: block; top: 0px; left: 0; width: 50px; height: 50px;">
                  <img src="assets/astralka-logo.svg">
                </div> -->
                <svg
                  [style.flex]="'flex: 0 ' + width + 'px'" xmlns="http://www.w3.org/2000/svg"
                  [attr.width]="width"
                  [attr.height]="height"
                  [attr.viewBox]="'0 0 ' + width + ' ' + height"
                  #chart
                >
                  <defs>
                    <filter x="0" y="0" width="1" height="1" id="solid">
                      <feFlood flood-color="white" result="floodFill"/>
                      <feComposite in="SourceGraphic" in2="floodFill" operator="over"/>
                    </filter>
                    <radialGradient id="shadow">
                      <stop offset="99%" stop-color="#fff"/>
                      <stop offset="100%" stop-color="#999"/>
                    </radialGradient>
                  </defs>
                  <g>
                    <!-- outside rectangle -->
                    <rect x="0" y="0" [attr.width]="width" [attr.height]="height" fill="white" stroke="none"></rect>
                    <!-- outer circle -->
                    <g svgg-circle [cx]="cx" [cy]="cy" [radius]="outer_radius"
                       [options]="{stroke_width: 2, fill: 'white'}"></g>
                    <!-- colored segments for zodiacs -->
                    <g [attr.transform-origin]="cx + ' ' + cy" [attr.transform]="'rotate(' + offset_angle + ')'">
                      <svg:circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="outer_radius-3" stroke="#009900"
                                  stroke-width="5"
                                  pathLength="360" stroke-dasharray="30 90 30 90 30 90" fill="none"/>
                      <svg:circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="outer_radius-3" stroke="#cc0000"
                                  stroke-width="5"
                                  pathLength="360" stroke-dasharray="0 30 30 90 30 90 30 60" fill="none"/>
                      <svg:circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="outer_radius-3" stroke="#336699"
                                  stroke-width="5"
                                  pathLength="360" stroke-dasharray="0 60 30 90 30 90 30 30" fill="none"/>
                      <svg:circle [attr.cx]="cx" [attr.cy]="cy" [attr.r]="outer_radius-3" stroke="#ffd900"
                                  stroke-width="5"
                                  pathLength="360" stroke-dasharray="0 90 30 90 30 90 30" fill="none"/>
                    </g>
                    <!-- inner 2 circles and 1 and 10 deg scale ruler -->
                    <g svgg-circle [cx]="cx" [cy]="cy" [radius]="inner_radius"></g>
                    <g svgg-circle [cx]="cx" [cy]="cy" [radius]="inner_radius + 5"
                       [options]="{stroke_color: '#777'}"></g>

                    @if (this.data && this.selectedPerson) {
                      <!-- inner house circle -->
                      <g svgg-circle [cx]="cx" [cy]="cy" [radius]="house_radius"
                         [options]="{fill: data.dayChart ? '#420' : '#024'}"></g>
                    }

                    <g [attr.transform-origin]="cx + ' ' + cy" [attr.transform]="'rotate(' + offset_angle + ')'"
                       svgg-line
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
                          <textPath xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#sector_path_0"
                                    startOffset="50%"
                                    text-anchor="middle">
                            {{ phrase_selected?.latin }}
                          </textPath>
                        </text>
                      </g>
                      <!-- NATAL or TRANSIT words under the center of the chart -->
                      <g>
                        <text class="chart-label" [attr.x]="cx + 7 * this.responsive_breakpoint.scale"
                              [attr.y]="cy + inner_radius / 5">{{ show_natal_aspects ? "NATAL" : "TRANSIT" }}
                        </text>
                      </g>
                      <!-- natal planet symbols -->
                      <g svgg-symbol *ngFor="let p of planets" [x]="p.x" [y]="p.y" [name]="p.name"
                         [fillBackground]="true"
                         [fillBackgroundColor]="'white'"
                         [options]="{scale: this.responsive_breakpoint.scale}"
                      ></g>
                      <!-- natal r for retrograde planet text -->
                      <g svgg-text *ngFor="let p of planets"
                         [x]="p.x + 8* this.responsive_breakpoint.scale"
                         [y]="p.y + 5*this.responsive_breakpoint.scale"
                         [text]="p.text"
                         [options]="{font_size: 10 * this.responsive_breakpoint.scale}"
                      ></g>
                      <!-- natal planet angle in sign -->
                      <g svgg-text *ngFor="let p of planets" [x]="p.label.pos.x" [y]="p.label.pos.y"
                         [text]="p.label.angle"
                         class="planets-angle"></g>
                      <!-- house symbols -->
                      <g svgg-symbol *ngFor="let p of cusps"
                         [x]="p.x" [y]="p.y"
                         [name]="p.name"
                         [options]="{scale: this.responsive_breakpoint.scale}"
                      ></g>
                      <!-- house degrees -->
                      <g svgg-text *ngFor="let p of cusps" [x]="p.label.pos.x" [y]="p.label.pos.y"
                         [text]="p.label.angle"
                         class="planets-angle"></g>
                      <!-- As, Dc, Mc, Ic labels -->
                      <g svgg-symbol *ngFor="let p of houses" class="angle" [x]="p.x" [y]="p.y" [name]="p.name"
                         [options]="{scale: 0.8 * this.responsive_breakpoint.scale, stroke_color: '#333'}"></g>
                      <!-- aspect symbols on aspect lines -->
                      <g svgg-symbol *ngFor="let p of aspect_labels" [x]="p.x" [y]="p.y" [name]="p.name"
                         [options]="p.options"></g>
                      <!-- person's Zodiac sign symbol in the middle of the chart background circle -->
                      <g svgg-circle [cx]="cx" [cy]="cy" [radius]="20 * this.responsive_breakpoint.scale"
                         [options]="{stroke_width: 2, stroke_color: data.dayChart?'black':'goldenrod', fill: data.dayChart?'goldenrod':'black'}"></g>
                      <!-- person's Zodiac sign symbol in the middle of the chart -->
                      <g svgg-symbol [x]="cx" [y]="cy" [name]="sign"
                         [options]="{stroke_color: data.dayChart?'black':'goldenrod', scale: this.responsive_breakpoint.scale}"></g>

                    }
                    <!-- this is debug area will be removed -- for practicing drawing symbols -->
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
              </div>
            </as-split-area>
            <as-split-area [size]="'*'" style="display: flex;">

              <div class="explanation-container" id="explanation"
                   [style.height]="'calc(100vh - ' + split_height + 'px)'">
                <div
                  [overlayLoader]="sharedExplain$"
                  class="bot-panel"
                >
                  <div class="bot-panel-handler">
                    {{ phrase_selected?.english }}
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: row; overflow: hidden">
                    <div class="bot-panel-content" id="explanation">
                      @for (e of explanation; track e; let idx = $index) {
                        @if (idx !== 0) {
                          <hr class="una"/>
                        }
                        @if (config.rotate_images && e.rotator) {
                          <div [style.min-height.px]="220 * this.responsive_breakpoint.scale">
                            <div style="float: right; margin: 0.5em;"
                                 [style.width.px]="160 * this.responsive_breakpoint.scale">
                              <astralka-rotate-image [rotator]="e.rotator"
                                                     [width]="160 * this.responsive_breakpoint.scale"
                                                     [height]="200 * this.responsive_breakpoint.scale"></astralka-rotate-image>
                            </div>
                            <p class="explanation-wrap" [innerHTML]="e.text | astro | safeHtml"></p>
                          </div>
                        } @else {
                          <p class="explanation-wrap" [innerHTML]="e.text | astro | safeHtml"></p>
                        }
                        <div class="foot-print">
                          <div class="retry">
                                <span (click)="retryExplanation(e)">
                                  re-try for better answer <fa-icon [icon]="faDice"/>
                                </span>
                          </div>
                          <div class="timestamp">{{ e.timestamp }}</div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>

            </as-split-area>

          </as-split>


        </div>

      </div>
    </div>

  `,
  styleUrls: ['./chart.component.scss']
})
export class AstralkaChartComponent implements OnInit, AfterViewInit {

  @ViewChild('split') split!: SplitComponent;
  public split_height!: number;
  public width: number = 800;
  public height: number = 800;
  public margin: number = 160;
  public show_entry_form: boolean = false;
  public show_transit_form: boolean = false;
  public show_quick_pick: boolean = false;
  public cx: number = 0;
  public cy: number = 0;
  public outer_radius: number = 0;
  public inner_radius: number = 0;
  public house_radius: number = 0;
  public offset_angle: number = 90;
  public entry: IPersonEntry = {
    name: '',
    description: '',
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
  public data: any = {};
  public selectedPerson: IPersonInfo | undefined;
  public moment = moment;
  public sharedExplain$!: Observable<any>;
  public commands: IToolbarCmd[] = [];
  public rotate_image!: any;
  public show_natal_aspects: boolean = true;
  public natal_position_score: number = 0;
  public natal_energy_score: number = 0;
  public _ = _;
  public config: any = config;
  public splitter_height: number = 0;
  protected readonly Gender = Gender;
  protected readonly convert_lat_to_DMS = convert_lat_to_DMS;
  protected readonly convert_long_to_DMS = convert_long_to_DMS;
  protected readonly faDice = faDice;
  protected readonly faBaby = faBaby;
  protected readonly faEye = faEye;
  protected readonly faTools = faTools;
  protected readonly faMeteor = faMeteor;
  protected readonly faPlus = faPlus;
  private responsive_matrix = [
    {
      breakpoint: '(min-width: 375px)',
      width: 430,
      height: 430,
      margin: 50,
      scale: 0.5,
      mode: AppMode.Compact
    },
    {
      breakpoint: '(min-width: 800px)',
      width: 800,
      height: 800,
      margin: 120,
      scale: 1.0,
      mode: AppMode.Full
    }
  ];
  private _destroyRef = inject(DestroyRef);
  private _phrase!: any;

  constructor(
    private applicationRef: ApplicationRef,
    private responsive: BreakpointObserver,
    private rest: RestService,
    private settings: SettingsService,
    private auth: AstralkaAuthService,
    private session: SessionStorageService,
    private storage: LocalStorageService,
    private router: Router,
    private zone: NgZone,
    private cdr: ChangeDetectorRef
  ) {
  }

  public _responsive_breakpoint!: any;

  /**
   * Retrieves the responsive breakpoint from the instance. If the
   * breakpoint is not explicitly set, it returns the first element
   * of the `responsive_matrix`.
   *
   * @return {any} The responsive breakpoint.
   */
  public get responsive_breakpoint(): any {
    return _.get(this, "_responsive_breakpoint", this.responsive_matrix[0]);
  }

  /**
   * Sets the responsive breakpoint value.
   *
   * @param {any} value - The value to set as the responsive breakpoint.
   */
  public set responsive_breakpoint(value: any) {
    this._responsive_breakpoint = value;
  }

  private _planets: any[] = [];

  public get planets() {
    return this._planets;
  }

  private _zodiac: any[] = [];

  public get zodiac() {
    return this._zodiac;
  }

  private _houses: any[] = [];

  public get houses() {
    return this._houses;
  }

  private _cusps: any[] = [];

  public get cusps() {
    return this._cusps;
  }

  private _lines: any[] = [];

  public get lines(): any[] {
    return this._lines;
  }

  private _aspect_labels: any[] = [];

  public get aspect_labels(): any[] {
    return this._aspect_labels;
  }

  private _stat_lines: any[] = [];

  public get stat_lines(): any[] {
    return this._stat_lines;
  }

  private _explanation: any[] = [];

  /**
   * Retrieves the explanation data.
   *
   * @return {any[]} An array containing the explanation data.
   */
  public get explanation(): any[] {
    return this._explanation;
  }

  /**
   * Retrieves the name of the currently selected house system.
   *
   * @return {string} The name of the selected house system.
   */
  public get selectedHouseSystemName(): string {
    return this.settings.house_system_selected.name;
  }

  /**
   * Calculates the age of the selected person based on their birthdate.
   *
   * @return {number} The age in years if the selected person's data is available; otherwise, NaN.
   */
  public get age(): number {
    if (this.data && this.selectedPerson) {
      const bd = moment.utc(this.selectedPerson.date);
      return moment.utc().diff(bd, 'years');
    }
    return NaN;
  }

  /**
   * Retrieves the zodiac sign based on the position of the Sun within the SkyObjects data.
   * @return {string} The zodiac sign corresponding to the Sun's position, or an empty string if the data is not available.
   */
  public get sign(): string {
    if (this.data && this.data.SkyObjects) {
      return zodiac_sign(this.data.SkyObjects.find((x: any) => x.name === SYMBOL_PLANET.Sun).position);
    }
    return '';
  }

  /**
   * Retrieves the selected phrase if the sign condition is met.
   *
   * @return {any} The selected phrase if this.sign is true; otherwise, returns null.
   */
  public get phrase_selected(): any {
    if (this.sign) {
      return this._phrase;
    }
    return null;
  }

  /**
   * Retrieves an array of sky objects associated with the planets in the dataset.
   *
   * The method checks if the data is empty and returns an empty array if so. Otherwise,
   * it maps through the `_planets` property, finding corresponding sky objects in the
   * `data.SkyObjects` array by matching their names.
   *
   * @return {any[]} An array of sky objects related to the planets, or an empty array if no data is available.
   */
  public get sky_objects(): any[] {
    if (_.isEmpty(this.data)) {
      return [];
    }
    return this._planets.map(p => {
      return this.data.SkyObjects.find((x: any) => x.name === p.name);
    }) || [];
  }

  /**
   * Calculates the formatted energy score based on the natal energy score
   * and classifies it into categories such as Balanced, Violent, Tense,
   * Joyfull, and Peaceful.
   *
   * @return {string} A string representing the formatted energy score
   *                  and its classification.
   */
  public get formatted_energy_score(): string {
    const score = (this.natal_energy_score - 23.44) / 9.80665
    let score_name = 'Balanced';
    if (score <= -5) {
      score_name = 'Violent';
    } else if (score <= -3) {
      score_name = 'Tense';
    } else if (score >= 5) {
      score_name = 'Joyfull';
    } else if (score >= 3) {
      score_name = 'Peacefull';
    }
    return `Energy: ${score.toFixed(2)}<br/>${score_name}`;
  }

  /**
   * Calculates the transit date string based on the transit date and offset.
   * If the transit object exists, it computes the date by adding the offset in days
   * to the transit date. The resulting date is then converted to ISO string format
   * without the 'Z' character.
   *
   * @return the calculated transit date string in ISO format or an empty string if transit object does not exist.
   */
  public get calculatedTransitDateStr(): string {
    if (this.transit) {
      return moment(this.transit.date).utc().add(this.transit.offset, 'days').toISOString().replace('Z', '')
    }
    return '';
  }

  private _picks: any[] = [];

  /**
   * Retrieves the list of picks.
   *
   * @return {any[]} An array containing the picks
   */
  public get picks(): any[] {
    return this._picks;
  }

  /**
   * Retrieves the username of the currently restored user from the session.
   *
   * @return {string} The username of the restored user or an empty string if no user is restored.
   */
  public get username(): string {
    const user = this.session.restoreUser();
    return user ? user.username : '';
  }

  /**
   * Generates a natal description based on astrological data, excluding certain houses.
   * Filters aspects that do not involve specific house names and constructs a textual description
   * of planetary positions and their aspects.
   *
   * @return {string} A detailed description of the natal chart, highlighting planetary positions,
   *                  retrograde statuses, and key astrological aspects.
   */
  private get natal_description_for_ai(): string {

    const aspects = this.data.Aspects.filter((x: any) =>
      !_.some(x.parties, p => _.includes(['2 house', '3 house', '5 house', '6 house', '8 house', '9 house', '11 house', '12 house'], p.name))
    );

    const planets: string[] = _.reduce(this.stat_lines, (acc: string[], line: any) => {
      if (line.kind === 'houses' || line.kind === 'transits') {
        return acc;
      }
      const stats = line.stats;
      const temp: string[] = [];
      const retrograde = stats.speed < 0 ? 'Retrograde ' : '';
      temp.push(`\n- ${retrograde}${stats.label} in ${stats.position.sign}/${stats.house}`);

      const name = stats.name;
      aspects
        .filter((x: any) => x.parties[0].name === name)
        .reduce((acc: string[], asp: any) => {
          const retrograde = asp.parties[1].speed < 0 ? 'retrograde ' : '';
          const prompt = `and in ${asp.aspect.name} with ${retrograde}${asp.parties[1].name}`
            .replace(/Cusp10/g, 'Medium Coeli')
            .replace(/Cusp1/g, 'Ascendant');
          acc.push(prompt);
          return acc;
        }, temp);
      acc.push(temp.join(' '));
      return acc;
    }, []);

    return planets.join("; ");
  }

  /**
   * Generates a description of the transit for AI interpretation by filtering and
   * processing transit aspects and stat lines data.
   *
   * @return {string} A formatted string that summarizes the transit aspects and
   *                  positions with respect to natal positions.
   */
  private get transit_description_for_ai(): string {

    const aspects = this.data.Transit.Aspects.filter((x: any) =>
      !_.includes([SYMBOL_PLANET.Moon, SYMBOL_PLANET.Mercury, SYMBOL_PLANET.Venus, SYMBOL_PLANET.NorthNode, SYMBOL_PLANET.SouthNode], x.parties[0].name) &&
      !_.some(x.parties, p => {
        return _.includes(['2 house', '3 house', '5 house', '6 house', '8 house', '9 house', '11 house', '12 house'], p.name);
      })
    );

    const planets: string[] = _.reduce(this.stat_lines, (acc: string[], line: any) => {
      if (line.kind === 'houses' || line.kind === 'planets') {
        return acc;
      }
      const stats = line.stats;
      if (_.includes([SYMBOL_PLANET.Moon, SYMBOL_PLANET.Mercury, SYMBOL_PLANET.Venus, SYMBOL_PLANET.NorthNode, SYMBOL_PLANET.SouthNode], stats.name)) {
        return acc;
      }
      const temp: string[] = [];
      const retrograde = stats.speed < 0 ? 'Retrograde ' : '';
      temp.push(`\n- Transit ${retrograde}${stats.label} in ${stats.position.sign} transiting over natal ${stats.house}`);
      const name = stats.name;

      aspects
        .filter((x: any) => x.parties[0].name === name)
        .reduce((acc: string[], asp: any) => {
          const retrograde = asp.parties[1].speed < 0 ? 'retrograde ' : '';
          const prompt = `and in ${asp.aspect.name} with natal ${retrograde}${asp.parties[1].name}`
            .replace(/Cusp10/g, 'Medium Coeli')
            .replace(/Cusp1/g, 'Ascendant');
          acc.push(prompt);
          return acc;
        }, temp);
      acc.push(temp.join(' '));
      return acc;
    }, []);

    return planets.join("; ");
  }

  /**
   * Lifecycle hook that is called after Angular has fully initialized
   * a component's view. This method triggers the recalculation of the
   * explanation height and attempts to restore a splitter height value from
   * storage. If the value is found, it sets the splitter height and recalculates
   * the explanation height.
   *
   * @return {void} No return value.
   */
  ngAfterViewInit() {
    this.recalculate_explanation_height().then(() => {
      const vas = this.storage.restore("astralka-splitter");
      if (vas) {
        this.splitter_height = vas[0];
        this.recalculate_explanation_height().then();
      }
    });

  }

  /**
   * Handles the end of a drag event on the splitter component.
   * This method recalculates the explanation height and stores the current sizes
   * of the visible areas in persistent storage.
   *
   * @return {Promise<void>} A promise that resolves when the recalculation and storage operations are complete.
   */
  public async onSplitterDragEnd() {
    await this.recalculate_explanation_height();
    const vas = this.split.getVisibleAreaSizes();
    this.storage.store("astralka-splitter", vas);
  }

  /**
   * Updates the toolbar commands based on the current application state.
   * This method configures the toolbar with various commands such as form toggles,
   * aspect toggles, quick pick toggles, perspectives, and forecasts.
   * Each command is dynamically generated with properties like id, mask, type,
   * display mode, icon, tooltip, action, and so on, depending on the
   * current responsive breakpoint and other state variables.
   *
   * @return {void} No return value. Side effects include updating this.commands with
   * new toolbar commands.
   */
  public update_commpands(): void {

    const cmds: IToolbarCmd[] = [
      {
        id: rnd_suffix(),
        mask: ToolbarCmdMask.All,
        type: 'item',
        hidden: false,
        align: ToolbarAlign.Left,
        display: this.responsive_breakpoint.mode === AppMode.Full ? ToolbarDisplay.Icon : ToolbarDisplay.IconAndText,
        iconResolver: () => {
          return this.show_entry_form
            ? {icon: faUserAstronaut, cssClass: 'icon-on'}
            : {icon: faUserAstronaut, cssClass: ''}
        },
        disabled: () => false,
        label: 'Natal Form',
        tooltip: 'Person Natal Data Entry',
        action: () => {
          this.show_entry_form = !this.show_entry_form;
          this.recalculate_explanation_height().then();
        }
      },
      {
        id: rnd_suffix(),
        mask: ToolbarCmdMask.All,
        type: 'item',
        hidden: false,
        align: ToolbarAlign.Left,
        display: this.responsive_breakpoint.mode === AppMode.Full ? ToolbarDisplay.Icon : ToolbarDisplay.IconAndText,
        iconResolver: () => {
          return this.show_transit_form
            ? {icon: faMeteor, cssClass: 'icon-on'}
            : {icon: faMeteor, cssClass: ''}
        },
        disabled: () => false,
        tooltip: 'Transits or Progression Date',
        label: 'Transit Form',
        action: () => {
          this.show_transit_form = !this.show_transit_form;
          this.recalculate_explanation_height().then();
        }
      },
      {
        id: rnd_suffix(),
        mask: ToolbarCmdMask.All,
        type: 'item',
        hidden: false,
        align: ToolbarAlign.Left,
        display: this.responsive_breakpoint.mode === AppMode.Full ? ToolbarDisplay.Icon : ToolbarDisplay.IconAndText,
        iconResolver: () => {
          return this.show_natal_aspects
            ? {icon: faMarsAndVenus, cssClass: ''}
            : {icon: faMarsAndVenus, cssClass: 'icon-on'}
        },
        disabled: () => !this.data || !this.selectedPerson,
        tooltip: 'Toggle between Natal and Transit Aspects',
        label: 'Nata/Transit Apects',
        action: () => {
          this.show_natal_aspects = !this.show_natal_aspects;
          this.draw();
        }
      },
      {
        id: rnd_suffix(),
        mask: ToolbarCmdMask.All,
        type: 'item',
        hidden: false,
        align: ToolbarAlign.Left,
        display: this.responsive_breakpoint.mode === AppMode.Full ? ToolbarDisplay.Icon : ToolbarDisplay.IconAndText,
        iconResolver: () => {
          return this.show_quick_pick
            ? {icon: faLocationPin, cssClass: 'icon-on'}
            : {icon: faLocationPin, cssClass: ''}
        },
        disabled: () => !this.picks.length,
        tooltip: 'Toggle Quick Picks',
        label: 'Show/Hide Quick Picks',
        action: () => {
          this.show_quick_pick = !this.show_quick_pick;
          this.recalculate_explanation_height().then();
        }
      }
    ];
    const responsive_commands: IToolbarCmd[] = this.responsive_breakpoint.mode === AppMode.Full
      ? cmds
      : [
        {
          id: rnd_suffix(),
          mask: ToolbarCmdMask.NavBar,
          type: 'menu',
          hidden: false,
          display: ToolbarDisplay.Icon,
          menuSpan: ToolbarMenuSpan.Single,
          icon: faBars,
          disabled: () => false,
          tooltip: 'Actions',
          commands: cmds
        }
      ];

    this.commands = [
      {
        id: rnd_suffix(),
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
          .sort((a: any, b: any) => a.label.localeCompare(b.label, 'standard', {sensitivity: 'case'}))
          .map((perspective: any) => {
            return {
              id: rnd_suffix(),
              mask: ToolbarCmdMask.NavBar,
              type: 'item',
              hidden: false,
              display: ToolbarDisplay.IconAndText,
              icon: perspective.icon,
              label: perspective.label,
              disabled: () => false,
              tooltip: perspective.tooltip ?? perspective.label,
              action: () => {
                this.natal_category(perspective.prompt, 'Natal category: ' + perspective.label);
              }
            };
          })
      },
      {
        id: rnd_suffix(),
        mask: ToolbarCmdMask.NavBar,
        type: 'menu',
        hidden: false,
        display: ToolbarDisplay.Icon,
        menuSpan: ToolbarMenuSpan.Single,
        icon: faWandMagicSparkles,
        disabled: () => !(this.data && this.selectedPerson),
        tooltip: 'Forecast',
        commands: [
          {
            id: rnd_suffix(),
            mask: ToolbarCmdMask.NavBar,
            type: 'item',
            hidden: false,
            display: ToolbarDisplay.IconAndText,
            icon: faBaby,
            label: "Natal Summary",
            disabled: () => false,
            tooltip: "Natal Summary",
            action: () => {
              this.natal_category(`overall potential. Make 5 guess on who he/she might be and present the list in markdown format, with example
                  1. **Pharmasist** - Highest potential to be great at sorting medicine. Moon in Aquarius makes it so;`, 'Natal Summary');
            }
          },
          // {
          //   mask: ToolbarCmdMask.NavBar,
          //   type: 'item',
          //   hidden: false,
          //   display: ToolbarDisplay.IconAndText,
          //   icon: faCalendarDay,
          //   label: "Natal Day in History",
          //   disabled: () => false,
          //   tooltip: "Natal Day in History",
          //   action: () => {
          //     const day = moment(this.selectedPerson?.date).format("MMMM Do");
          //     const prompt = `Write what is internationally celebrated on ${day}. Indicate if it's a relegeous holy day, then list 15 the most significant historical events that happened on ${day} throughout history as a bullet list, in the format:
          //       - <strong>Year</strong> Description;`;
          //     this.rest.do_explain({prompt, title: `${day} throughout History`});
          //   }
          // },
          {
            id: rnd_suffix(),
            mask: ToolbarCmdMask.NavBar,
            type: 'item',
            hidden: false,
            display: ToolbarDisplay.IconAndText,
            icon: faHatWizard,
            label: "Trends",
            disabled: () => !this.selectedPerson || this.selectedPerson.scope === PersonScope.Public,
            tooltip: "Trends",
            action: () => {
              this.transit_category("the focus areas suggesting concrete activities, then list for today, week, month the important health points and conclude with short overall summary.", "Day / Week / Month trends");
            }
          },
          {
            id: rnd_suffix(),
            mask: ToolbarCmdMask.NavBar,
            type: 'item',
            hidden: false,
            display: ToolbarDisplay.IconAndText,
            icon: faElevator,
            label: "Be President",
            disabled: () => false,
            tooltip: "Election",
            action: () => {
              this.transit_category(`overall chances to be elected as a President of the country. Rate the chances from 0 to 100.`, 'Presidential Electrions');
            }
          },
          // {
          //   mask: ToolbarCmdMask.NavBar,
          //   type: 'item',
          //   hidden: false,
          //   display: ToolbarDisplay.IconAndText,
          //   icon: faCalendarDay,
          //   label: "Today in History",
          //   disabled: () => !this.selectedPerson,
          //   tooltip: "Today in History",
          //   action: () => {
          //     const day = moment().format("MMMM Do");
          //     const prompt = `Write what is internationally celebrated exactly "${day}". Indicate if it's a religeous holy day, then list 15 the most significant historical events that happened exactly on (${day}) throughout history as a bullet list, in the format:
          //       - <strong>Year</strong> Description;`;
          //     this.rest.do_explain({prompt, title: `${day} throughout History`});
          //   }
          // },
          // {
          //   mask: ToolbarCmdMask.NavBar,
          //   type: 'item',
          //   hidden: false,
          //   display: ToolbarDisplay.IconAndText,
          //   icon: faCalendarDay,
          //   label: "Transit Day in History",
          //   disabled: () => !this.selectedPerson,
          //   tooltip: "Transit Day in History",
          //   action: () => {
          //     const day = moment(this.transit.date).utc().add(this.transit.offset, 'days').format("MMMM Do");
          //     const prompt = `Write what is internationally celebrated exactly "${day}". Indicate if it's a religeous holy day, then list 15 the most significant historical events that happened exactly on (${day}) throughout history as a bullet list, in the format:
          //       - <strong>Year</strong> Description;`;
          //     this.rest.do_explain({prompt, title: `${day} throughout History`});
          //   }
          // }
        ]
      },
      ...responsive_commands,
      {
        id: rnd_suffix(),
        mask: ToolbarCmdMask.All,
        type: 'item',
        hidden: !this.hasUserRole(UserRole.Admin),
        align: ToolbarAlign.Right,
        display: ToolbarDisplay.Icon,
        icon: faDatabase,
        disabled: () => false,
        tooltip: 'Populate DB',
        action: () => {
          this.rest.populate_db(this.username).subscribe(console.log);
        }
      },
      {
        id: rnd_suffix(),
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
  }

  /**
   * Checks if the currently restored user has the specified role.
   *
   * @param {string} role - The role to check against the user's roles.
   * @return {boolean} True if the user has the specified role, otherwise false.
   */
  public hasUserRole(role: string): boolean {
    const user = this.session.restoreUser();
    return user && _.includes(user.roles, role);
  }

  /**
   * Initializes the component and sets up responsive behavior, session checks,
   * and subscription to various observables for handling state changes and data updates.
   *
   * @return {void}
   */
  ngOnInit(): void {

    this.update_commpands();

    this.responsive.observe(this.responsive_matrix.map(x => x.breakpoint)).subscribe(result => {
      if (result.matches) {
        this.responsive_matrix.forEach((r: any) => {
          if (result.breakpoints[r.breakpoint]) {
            this.responsive_breakpoint = r;
            this.width = r.width;
            this.height = this.splitter_height = r.height;
            this.margin = r.margin;
            this.recalculate_explanation_height().then();
          }
        });
      }
      this.init();
      this.update_commpands();
      if (this.selectedPerson) {
        this.draw();
      }
    });

    const loggedIn = this.session.isLoggedIn();
    if (!loggedIn) {
      this.router.navigate(['']).then();
      return;
    }

    this.rest.getQuickPickList(this.username).subscribe((data: any) => {
      this._picks = data ?? [];
      if (this._picks.length) {
        //this.show_quick_pick = true;
        this.cdr.detectChanges();
      }
    });

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
      if (data.result === 'LOADING!') {
        //console.log(`---- CONTEXT ------`);
        //console.log(data);
        const name: string = getContext(data);
        this.rotate_image = {
          name: name + '.' + rnd_suffix(),
          description: name,
          data
        };
        return;
      }
      const md = markdownit('commonmark');
      const result = (data.params.title ? `<h4>${data.params.title}</h4>` : '') + md.render(data.result);
      this._phrase = this.latin_phrase(this.sign);
      this.show_natal_aspects = _.get(data, "params.kind", PromptKind.Natal) === PromptKind.Natal;
      this._explanation.push({
        text: result,
        info: data.params,
        rotator: _.cloneDeep(this.rotate_image),
        timestamp: moment().format("MMMM Do YYYY, h:mm:ss a")
      });

      //console.log(`---- CONTEXT ------`);
      //console.log(data);

      _.delay(() => {
        this.zone.run(() => {
          const compRefs: ComponentRef<ChartSymbol>[] = [];
          document.querySelectorAll(".gen-planet").forEach(node => {
            const componentRef = createComponent(ChartSymbol, {
              environmentInjector: this.applicationRef.injector,
              hostElement: node
            });
            const instance = componentRef.instance;
            instance.x = 7;
            instance.y = 9;
            instance.name = node.id.replace('planet-', '');
            instance.options = {scale: 0.5, stroke_width: 1, stroke_color: '#295344'};
            compRefs.push(componentRef);
          });
          document.querySelectorAll(".gen-zodiac").forEach(node => {
            const componentRef = createComponent(ChartSymbol, {
              environmentInjector: this.applicationRef.injector,
              hostElement: node
            });
            const instance = componentRef.instance;
            instance.x = 7;
            instance.y = 9;
            instance.name = node.id.replace('zodiac-', '');
            instance.options = {scale: 0.45, stroke_width: 1, stroke_color: '#295344'};
            compRefs.push(componentRef);
          });
          document.querySelectorAll(".gen-aspect").forEach(node => {
            const componentRef = createComponent(ChartSymbol, {
              environmentInjector: this.applicationRef.injector,
              hostElement: node
            });
            const instance = componentRef.instance;
            instance.x = 7.5;
            instance.y = 9.5;
            instance.name = node.id.replace('aspect-', '');
            instance.options = {scale: 0.6, stroke_width: 1, stroke_color: '#295344'};
            compRefs.push(componentRef);
          });

          compRefs.forEach(cr => {
            this.applicationRef.attachView(cr.hostView);
            cr.changeDetectorRef.detectChanges();
          });

          const div = document.getElementById("explanation") as HTMLDivElement;
          if (div) {
            this.scrollToBottom(div);
          }
        });
      }, 300);
    });

    const person = this.storage.restore("astralka-person");
    if (person) {
      this.onPersonSelected(person);
    }
  }

  /**
   * Retries the explanation process for a given error.
   *
   * @param {any} e - The error object containing necessary information for explanation.
   * @return {void}
   */
  public retryExplanation(e: any): void {
    this.rest.do_explain(e.info);
  }

  /**
   * Generates a set of options for a given zodiac sign.
   *
   * @param {Object} p - The parameter object.
   * @param {string} p.name - The name of the zodiac sign.
   * @return {Object} An object containing the stroke color and scale corresponding to the given zodiac sign.
   */
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
    return {stroke_color: color, scale: this.responsive_breakpoint.scale};
  }

  /**
   * Initiates the process to draw a chart based on the selected person's natal chart and optionally transit information.
   * Generates necessary data and calls an API endpoint to retrieve chart data, then processes the received data.
   *
   * @return {void} Does not return a value.
   */
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

  /**
   * Handles the selection of a person, updating internal state and UI accordingly.
   *
   * @param {IPersonInfo} [person] - The information of the person being selected. If no person
   * is provided, the internal state is reset.
   * @return {void}
   */
  public onPersonSelected(person?: IPersonInfo): void {
    if (person) {
      //console.log(`Selected ${person}`);
      if (person.name !== _.get(this.selectedPerson, "name", '')) {
        this._explanation = [];
        this.natal_position_score = 0;
        this.natal_energy_score = 0;
      }
      this.selectedPerson = person;
      this.entry = {
        name: person.name,
        description: person.description,
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
      this.storage.store("astralka-person", this.selectedPerson);
    } else {
      this._phrase = undefined;
      this.selectedPerson = undefined;
      this.init();
    }
  }

  /**
   * Calculate the coordinates of a point on the circumference of a circle given the center, radius, and angle.
   *
   * @param {number} cx - The x-coordinate of the circle's center.
   * @param {number} cy - The y-coordinate of the circle's center.
   * @param {number} radius - The radius of the circle.
   * @param {number} angle - The angle in degrees from the positive x-axis to the point.
   * @return {Object} An object containing the x and y coordinates of the point.
   */
  public get_point_on_circle(cx: number, cy: number, radius: number, angle: number): { x: number, y: number } {
    const a = (180 - angle) * Math.PI / 180;
    return {x: cx + radius * Math.cos(a), y: cy + radius * Math.sin(a)};
  }

  /**
   * Generates and sends a prompt for natal chart insights based on the specified category.
   *
   * @param {string} kind - The category/type of insights to be generated (e.g., love, career, health).
   * @param {string} title - The title to be used in the prompt.
   * @return {void}
   */
  public natal_category(kind: string, title: string): void {
    this.show_natal_aspects = true;
    const prompt = `
      For a ${this.age} years old ${this.selectedPerson!.gender ? 'male' : 'female'} given the following information:
      ${this.natal_description_for_ai}.\n
      In a few paragraphs explore some general insights from the provided placements that might hint at ${kind}`;
    this.rest.do_explain({prompt, title, kind: PromptKind.Natal});
  }

  /**
   * Generates an astrological transit category based on the given parameters and triggers an explanation process.
   *
   * @param {string} kind - The type of transit category being explored.
   * @param {string} title - The title of the requested analysis.
   *
   * @return {void} This method does not return anything.
   */
  public transit_category(kind: string, title: string): void {
    this.show_natal_aspects = false;
    const prompt = `
      For a ${this.age} years old ${this.selectedPerson!.gender ? 'male' : 'female'} given the following today's information:
      ${this.transit_description_for_ai}.\n
      In a few paragraphs explore some general insights from the provided placements and planets transit periods that might hint at ${kind}`;
    this.rest.do_explain({prompt, title, kind: PromptKind.Transit});
  }

  /**
   * Resets the entry object to its initial default state.
   *
   * @return {void} This method does not return a value.
   */
  public resetEntry(): void {
    this.entry = {
      name: '',
      description: '',
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

  /**
   * Clears the current person selection by resetting the entry and invoking the person selected callback.
   * @return {void} This method does not return any value.
   */
  public onPersonClear(): void {
    this.resetEntry();
    this.onPersonSelected();
  }

  /**
   * Handles the event when a person is saved.
   *
   * @param person - The information of the saved person.
   * @return void
   */
  public onPersonSaved(person: IPersonInfo): void {
    this.onPersonSelected(person);
  }

  /**
   * Handles logic when a person is removed.
   * Sets the show_entry_form property to false, resets the entry form,
   * and calls the onPersonSelected method.
   *
   * @return {void} No return value.
   */
  public onPersonRemoved(): void {
    this.show_entry_form = false;
    this.resetEntry();
    this.onPersonSelected();
  }

  /**
   * Saves the selected person to the quick picks list if not already present.
   *
   * This method checks if the selected person is already in the quick picks list.
   * If not, it calls a RESTful service to save the selected person to the quick picks.
   * The quick picks list is then updated with the new data.
   *
   * @return {void}
   */
  public savePersonToQuickPick(): void {
    const found = this._picks.find(x => x.person._id === _.get(this.selectedPerson, '_id', ''));
    if (!found) {
      if (this.selectedPerson && this.selectedPerson._id) {
        this.rest.saveToQuickPick(this.selectedPerson._id, this.username).subscribe((data: any) => {
          this._picks = data;
        });
      }
    }
  }

  /**
   * Removes a person from the quick pick list based on the provided id.
   *
   * @param {string} id - The unique identifier of the person to be removed.
   * @return {void}
   */
  public removePersonFromQuickPick(id: string) {
    this.rest.removeFromQuickPick(id, this.username).subscribe((data: any) => {
      this._picks = data;
    });
  }

  /**
   * Re-saves quick pick data using the provided user data.
   *
   * @param {any} data - The data to be re-saved, containing an array of objects each having a 'person' object with an '_id' property.
   * @return {void} This method does not return a value.
   */
  public reSaveQuickPick(data: any) {
    const load = data.map((x: any) => x.person._id);
    this.rest.reSaveToQuickPick(load, this.username)
      .subscribe((data) => {
        this._picks = data;
      });
  }

  /**
   * Logs out the current user by performing the following steps:
   * 1. Restores the user from the session.
   * 2. Calls the authentication service to log out the user.
   * 3. Cleans up the session on a successful logout.
   * 4. Reloads the window to ensure the changes are reflected.
   *
   * @return {void}
   */
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

  /**
   * Generates a random Latin phrase and its English translation based on the provided sign.
   *
   * @param {string} sign - The sign used to look up the associated Latin phrases.
   * @return {{ latin: string, english: string }} An object containing the Latin phrase and its English translation.
   */
  public latin_phrase(sign: string): { latin: string, english: string } {
    return _.chain(latinPhrases.find(x => x.sign === sign)!.phrases)
      .shuffle()
      .first()
      .value();
  }

  /**
   * Recalculates the height of the explanation element and updates the `split_height` property.
   *
   * The method waits for a short delay before computing the new height of the
   * explanation element by adding the current vertical scroll position to the top
   * offset of the explanation element. The computed value is then assigned to the
   * `split_height` property.
   *
   * @return {Promise<void>} A promise that resolves once the height recalculation is complete.
   */
  private async recalculate_explanation_height(): Promise<void> {
    return new Promise<void>(r => {
      _.delay(() => {
        try {
          const ex = document.getElementById('explanation');
          if (ex) {
            this.split_height = window.scrollY + document.getElementById('explanation')!.getBoundingClientRect().top;
          }
        } catch (err) {
        } finally {
          r();
        }
      }, 100);
    });
  }

  /**
   * Initializes the necessary data structures and graphical parameters for the application.
   * This includes setting the initial state for planets, zodiac signs, cusps, lines, aspect labels, houses,
   * and other relevant data fields. Calculates various radii for rendering purposes and assembles ruler lines
   * and zodiac signs with their corresponding positions on the circle.
   *
   * @return {void}
   */
  private init(): void {
    this._planets = [];
    this._zodiac = [];
    this._cusps = [];
    this._lines = [];
    this._aspect_labels = [];
    this._houses = [];
    this.data = {};
    this.natal_position_score = 0;
    this.natal_energy_score = 0;

    this.cx = Math.trunc(this.width / 2);
    this.cy = Math.trunc(this.width / 2) - (this.responsive_breakpoint.mode === AppMode.Full ? this.margin / 2 : 0);
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

  /**
   * Processes and configures chart data including houses, sky objects, and transit objects. Adjusts
   * positions, calculates lines, and assembles visual elements for the chart display.
   *
   * @param {any} data - The input data containing information about houses, sky objects, and transits.
   * @return {void}
   */
  private handleChartData(data: any) {
    this.offset_angle = data.Houses.find((z: any) => z.name === 'Cusp1').position;

    this.init();

    this.data = _.clone(data);
    //debug
    console.log(data);

    this._phrase = this.latin_phrase(this.sign);

    for (let i = 0; i < 12; i++) {
      // assemble houses
      const house: any = _.find(data.Houses, (x: any) => x.index == i);
      if (this.selectedPerson?.gender === Gender.Male) {
        if (i == 0 || i == 9) {
          house.dao = Dao.Yang;
        }
        if (i == 3 || i == 6) {
          house.dao = Dao.Yin;
        }
      } else {
        if (i == 0 || i == 9) {
          house.dao = Dao.Yin;
        }
        if (i == 3 || i == 6) {
          house.dao = Dao.Yang;
        }
      }
      const a = house.position;
      const p1 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius, a);
      const p2 = this.get_point_on_circle(this.cx, this.cy, this.house_radius, a);
      this._lines.push({
        p1,
        p2,
        options: _.includes([0, 3, 6, 9], house.index)
          ? house.index == 0 || house.index == 6
            ? {stroke_color: "#090", stroke_width: 4 * this.responsive_breakpoint.scale}
            : {stroke_color: "#900", stroke_width: 4 * this.responsive_breakpoint.scale}
          : {stroke_color: "#000", stroke_width: 1}
      });

      if (_.includes([0, 3, 6, 9], i)) {
        const p1 = this.get_point_on_circle(this.cx, this.cy, this.outer_radius, a);
        const p2 = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 25 * this.responsive_breakpoint.scale, a);
        const options = _.includes([0, 3, 6, 9], house.index)
          ? house.index == 0 || house.index == 6
            ? {stroke_color: "#090", stroke_width: 4 * this.responsive_breakpoint.scale}
            : {stroke_color: "#900", stroke_width: 4 * this.responsive_breakpoint.scale}
          : {stroke_color: "#000", stroke_width: 1};
        this._lines.push({
          p1,
          p2,
          options
        });
        if (i == 0 || i == 9) {
          this._lines.push(
            ...calculate_arrow(9 * this.responsive_breakpoint.scale, 4 * this.responsive_breakpoint.scale, p1, p2, options)
          );
        }
      }

      const b = i == 11
        ? _.find(data.Houses, (x: any) => x.index == 0)
        : _.find(data.Houses, (x: any) => x.index == i + 1);

      const c = nl360(a + nl180(b.position - a) / 2) - this.offset_angle;
      let p = this.get_point_on_circle(this.cx, this.cy, this.house_radius + 10, c);
      const p_label = this.get_point_on_circle(this.cx, this.cy, this.house_radius + 10, a - this.offset_angle);
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
        let p = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 40 * this.responsive_breakpoint.scale, c);
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
      const p_adjusted = this.get_point_on_circle(this.cx, this.cy, this.inner_radius - 15 * this.responsive_breakpoint.scale, so.angle - this.offset_angle);
      const p_adjusted_label = this.get_point_on_circle(this.cx, this.cy, this.inner_radius - 36 * this.responsive_breakpoint.scale, so.angle - this.offset_angle);

      const p1 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius, x.position);
      const p2 = this.get_point_on_circle(this.cx, this.cy, this.inner_radius - 5 * this.responsive_breakpoint.scale, x.position);

      const p_adjusted_ = this.get_point_on_circle(this.cx, this.cy, this.inner_radius - 15 * this.responsive_breakpoint.scale, so.angle);
      const p3 = point_on_the_line(3, p2, p_adjusted_);

      this._lines.push({p1, p2}, {p1: p2, p2: p3});

      this._planets.push({
        kind: 'natal',
        name: x.name,
        ...p_adjusted,
        text: (x.speed < 0 ? 'r' : ''),
        label: {
          angle: convert_DD_to_D(pos_in_zodiac_sign(x.position)),
          pos: {
            ...p_adjusted_label
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
        const p = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 15 * this.responsive_breakpoint.scale, so.angle - this.offset_angle);
        const p1 = this.get_point_on_circle(this.cx, this.cy, this.outer_radius, x.position);
        const p2 = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 5 * this.responsive_breakpoint.scale, x.position);
        const p_label = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 35 * this.responsive_breakpoint.scale, so.angle - this.offset_angle);

        const p_ = this.get_point_on_circle(this.cx, this.cy, this.outer_radius + 15 * this.responsive_breakpoint.scale, so.angle);
        const p3 = point_on_the_line(3, p2, p_);

        this._lines.push({p1, p2}, {p1: p2, p2: p3});


        this._lines.push({
          p1,
          p2
        })
        this._planets.push({
          kind: 'transit',
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

    const calc_aspects = (aspects: any[]) => {
      _.uniqBy(aspects.flatMap((x: any) => x.parties), 'name')
        .forEach((x: any) => {
          let p1 = this.get_point_on_circle(this.cx, this.cy, this.house_radius + 2, x.position);
          let p2 = this.get_point_on_circle(this.cx, this.cy, this.house_radius, x.position);
          this.lines.push({
            p1,
            p2,
            options: {stroke_color: "#000"}
          });
          p1 = this.get_point_on_circle(this.cx, this.cy, this.house_radius - 1, x.position);
          p2 = this.get_point_on_circle(this.cx, this.cy, this.house_radius - 3, x.position);
          this.lines.push({
            p1,
            p2,
            options: {stroke_color: "#fff"}
          });
        });

      aspects.forEach((x: any) => {
        const p1 = this.get_point_on_circle(this.cx, this.cy, this.house_radius - 3, x.parties[0].position);
        const p2 = this.get_point_on_circle(this.cx, this.cy, this.house_radius - 3, x.parties[1].position);
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
            options: _.assign({}, options, {scale: this.responsive_breakpoint.scale})
          });
        }
      });
      return aspects;
    }

    // Natal Aspects
    if (this.show_natal_aspects) {
      const aspects = this.data.Aspects.filter((x: any) =>
        _.includes(aspect_names_enabled, x.aspect.name) &&
        !_.some(x.parties, p => _.includes(['2 house', '3 house', '5 house', '6 house', '8 house', '9 house', '11 house', '12 house'], p.name))
      );
      calc_aspects(aspects);
    } else {
      // Transit Aspects

      const transit_names_enabled: string[] = Array
        .from(this.settings.transit_settings_iter)
        .filter(x => x.enabled)
        .map(x => x.name);

      const aspects = this.data.Transit.Aspects.filter((x: any) =>
        _.includes(aspect_names_enabled, x.aspect.name) &&
        _.includes(transit_names_enabled, x.parties[0].name) &&
        !_.some(x.parties, p => {
          return _.includes(['2 house', '3 house', '5 house', '6 house', '8 house', '9 house', '11 house', '12 house'], p.name);
        })
      );
      calc_aspects(aspects);
    }

    // stat lines
    let cnt = 1;
    this._stat_lines = [];
    const sun_house = this.data.SkyObjects.find((so: any) => so.name === SYMBOL_PLANET.Sun).house.index + 1;
    this.data.dayChart = _.includes([7, 8, 9, 10, 11, 12], sun_house);
    this.data.SkyObjects.forEach((so: any) => {
      const STAT_MARGIN = 12;
      this._stat_lines.push({
        kind: 'planets',
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
    this.data.Transit.SkyObjects.forEach((so: any) => {
      const STAT_MARGIN = 12;
      this._stat_lines.push({
        kind: 'transits',
        x: STAT_MARGIN,
        y: STAT_MARGIN + cnt * 18,
        stats: {
          name: so.name,
          label: so.name,
          position: pos_in_zodiac(so.position),
          speed: so.speed,
          house: so.house.symbol + ' House',
          dignities: this.format_dignities(so, true)
        }
      });
      cnt++;
    });
    cnt = 1;
    this.data.Houses.forEach((so: any) => {
      const STAT_MARGIN = 12;
      this._stat_lines.push({
        kind: 'houses',
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
  }

  /**
   * Formats the dignities of a given sky object based on its astrological properties and position.
   *
   * @param {Object} so - The sky object containing its name, position, and various dignities.
   * @param {boolean} [isTransit=false] - Indicates whether the current context is a transit.
   * @return {string} - A formatted string representing the dignities and their score.
   */
  private format_dignities(so: any, isTransit: boolean = false): string {

    if (_.includes([SYMBOL_PLANET.ParsFortuna], so.name)) {
      return '';
    }

    const so_weight = getSkyObjectRankWeight(so.name);

    const sign: string = zodiac_sign(so.position);
    let result: string[] = [];
    let score: number = 0;
    if (_.some(_.get(so, "dignities.domicile", []), x => x === sign)) {
      result.push("SDom");
      score += 3;
    } else if (_.some(_.get(so, "dignities.exaltation", []), x => x === sign)) {
      result.push("SExa");
      score += 2;
    } else if (_.some(_.get(so, "dignities.detriment", []), x => x === sign)) {
      result.push("SDet");
      score -= 3;
    } else if (_.some(_.get(so, "dignities.fall", []), x => x === sign)) {
      result.push("SFal");
      score -= 2;
    } else if (_.some(_.get(so, "dignities.friend", []), x => x === sign)) {
      result.push("SFri");
      score += 1;
    } else if (_.some(_.get(so, "dignities.enemy", []), x => x === sign)) {
      result.push("SEne");
      score -= 1;
    }

    if (so.oriental && this.data.dayChart) {
      result.push("Ori");
      score += 2;
    }
    if (!so.oriental && !this.data.dayChart) {
      result.push("Occ");
      score += 2;
    }

    if (so.speed < 0) {
      score -= 2;
    }
    if (_.includes([1, 4, 7, 10], so.house.index + 1)) {
      score += 2;
    } else if (_.includes([12, 9, 6, 3], so.house.index + 1)) {
      score -= 2;
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
      score += 3;
      result.push("HDom");
      //console.log(`${so.name} ${house_sign} ${so.dignities.domicile.join('|')}`);
    }
    const det = _.some(this.sky_objects.filter(x => x.dignities && _.includes(x.dignities.detriment, house_sign)), z => z.name === so.name);
    if (det) {
      score -= 3;
      result.push("HDet");
      //console.log(`${so.name} ${house_sign} ${so.dignities.detriment.join('|')} ${found.name}`);
    }

    result.push(` (${(score * so_weight).toFixed(2)})`);

    //this.avg_score = aspect_score;
    if (!isTransit) {

      let aspect_score = 0;
      this.data.Aspects.forEach((a: any) => {

        if (so.name === a.parties[0].name) {
          const aspect_weight = (getSkyObjectRankWeight(so.name) + getSkyObjectRankWeight(a.parties[1].name)) / 2;
          let rank: number;
          switch (a.aspect.angle) {
            // stressful
            case 90:
              rank = -8;
              break;  // big obstacles
            case 45:
              rank = -3;
              break;   // some frictions
            case 135:
              rank = -1;
              break;  // little discomfort

            // stabilizing
            case 60:
              rank = 8;
              break;   // good opportunity
            case 120:
              rank = 7;
              break;   // harmony, easy going
            case 30:
              rank = 3;
              break;   // little helper
            case 150:
              rank = 1;
              break;   // increase, growth   (with Asc -- health troubles)

            case 180:  // balancing differences
            case 0:    // dao conjunction
              if (a.parties[1].name === SYMBOL_PLANET.ParsFortuna) {
                a.parties[1].dao = this.selectedPerson?.gender === Gender.Male ? Dao.Yang : Dao.Yin;
              }
              if (_.startsWith(a.parties[1].name, "Cusp")) {
                const found = this.data.Houses.find((x: any) => x.name === a.parties[1].name);
                if (found) {
                  a.parties[1].dao = found.dao;
                }
              }
              if ((a.parties[0].dao === Dao.Yin && a.parties[1].dao === Dao.Yang) ||
                (a.parties[0].dao === Dao.Yang && a.parties[1].dao === Dao.Yin)) {
                rank = a.aspect.angle === 0 ? -7 : 7;
              } else {
                rank = a.aspect.angle === 0 ? 7 : -7;
              }
              break;
            default:
              rank = 0;
          }
          aspect_score += rank * aspect_weight;
          //console.log(`${a.parties[0].name}:${a.parties[0].dao} ${a.aspect.name} ${a.parties[1].name}:${a.parties[1].dao} ---- ${(rank * aspect_weight).toFixed(2)}`);
        }
      });

      this.natal_position_score += score * so_weight;
      this.natal_energy_score += aspect_score;
    }

    return result.join(', ');
  }

  /**
   * Adjusts the positions of elements within a circular area based on their relative positions.
   *
   * @param {Array} sos - An array of objects to adjust, each should have `name` and `position` properties.
   * @param {boolean} [transit=false] - A boolean flag to determine whether to use the outer radius or the inner radius for adjustment.
   * @return {Array} An array of adjusted points, each containing properties such as `name`, position coordinates, radius, angle, and pointer.
   */
  private adjust(sos: any[], transit: boolean = false): any[] {
    const so_radius = transit ? this.outer_radius + 15 : this.inner_radius - 15;
    let points: any[] = [];
    sos.forEach(so => {
      const position = this.get_point_on_circle(this.cx, this.cy, so_radius, so.position);
      const point = {
        name: so.name, ...position,
        r: COLLISION_RADIUS * this.responsive_breakpoint.scale,
        angle: so.position,
        pointer: so.position
      };
      points = this.locate(points, point, so_radius);
    });
    return points;
  }

  /**
   * Determines if two objects are in collision based on their coordinates and radii.
   *
   * @param {Object} a - The first object with properties x, y, and r representing its coordinates and radius.
   * @param {Object} b - The second object with properties x, y, and r representing its coordinates and radius.
   * @return {boolean} - Returns true if the objects are colliding, otherwise false.
   */
  private in_collision(a: any, b: any): boolean {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy) <= a.r + b.r;
  }

  /**
   * Adjusts the angles of two points to resolve a collision based on their pointers and a defined collision radius.
   *
   * @param {object} p1 - The first point, which should contain properties `pointer` and `angle`.
   * @param {object} p2 - The second point, which should contain properties `pointer` and `angle`.
   * @return {void} - This method does not return any value.
   */
  private adjust_collision(p1: any, p2: any) {
    const step = 1;
    if (
      (p1.pointer <= p2.pointer && Math.abs(p1.pointer - p2.pointer) <= COLLISION_RADIUS * this.responsive_breakpoint.scale) ||
      (p1.pointer >= p2.pointer && Math.abs(p1.pointer - p2.pointer) >= COLLISION_RADIUS * this.responsive_breakpoint.scale)
    ) {
      p1.angle = nl360(p1.angle - step);
      p2.angle = nl360(p2.angle + step);
    } else {
      p1.angle = nl360(p1.angle + step);
      p2.angle = nl360(p2.angle - step);
    }
  }

  /**
   * Locates a point within a given radius, ensuring it does not collide with other points.
   * If a collision is detected, it adjusts the positions to resolve the conflict.
   *
   * @param {any[]} points - The array of existing points.
   * @param {any} point - The new point to be located.
   * @param {number} radius - The radius within which to locate the point.
   * @return {any[]} The updated array of points after resolving potential collisions.
   */
  private locate(points: any[], point: any, radius: number): any[] {
    if (points.length == 0) {
      points.push(point);
      return points;
    }
    if ((2 * Math.PI * radius) - (2 * COLLISION_RADIUS * this.responsive_breakpoint.scale * (points.length + 1)) <= 0) {
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

  /**
   * Scrolls to the bottom of the given HTMLDivElement. If elements with
   * the class "explanation-wrap" are found within the container, it
   * scrolls smoothly to the last one. Otherwise, it scrolls to the
   * bottom of the container.
   *
   * @param {HTMLDivElement} element - The container element to scroll.
   * @return {void} - This method does not return a value.
   */
  private scrollToBottom(element: HTMLDivElement) {
    const all_explanations = element.querySelectorAll('.explanation-wrap');
    if (all_explanations) {
      if (all_explanations.length > 1) {
        const last = all_explanations[all_explanations.length - 1];
        last.scrollIntoView({behavior: "smooth"});
      }
    } else {
      element.scroll({top: element.scrollHeight, behavior: 'smooth'});
    }
  }
}


