import { RouterModule } from '@angular/router';
import { Component } from "@angular/core";
import {AstralkaComponent} from "../astralka.main.component/astralka.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AstralkaComponent,
    RouterModule
  ],
  template: `
    <main>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {
}
