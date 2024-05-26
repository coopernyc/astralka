import {Component, Input, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {
  IToolbarCmd,
  IToolbarItem,
  IToolbarMenu,
  IToolbarNavCmd,
  ToolbarAlign,
  ToolbarDisplay,
  ToolbarMenuSpan
} from "../../common";
import {AsPipe} from "../type.cast.pipe";
import {TypeofPipe} from "../typof.pipe";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {CdkPortal, PortalModule} from "@angular/cdk/portal";
import {Overlay, OverlayConfig, OverlayModule, OverlayRef} from "@angular/cdk/overlay";

@Component({
  selector: 'astralka-toolbar-set',
  standalone: true,
  imports: [AsPipe, TypeofPipe, FontAwesomeModule, PortalModule, OverlayModule],
  template: `
    @for(cmd of commands; track cmd) {
      @switch(cmd.type) {
        @case('item') {
            <button
              type="button"
              [class]="'toolbar-button ' + iconClass(cmd)"
              [title]="(cmd | as : IToolbarNavCmd).tooltip"
              [disabled]="(cmd | as: IToolbarNavCmd).disabled()"
              (click)="action(cmd)"
            >
            @if (display(cmd, ToolbarDisplay.Icon)) {
              <fa-icon [icon]="icon(cmd)"></fa-icon>
            }
            @if (display(cmd, ToolbarDisplay.Text)) {
              {{(cmd | as: IToolbarNavCmd).label}}
            }
            </button>
        }
        @case('separator') {
            <div class="toolbar-separator"></div>
        }
        @case('menu') {
          <button
            type="button"
            [class]="'toolbar-button ' + iconClass(cmd)"
            [title]="(cmd | as : IToolbarNavCmd).tooltip"
            [disabled]="(cmd | as: IToolbarNavCmd).disabled()"
            #ref
            (click)="show(ref)"
          >
            @if (display(cmd, ToolbarDisplay.Icon)) {
              <fa-icon [icon]="icon(cmd)"></fa-icon>
            }
            @if (display(cmd, ToolbarDisplay.Text)) {
              {{(cmd | as: IToolbarNavCmd).label}}
            }
          </button>
          <ng-template cdkPortal #overlayTemplate="cdkPortal">
            <div
              class="toolbar-menu"
              [class.double]="(cmd | as : IToolbarMenu).menuSpan === ToolbarMenuSpan.Double"
              [class.triple]="(cmd | as : IToolbarMenu).menuSpan === ToolbarMenuSpan.Triple"
            >
              @for(m_cmd of menu_commands(cmd); track m_cmd) {
                @switch(m_cmd.type) {
                  @case('item') {
                    <button
                      type="button"
                      [class]="'toolbar-menu-button ' + iconClass(m_cmd)"
                      [title]="(m_cmd | as : IToolbarNavCmd).tooltip"
                      [disabled]="(m_cmd | as: IToolbarNavCmd).disabled()"
                      (click)="action(m_cmd)"
                    >
                      @if (display(m_cmd, ToolbarDisplay.Icon)) {
                        <fa-icon [icon]="icon(m_cmd)" [fixedWidth]="true"></fa-icon>
                      } @else {
                        <div style="width: 32px"></div>
                      }
                      @if (display(m_cmd, ToolbarDisplay.Text)) {
                        {{(m_cmd | as: IToolbarNavCmd).label}}
                      }
                    </button>
                  }
                  @case('separator') {
                    <div class="toolbar-menu-separator"></div>
                  }
                }
              }
            </div>
          </ng-template>
        }
      }
    }
  `,
  styleUrl: 'toolbar.set.scss'
})
export class AstralkaToolbarSetComponent {
  @Input() commands: IToolbarCmd[] = [];
  private overlayRef!: OverlayRef;
  private showing: boolean = false;
  @ViewChild(CdkPortal) public contentTemplate!: CdkPortal;

  constructor(protected overlay: Overlay) {
  }
  public display(cmd: IToolbarCmd, mask: ToolbarDisplay): boolean {
    let c = cmd as IToolbarItem;
    return c && !!(c.display & mask);
  }
  public icon(cmd: IToolbarCmd): IconProp {
    let c = cmd as IToolbarNavCmd;
    if (c.iconResolver) {
      return c.iconResolver().icon as IconProp;
    } else {
      return c.icon as IconProp;
    }
  }
  public iconClass(cmd: IToolbarCmd): string {
    let c = cmd as IToolbarNavCmd;
    if (c && c.iconResolver) {
      return c.iconResolver().cssClass;
    } else {
      return '';
    }
  }
  public action(cmd: IToolbarCmd): void {
    let c = cmd as IToolbarNavCmd;
    if (c) {
      this.hide();
      c.action();
    }
  }
  public menu_commands(cmd: IToolbarCmd): IToolbarCmd[] {
    let c = cmd as IToolbarMenu;
    return c.commands;
  }
  public show(el: HTMLButtonElement): void {
    if (!this.showing) {
      this.overlayRef = this.overlay.create(this.getOverlayConfig(el));
      this.overlayRef.attach(this.contentTemplate);
      this.overlayRef.backdropClick().subscribe(() => this.hide());
      this.showing = true;
    }
  }
  public hide(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
    this.showing = false;
  }
  protected getOverlayConfig(el: HTMLElement): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(el)
      .withPush(true)
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top',
          offsetY: 2,
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
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
  protected IToolbarNavCmd!: IToolbarNavCmd;
  protected IToolbarMenu!: IToolbarMenu;
  protected readonly ToolbarDisplay = ToolbarDisplay;
  protected readonly ToolbarMenuSpan = ToolbarMenuSpan;
}

@Component({
  selector: 'astralka-toolbar',
  standalone: true,
  imports: [CommonModule, AstralkaToolbarSetComponent],
  template: `
    <div class="toolbar-container">
      <div class="toolbar-left">
        <astralka-toolbar-set [commands]="leftCommands"></astralka-toolbar-set>
        <div class="toolbar-center"><ng-content></ng-content></div>
      </div>
      <astralka-toolbar-set class="toolbar-right" [commands]="rightCommands"></astralka-toolbar-set>
    </div>
  `,
  styleUrl: 'toolbar.scss'
})
export class AstralkaToolbarComponent {
  @Input() commands: IToolbarCmd[] = [];

  constructor() {
  }

  public get leftCommands(): IToolbarCmd[] {
    return this.commands.filter((x: IToolbarCmd) => !x.align || (x.align === ToolbarAlign.Left));
  }

  public get rightCommands(): IToolbarCmd[] {
    return this.commands.filter((x: IToolbarCmd) => x.align === ToolbarAlign.Right);
  }


}
