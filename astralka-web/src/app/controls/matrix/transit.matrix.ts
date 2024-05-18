import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AstralkaBasePortalComponent} from "../base.portal";
import {ConnectedPosition, Overlay, OverlayModule} from "@angular/cdk/overlay";
import {RestService} from "../../services/rest.service";
import {aspect_color, convert_DD_to_D, SYMBOL_CUSP, SYMBOL_PLANET, zodiac_sign} from "../../common";
import _ from "lodash";
import {PortalModule} from "@angular/cdk/portal";
import {ChartSymbol} from "../graphics/chart-symbol";
import {ChartText} from "../graphics/chart-text";

@Component({
  selector: 'astralka-transit-matrix',
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
      <div class="portal-content transit">
        <svg style="position: absolute; left: 0"
             [style.flex]="'flex: 0 390px'" xmlns="http://www.w3.org/2000/svg"
             [attr.width]="410"
             [attr.height]="370"
             [attr.viewBox]="'0 0 410 370'"
             #chart
        >
          @for (m of matrix; track m) {
            <g transform="translate(18, 14)">
              <rect [attr.x]="m.x - step/2" [attr.y]="m.y - step/2" [attr.width]="step" [attr.height]="step"
                    cursor="pointer"
                    class="rect"
                    [class.planet]="m && m.type === 0 || m.type === 2"
                    [class.selected]="selected === m"
                    (click)="get_explanation_from_ai(m)"
              >
                @if (m.type === 1) {
                  <title>{{ m.name }} {{ m.aspect_angle }}° {{m.aspect ? '('+convert_DD_to_D(m.aspect.angle)+')' : ''}}</title>
                } @else if (m.type === 0|| m.type === 2) {
                    <title>{{ m.name }}</title>
                }
              </rect>

              <g pointer-events="none" svgg-symbol [x]="m.x" [y]="m.y" [name]="m.name" [options]="options(m)"></g>
              <g *ngIf="(m.type===0 || m.type===2) && m.retrograde" svgg-text [x]="m.x + 6" [y]="m.y + 3" [text]="'r'"
                 [options]="{stroke_color: 'none', fill: 'goldenrod', filtered: false}"></g>
            </g>
          }
        </svg>
      </div>
    </ng-template>
  `,
  styleUrl: 'matrix.scss'
})
export class AstralkaTransitMatrixComponent extends AstralkaBasePortalComponent implements OnChanges {
  @Input() data: any = {};

  public readonly step: number = 22;
  public selected: any = null;
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
    const transit: any[] = _.values(SYMBOL_PLANET);
    const natal: any[] = _.values(SYMBOL_PLANET);
    natal.push(SYMBOL_CUSP.Cusp1, SYMBOL_CUSP.Cusp10);

    for (let t = 0; t < transit.length; t++) {
      for (let n = 0; n < natal.length; n++) {
        const found: any = _.find(this.aspects, x => {
          const parties = x.parties.map(z => z.name);
          const matches = [transit[t], natal[n]];
          return _.isEqual(parties, matches);
        });
        this.pool.push({
          x: this.step + n * this.step,
          y: this.step + t * this.step,
          name: found ? found.aspect.name : '',
          aspect_angle: found ? found.aspect.angle : 0,
          type: 1,
          aspect: found
        });
        const so = this.sky_objects.find(x => x.name === natal[n]);
        const retrograde = so && so.speed && so.speed < 0;
        this.pool.push({
          x: this.step + n * this.step,
          y: 0,
          name: natal[n],
          type: 0,
          retrograde: retrograde
        });
      }
      const tr = this.transits.find(x => x.name === transit[t]);
      const retrograde = tr && tr.speed && tr.speed < 0;
      this.pool.push({
        x: 0,
        y: this.step + t * this.step,
        name: transit[t],
        type: 2,
        retrograde: retrograde
      });
    }
    this.loaded = true;
    return this.pool;
  }

  protected get aspects(): any[] {
    return this.data ? this.data.Transit.Aspects : [];
  }

  protected get transits(): any[] {
    return this.data ? this.data.Transit.SkyObjects : [];
  }

  protected get sky_objects(): any[] {
    return this.data ? this.data.SkyObjects : [];
  }

  protected override get connectedPositions(): ConnectedPosition[] {
    return [
      {
        originX: 'end',
        originY: 'bottom',
        overlayX: 'end',
        overlayY: 'top',
        offsetY: 2,
      },
      {
        originX: 'end',
        originY: 'top',
        overlayX: 'end',
        overlayY: 'bottom',
        offsetY: -2,
      },
    ];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["data"]) {
      this.loaded = false;
      if (!changes["data"].currentValue || _.isEmpty(changes["data"].currentValue)) {
        this.selected = null;
      }
    }
  }

  public get_explanation_from_ai(m: any): void {
    if (m.type === 1) {
      this.pool = _.flatten(_.partition(this.pool, x => x !== m));
      if (m && m.type === 1 && m.aspect) {
        this.selected = m;
        const party0 = this.format_party(this.selected.aspect.parties[0]);
        const party1 = this.format_party(this.selected.aspect.parties[1]);
        const prompt = `Write in 30-40 words describe meaning of Transit ${party0} is in ${this.selected.aspect.aspect.name} with Natal ${party1}.`;
        this.rest.do_explain({prompt, params: m, context: this.selected.aspect.aspect.name});
      }
    }
  }

  public options(m: any): any {
    let options: any = {scale: 1};
    if (m.type === 0 || m.type === 2) {
      options = {scale: 0.75, stroke_color: "goldenrod"};
      return options;
    }
    _.merge(options, aspect_color(m.aspect_angle));
    return options;
  }

  private format_party(party: any): string {
    const r = _.isUndefined(party.speed) || party.speed >= 0 ? '' : 'retrograde ';
    let result;
    if (_.startsWith(party.name, 'Cusp')) {
      result = `${party.symbol} House in ${zodiac_sign(party.position)}`;
    } else {
      result = `${r}${party.name} in ${zodiac_sign(party.position)} and in ${party.house.symbol} House in ${zodiac_sign(party.house.position)}`;
    }
    return result;
  }

  protected readonly convert_DD_to_D = convert_DD_to_D;
}
