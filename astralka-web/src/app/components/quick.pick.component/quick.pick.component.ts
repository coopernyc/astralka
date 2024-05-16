import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";
import {DraggableDirective} from "../../controls/draggable.directive";
import {DroppableDirective} from "../../controls/droppable.directive";

@Component({
  selector: 'astralka-quick-pick',
  standalone: true,
  imports: [
    CommonModule,
    DraggableDirective,
    DroppableDirective,
    FontAwesomeModule
  ],
  template: `
    @if (picks.length) {
      <div class="quick-pick-container">
        @for (qp of picks; track qp.qp_id) {
          <div
            class="quick-pick"
            [draggable]="{data: qp.qp_id, zones }"
            [droppable]="{data: qp.qp_id, zone: qp.qp_id}"
            (onDropComplete)="dragComplete($event)"
          >
            <button type="button" (click)="select.next(qp.person)" title="Select">{{qp.person.name}}</button>
            <button type="button" class="close-button" (click)="remove.next(qp.qp_id)" title="Delete from Quick Pick">
              <fa-icon [icon]="faClose"></fa-icon>
            </button>
          </div>
        }
      </div>
    }
  `,
  styleUrl: 'quick.pick.component.scss'
})
export class AstralkaQuickPickComponent {
  @Input() picks!: any[];
  @Output() select: EventEmitter<any> = new EventEmitter<any>();
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();
  @Output() swapped: EventEmitter<any> = new EventEmitter<any>();

  public get zones(): string[] {
    return this.picks.map(qp => qp.qp_id);
  }

  public dragComplete(event: any): void {
    if (event) {
      const index1: number = this.picks.findIndex(x => x.qp_id === event.data);
      const index2: number = this.picks.findIndex(x => x.qp_id === event.zone);
      const temp = this.picks[index1];
      this.picks[index1] = this.picks[index2];
      this.picks[index2] = temp;
      this.swapped.next(this.picks);
    }
  }

  protected readonly faClose = faClose;
}
