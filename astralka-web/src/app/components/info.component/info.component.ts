import {Component, Input} from "@angular/core";
import {CommonModule} from "@angular/common";
import {age, convert_lat_to_DMS, convert_long_to_DMS, Gender} from "../../common";
import moment from "moment-timezone";
import {AstralkaAspectMatrixComponent} from "../../controls/matrix/matrix";
import {AstralkaPositionDataComponent} from "../../controls/position.data/position.data";

@Component({
  selector: 'astralka-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="info-container">
      <ng-content></ng-content>
    </div>
  `
})
export class AstralkaInfoComponent {
}

@Component({
  selector: 'astralka-natal-info',
  standalone: true,
  imports: [CommonModule, AstralkaInfoComponent, AstralkaAspectMatrixComponent, AstralkaPositionDataComponent],
  template: `
    <astralka-info>
      <div><b>Natal Data</b></div>
      <div>Name: {{ person.name }}</div>
      <div>Loc: {{ person.location.name }}</div>
      <div>Lat: {{ convert_lat_to_DMS(person.location.latitude) }}
        , {{ person.location.latitude }}°{{ person.location.latitude >= 0 ? 'N' : 'S' }}
      </div>
      <div>Long: {{ convert_long_to_DMS(person.location.longitude) }}
        , {{ person.location.longitude }}°{{ person.location.longitude >= 0 ? 'E' : 'W' }}
      </div>
      <div>Offset from UTC: {{ person.timezone }}hours,
        Elevation: {{ person.location.elevation }}m
      </div>
      <div>DOB: {{ moment(person.date).format('DD MMM YYYY, hh:mm a') }}</div>
      <div>Age: {{ age(this.person.date) }}, Gender: {{ person.gender === Gender.Male ? 'Male' : 'Female' }}</div>
      <div>House System: {{ houseSystem }}</div>
      <div>{{ chartType ? "Day Chart" : "Night Chart" }}, Score: {{ score.toFixed(3) }}</div>
    </astralka-info>
  `
})
export class AstralkaNatalInfoComponent {
  @Input() person: any;
  @Input() houseSystem: any;
  @Input() chartType: boolean = false;
  @Input() score: number = 0;

  protected readonly Gender = Gender;
  protected readonly convert_lat_to_DMS = convert_lat_to_DMS;
  protected readonly moment = moment;
  protected readonly convert_long_to_DMS = convert_long_to_DMS;
  protected readonly age = age;
}
