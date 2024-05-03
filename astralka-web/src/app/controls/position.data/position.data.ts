import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PortalModule} from "@angular/cdk/portal";
import {Overlay, OverlayConfig, OverlayModule} from "@angular/cdk/overlay";
import {AstralkaBasePortalComponent} from "../base.portal";
import {ChartSymbol} from "../graphics/chart-symbol";
import {SYMBOL_PLANET} from "../../common";
import _ from "lodash";
import {RestService} from "../../services/rest.service";

@Component({
  selector: 'astralka-position-data',
  standalone: true,
  imports: [
    CommonModule,
    PortalModule,
    OverlayModule,
    ChartSymbol
  ],
  template: `
        <button
            #button
            type="button"
            name="position-data"
            class="btn"
            (click)="toggle()"
        >
            <ng-content></ng-content>
        </button>
        <ng-template cdkPortal #overlayTemplate="cdkPortal">
          <div class="portal-content" [class.houses]="kind === 'houses'">
            @for (stat of stats; track stat.name) {
              <div class="map-item" (click)="get_explanation_from_ai(stat)">
                <div style="flex: 0 13px">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       width="13"
                       height="13"
                       viewBox="0 0 13 13">
                    <g svgg-symbol [x]="6" [y]="8" [name]="stat.name" [options]="{scale: 0.65}"></g>
                  </svg>
                </div>
                <div style="flex: 0 8px">{{stat.speed < 0 ? 'r':''}}</div>
                <div style="text-align: left;" [style.flex]="kind==='planets'?'0 60px':'0 40px'">{{stat.label}}</div>
                <div style="text-align: right; flex: 0 25px; margin-right: 2px">{{stat.position.deg_fmt}}</div>
                <div style="flex: 0 13px;">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       width="13"
                       height="13"
                       viewBox="0 0 13 13">
                    <g svgg-symbol [x]="6" [y]="8" [name]="stat.position.sign" [options]="{scale: 0.6}"></g>
                  </svg>
                </div>
                <div style="text-align: left; flex: 0 40px; margin-left: 2px">{{stat.position.min_fmt}}{{stat.position.sec_fmt}}</div>
                @if (kind === 'planets') {
                    <div style="text-align: right; flex: 0 60px; padding-right: 8px;">{{stat.house}}</div>
                    <div style="text-align: left; flex: 1">{{stat.dignities}}</div>
                }
              </div>
            }
          </div>
        </ng-template>
    `,
  styleUrl: "position.data.scss"
})
export class AstralkaPositionDataComponent extends AstralkaBasePortalComponent {
  @Input() positions!: any[];
  @Input() kind: 'planets' | 'houses' = 'planets';

  constructor(overlay: Overlay, public rest: RestService) {
    super(overlay);
  }

  public get stats(): any[] {
    return this.positions.filter(x => {
      if (this.kind === 'planets') {
        return !_.startsWith(x.stats.name, 'Cusp');
      } else {
        return _.startsWith(x.stats.name, 'Cusp');
      }
    }).map(x => x.stats);
  }

  public get_explanation_from_ai(stats: any) {
    const prompt: string = stats.label === "House"
      ? `In maximum 30 words interpret ${stats.name} in ${stats?.position.sign}`
      : `In maximum 30 words interpret ${stats.speed < 0 ? 'retrograde ':''}${stats.name} in ${stats.position.sign} sign in ${stats.house}`;
    this.rest.do_explain({ prompt, params: this.stats});
  }

  protected readonly SYMBOL_PLANET = SYMBOL_PLANET;
  protected readonly _ = _;
}
