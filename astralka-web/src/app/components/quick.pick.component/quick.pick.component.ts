import {Component, EventEmitter, Input, Output} from "@angular/core";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'astralka-quick-pick',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (picks.length) {
      <div class="quick-pick-container">
        @for (qp of picks; track qp.qp_id) {
          <div class="quick-pick">
            <button type="button" (click)="select.next(qp.person)">{{qp.person.name}}</button>
            <button type="button" (click)="remove.next(qp.qp_id)">x</button>
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
}
