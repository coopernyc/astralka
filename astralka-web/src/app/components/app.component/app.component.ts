import { RouterModule } from '@angular/router';
import { Component } from "@angular/core";
import {AstralkaComponent} from "../astralka.main.component/astralka.component";
import {AstralkaLoginComponent} from "../login.component/login.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AstralkaComponent,
    AstralkaLoginComponent,
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
