import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {PortalModule} from "@angular/cdk/portal";
import {ConnectedPosition, Overlay, OverlayModule} from "@angular/cdk/overlay";
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
            [title]="title"
            #button
            type="button"
            name="position-data"
            class="btn"
            (click)="toggle()"
        >
            <ng-content></ng-content>
        </button>
        <ng-template cdkPortal #overlayTemplate="cdkPortal">
          <div class="portal-content" [class.houses]="kind === 'houses'" [class.transits]="kind === 'transits'">
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
                <div style="text-align: left;" [style.flex]="kind!=='houses'?'0 60px':'0 40px'">{{stat.label}}</div>
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
                @if (kind === 'planets' || kind === 'transits') {
                  @if (kind === 'transits') { transiting }
                  <div style="text-align: right; flex: 0 40px; padding-right: 8px;">{{stat.house}}</div>
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
  @Input() kind: 'planets' | 'houses' | 'transits' = 'planets';

  constructor(overlay: Overlay, public rest: RestService) {
    super(overlay);
  }

  public get stats(): any[] {

    return this.positions.filter(x => {
      return x.kind === this.kind;
    }).map(x => x.stats);
  }

  public get_explanation_from_ai(stats: any) {
    const prompt: string = this.kind === "houses"
      ? `In a couple of paragraphs describe meaning of ${stats.name} in ${stats.position.sign}`
      : this.kind === 'planets'
        ? `In a couple of paragraphs describe meaning of ${stats.speed < 0 ? 'retrograde ':''}${stats.name} in ${stats.position.sign} sign in ${stats.house}`
        : `In a couple of paragraphs describe meaning of ${stats.speed < 0 ? 'retrograde ':''}${stats.name} in ${stats.position.sign} sign in transit over ${stats.house}`;
    let context: string;
    if (this.kind === 'planets' || this.kind === 'transits') {
      const names = [stats.name, stats.position.sign];
      context = names[_.random(names.length - 1)];
    } else {
      context = stats.position.sign;
    }
    this.rest.do_explain({ prompt, params: this.stats, context });
  }

  protected override get connectedPositions(): ConnectedPosition[] {
    return this.kind === 'transits' ? [
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
    ] : super.connectedPositions;
  }

  protected readonly SYMBOL_PLANET = SYMBOL_PLANET;
  protected readonly _ = _;
}
