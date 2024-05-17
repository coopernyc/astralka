import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {ConnectedPosition, Overlay, OverlayModule} from "@angular/cdk/overlay";
import {PortalModule} from "@angular/cdk/portal";
import {AstralkaBasePortalComponent} from "../base.portal";
import {ChartSymbol} from "../graphics/chart-symbol";
import {SettingsService} from "../../services/settings.service";

@Component({
  selector: 'astralka-house-system',
  standalone: true,
  imports: [CommonModule, OverlayModule, PortalModule, ChartSymbol],
  template: `
    <button
      #button
      type="button"
      name="settings-btn"
      class="btn"
      (click)="toggle()"
    >
      <ng-content></ng-content>
      <ng-template cdkPortal #overlayTemplate="cdkPortal">
        <div class="settings-content hsys">
          @for (hs of house_systems; track hs.id) {
            <div class="map-item" [class.selected]="hs.selected" (click)="select_house_system(hs)">
              <span></span>
              {{hs.name}}
            </div>
          }
        </div>
      </ng-template>
    </button>
  `,
  styleUrl: 'map-settings.scss'
})
export class AstralkaHouseSystemSettingsComponent extends AstralkaBasePortalComponent {

  constructor(overlay: Overlay, private settings: SettingsService) {
    super(overlay);
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

  public get house_systems(): IterableIterator<any> {
    return this.settings.house_system_settings_iter;
  }

  public select_house_system(hs: any) {
    this.settings.update_map_settings('house-system-settings', hs);
  }
}
