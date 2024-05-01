import {ChangeDetectorRef, Component, ElementRef, ViewChild} from "@angular/core";
import {CdkPortal, PortalModule} from "@angular/cdk/portal";
import {Overlay, OverlayConfig, OverlayModule, OverlayRef} from "@angular/cdk/overlay";
import {CommonModule} from "@angular/common";
import {SettingsService} from "../../services/settings.service";
import _ from "lodash";
import {FormsModule} from "@angular/forms";
import {ChartSymbol} from "../graphics/chart-symbol";
import {LocalStorageService} from "../../services/local.storage.service";

@Component({
  selector: 'transit-settings',
  standalone: true,
  imports: [
    CommonModule,
    PortalModule,
    OverlayModule,
    FormsModule,
    ChartSymbol
  ],
  template: `
    <button
      #button
      type="button"
      id="settings-btn"
      name="settings-btn"
      (click)="toggle()"
    >
      <ng-content></ng-content>
    </button>
    <ng-template cdkPortal #overlayTemplate="cdkPortal">
      <div class="settings-content transit">
        @for (a of transits; track a.name; ) {
          <div class="map-item">
            <input type="checkbox" [ngModel]="a.enabled" (ngModelChange)="update(a, $event)" style="flex: 0 15px"/>
            <div style="flex: 0 18px">
              <svg xmlns="http://www.w3.org/2000/svg"
                   width="18"
                   height="18"
                   viewBox="0 0 18 18">
                <g svgg-symbol [x]="7" [y]="11" [name]="a.name" [options]="{scale: 0.8}"></g>
              </svg>
            </div>
            <div class="map-name">{{ a.name }}</div>
          </div>
        }
      </div>
    </ng-template>
  `,
  styleUrl: "./map-settings.scss"
})
export class AstralkaTransitSettingsComponent {

  private overlayRef!: OverlayRef;
  private showing: boolean = false;


  @ViewChild(CdkPortal) public contentTemplate!: CdkPortal;
  @ViewChild("button") public btn!: ElementRef;

  constructor(private overlay: Overlay,
              private settings: SettingsService,
              private cdr: ChangeDetectorRef) {

  }

  public get transits(): IterableIterator<any> {
    return this.settings.transit_settings_iter;
  }

  public show(): void {
    if (!this.showing) {
      this.overlayRef = this.overlay.create(this.getOverlayConfig());
      this.overlayRef.attach(this.contentTemplate);
      this.overlayRef.backdropClick().subscribe(() => this.hide());
      this.showing = true;
    }
  }

  public hide(): void {
    this.overlayRef.detach();
    this.showing = false;
  }

  private getOverlayConfig(): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(this.btn.nativeElement)
      .withPush(true)
      .withPositions([
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
      ]);

    const scrollStrategy = this.overlay.scrollStrategies.reposition();
    return new OverlayConfig({
      positionStrategy: positionStrategy,
      scrollStrategy: scrollStrategy,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });
  }

  public toggle() {
    if (!this.showing) {
      this.show();
    } else {
      this.hide();
    }
  }

  public update(item: any, value: boolean): void {
    item.enabled = value;
    this.settings.update_map_settings("transit-settings", item);
  }
}
