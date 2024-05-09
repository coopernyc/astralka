import {Component, Directive, ElementRef, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {IToolbarCmd, IToolbarNavCmd, ToolbarAlign} from "../../common";
import {AsPipe} from "../type.cast.pipe";
import {TypeofPipe} from "../typof.pipe";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: 'astralka-toolbar-set',
  standalone: true,
  imports: [AsPipe, TypeofPipe, FontAwesomeModule],
  template: `
    @for(cmd of commands; track cmd) {
      @switch(cmd.type) {
        @case('item') {
            <button
              type="button"
              class="toolbar-button"
              [title]="(cmd | as : IToolbarNavCmd).tooltip"
              [disabled]="(cmd | as: IToolbarNavCmd).disabled()"
              (click)="action(cmd)"
            >
            @if (((cmd | as: IToolbarNavCmd).label | typeof) === "string" ) {
              {{(cmd | as: IToolbarNavCmd).label}}
            } @else {
              <fa-icon [icon]="icon(cmd)" [class]="iconClass(cmd)"></fa-icon>
            }
            </button>
        }
        @case('separator') {
            <div class="toolbar-separator"></div>
        }
      }
    }
  `,
  styleUrl: 'toolbar.set.scss'
})
export class AstralkaToolbarSetComponent {
  @Input() commands: IToolbarCmd[] = [];
  constructor() {
  }

  public icon(cmd: IToolbarCmd): IconProp {
    let c = cmd as IToolbarNavCmd;
    if (c.iconResolver) {
      return c.iconResolver().icon as IconProp;
    } else {
      return c.label as IconProp;
    }
  }
  public iconClass(cmd: IToolbarCmd): string {
    let c = cmd as IToolbarNavCmd;
    if (c.iconResolver) {
      return c.iconResolver().cssClass;
    } else {
      return 'nope';
    }
  }
  public action(cmd: IToolbarCmd): void {
    let c = cmd as IToolbarNavCmd;
    c.action();
  }
  protected IToolbarNavCmd!: IToolbarNavCmd;
}

@Component({
  selector: 'astralka-toolbar',
  standalone: true,
  imports: [CommonModule, AstralkaToolbarSetComponent],
  template: `
    <div class="toolbar-container">
      <astralka-toolbar-set class="toolbar-left" [commands]="leftCommands"></astralka-toolbar-set>
      <div class="toolbar-center"><ng-content></ng-content></div>
      <astralka-toolbar-set class="toolbar-right" [commands]="rightCommands"></astralka-toolbar-set>
    </div>
  `,
  styleUrl: 'toolbar.scss'
})
export class AstralkaToolbarComponent {
  @Input() commands: IToolbarCmd[] = [];

  constructor(private element: ElementRef) {
  }

  public get leftCommands(): IToolbarCmd[] {
    return this.commands.filter((x: IToolbarCmd) => !x.align || (x.align === ToolbarAlign.Left));
  }

  public get rightCommands(): IToolbarCmd[] {
    return this.commands.filter((x: IToolbarCmd) => x.align === ToolbarAlign.Right);
  }


}
