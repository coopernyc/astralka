import { RouterModule } from '@angular/router';
import { Component } from "@angular/core";
import {AstralkaChartComponent} from "../chart.component/chart.component";
import {AstralkaLoginComponent} from "../login.component/login.component";
import {AstralkaSignUpComponent} from "../signup.component/signup.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AstralkaChartComponent,
    AstralkaLoginComponent,
    AstralkaSignUpComponent,
    RouterModule
  ],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: [`
    :host {
      flex: 1;
      display: flex;
    }
  `]
})
export class AppComponent {
}
