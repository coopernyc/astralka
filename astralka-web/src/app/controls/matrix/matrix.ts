import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PortalModule} from "@angular/cdk/portal";
import {Overlay, OverlayModule} from "@angular/cdk/overlay";
import {ChartSymbol} from "../graphics/chart-symbol";
import {AstralkaBasePortalComponent} from "../base.portal";
import {aspect_color, convert_DD_to_D, format_party, SYMBOL_CUSP, SYMBOL_PLANET} from "../../common";
import _ from "lodash";
import {ChartText} from "../graphics/chart-text";
import {RestService} from "../../services/rest.service";

@Component({
  selector: 'astralka-matrix',
  standalone: true,
  imports: [
    CommonModule,
    PortalModule,
    OverlayModule,
    ChartSymbol,
    ChartText
  ],
  template: `
    <button
      #button
      type="button"
      name="matrix-data"
      class="btn"
      (click)="toggle()"
      [title]="title"
    >
      <ng-content></ng-content>
    </button>
    <ng-template cdkPortal #overlayTemplate="cdkPortal">
      <div class="portal-content">
        <svg style="position: absolute; left: 0"
             [style.flex]="'flex: 0 390px'" xmlns="http://www.w3.org/2000/svg"
             [attr.width]="390"
             [attr.height]="390"
             [attr.viewBox]="'0 0 390 390'"
             #chart
        >
          <g>
            <!--<rect x="0" y="0" [attr.width]="440" [attr.height]="440" fill="none" stroke="#0004"></rect>-->
            <g *ngFor="let m of matrix" transform="translate(18, 14)">
              @if (m.type === 1 && m.name) {
                <rect [attr.x]="m.x - step/2" [attr.y]="m.y - step/2" [attr.width]="step" [attr.height]="step"
                      cursor="pointer"
                      class="rect"
                      [class.selected]="selected === m"
                      (click)="get_explanation_from_ai(m)"
                >
                  <title>{{ m.name }} {{ m.aspect_angle }}°</title>
                </rect>
                <rect [attr.y]="m.x - step/2" [attr.x]="m.y - step/2" [attr.width]="step" [attr.height]="step"
                      cursor="pointer"
                      class="rect"
                      [class.selected]="selected === m"
                      (click)="get_explanation_from_ai(m)"
                >
                  <title>{{ m.name }} {{ m.aspect_angle }}°</title>
                </rect>
              } @else if (m.type === 0) {
                <rect [attr.y]="m.x - step/2" [attr.x]="m.y - step/2" [attr.width]="step" [attr.height]="step"
                      class="rect planet"
                >
                  <title>{{ m.name }}</title>
                </rect>
              } @else {
                <rect [attr.x]="m.x - step/2" [attr.y]="m.y - step/2" [attr.width]="step" [attr.height]="step"
                      class="rect-empty"
                ></rect>
                <rect [attr.y]="m.x - step/2" [attr.x]="m.y - step/2" [attr.width]="step" [attr.height]="step"
                      class="rect-empty"
                ></rect>
              }
              <g pointer-events="none" svgg-symbol [x]="m.x" [y]="m.y" [name]="m.name" [options]="options(m)"></g>
              <g pointer-events="none" class="angle" svgg-text [y]="m.x" [x]="m.y"
                 [text]="m.aspect ? convert_DD_to_D(m.aspect.angle) : ''"
                 [options]="{filtered: false, fill: '#49c1c1'}"></g>
              <g *ngIf="m.type===0 && m.retrograde" svgg-text [x]="m.x + 6" [y]="m.y + 3" [text]="'r'"
                 [options]="{stroke_color: 'none', fill: 'goldenrod', filtered: false}"></g>
            </g>
          </g>
        </svg>
      </div>
    </ng-template>
  `,
  styleUrl: 'matrix.scss'
})
export class AstralkaAspectMatrixComponent extends AstralkaBasePortalComponent implements OnChanges {
  @Input() data: any = {};

  public readonly step: number = 22;
  public selected: any = null;
  protected readonly convert_DD_to_D = convert_DD_to_D;
  private pool: any[] = [];
  private loaded: boolean = false;

  constructor(overlay: Overlay, private rest: RestService) {
    super(overlay);
  }

  public get matrix(): any {
    if (!this.aspects || this.aspects.length < 1) {
      return [];
    }
    if (this.loaded) {
      return this.pool;
    }
    this.pool.push({
      x: 0,
      y: 0,
      name: SYMBOL_PLANET.Sun,
      type: 0,
      retrograde: false
    });
    const planets: any[] = _.values(SYMBOL_PLANET); //.filter(x => x !== SYMBOL_PLANET.ParsFortuna);
    //const len = planets.length;
    planets.push(SYMBOL_CUSP.Cusp1, SYMBOL_CUSP.Cusp10);
    for (let i = 1; i < planets.length; i++) {
      let j = 0;
      //for(j; j < Math.min(i, len); j++) {
      for (j; j < i; j++) {
        const found: any = _.find(this.aspects, x => {
          const parties = x.parties.map(z => z.name).sort();
          const matches = [planets[i], planets[j]].sort();
          return _.isEqual(parties, matches);
        });
        this.pool.push({
          x: j * this.step,
          y: i * this.step,
          name: found ? found.aspect.name : '',
          aspect_angle: found ? found.aspect.angle : 0,
          type: 1,
          aspect: found
        });
      }
      const so = this.sky_objects.find(x => x.name === planets[i]);
      const retrograde = so && so.speed && so.speed < 0;
      this.pool.push({
        x: j * this.step,
        y: i * this.step,
        name: planets[i],
        type: 0,
        retrograde: retrograde
      });
    }
    this.loaded = true;
    return this.pool;
  }

  protected get aspects(): any[] {
    return this.data ? this.data.Aspects : [];
  }

  protected get sky_objects(): any[] {
    return this.data ? this.data.SkyObjects : [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"]) {
      this.loaded = false;
      if (!changes["data"].currentValue || _.isEmpty(changes["data"].currentValue)) {
        this.selected = null;
      }
    }
  }

  public options(m: any): any {
    let options: any = {scale: 1};
    if (m.type === 0) {
      options = {scale: 0.75, stroke_color: "goldenrod"};
      return options;
    }
    _.merge(options, aspect_color(m.aspect_angle));
    return options;
  }

  public get_explanation_from_ai(m: any): void {
    this.pool = _.flatten(_.partition(this.pool, x => x !== m));
    if (m && m.type === 1 && m.aspect) {
      this.selected = m;
      const party0 = format_party(this.selected.aspect.parties[0]);
      const party1 = format_party(this.selected.aspect.parties[1]);
      const prompt = `Write in 30-40 words interpretation of ${party0} is in ${this.selected.aspect.aspect.name} with ${party1}.`;
      this.rest.do_explain({prompt, params: m, context: this.selected.aspect.aspect.name});
    }
  }
}
