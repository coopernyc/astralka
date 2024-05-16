import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faClose} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'astralka-quick-pick',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  template: `
    @if (picks.length) {
      <div class="quick-pick-container">
        @for (qp of picks; track qp.qp_id) {
          <div class="quick-pick">
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
  protected readonly faClose = faClose;
}
