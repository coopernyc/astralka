import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import _ from "lodash";
import {AstralkaSliderControlComponent} from "../../controls/slider/slider";
import moment from "moment";
import {age} from "../../common";

@Component({
  selector: 'astralka-transit',
  standalone: true,
  imports: [CommonModule, FormsModule, AstralkaSliderControlComponent],
  template: `
    <div class="transit-container">
      <form
        class="entry-form"
        name="person"
        novalidate
      >
        <div class="entry-body">
          <div class="entry-group">
            <label>Transit/Progression Date Time</label>
            <input type="datetime-local" [ngModel]="transit.date" (ngModelChange)="transit.date=$event; changed.emit()"
                   name="date">
          </div>
          <div class="entry-group">
            <label style="text-align: center">Interactive <b>{{ valueFmt }} days</b> from
              Transit/Progression Date Time</label>
            <astralka-slider #ref [width]="300" [range]="[-100, 100]" [value]="transit.offset"
                             (valueChange)="transit.offset=$event; changed.emit()"></astralka-slider>
          </div>
        </div>
        <div class="entry-footer">
          <button type="button" (click)="setTransit('now')">Set to Now (Transit)</button>
          <button type="button" [disabled]="!this.person" (click)="setTransit('natal')">Set Day/Year (Progression)</button>
        </div>
      </form>
    </div>
  `,
  styleUrl: 'transit.component.scss'
})
export class AstralkaTransitComponent implements OnChanges {
  @Input() transit: any;
  @Input() person: any;
  @Output() changed: EventEmitter<any> = new EventEmitter<any>();

  public originalTransit: any;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transit']) {
      this.transit = changes['transit'].currentValue;
      this.originalTransit = _.cloneDeep(this.transit);
    }
    if (changes['person']) {
      this.person = changes['person'].currentValue;
    }
  }

  public get valueFmt(): number {
    return !_.isNaN(this.transit.offset) ? this.transit.offset : 0;
  }

  public setTransit(type: 'now' | 'natal'): void {
    switch (type) {
      case 'now':
        if (this.transit) {
          this.transit.date = moment.utc().toISOString().replace('Z', '');
          this.transit.offset = 0;
          this.changed.emit();
        }
        break;
      case 'natal':
        if (this.transit && this.person) {
          this.transit.date = moment(this.person.dateUT).toISOString().replace('Z', '');
          this.transit.offset = age(this.transit.date);
          this.changed.emit();
        }
        break;
    }
  }
}
