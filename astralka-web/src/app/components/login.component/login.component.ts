import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'astralka-login',
  standalone: true,
  imports: [
    CommonModule
  ],
  template: `
    <div class="login-container">
        <div class="login-wrapper">
            <div style="flex: 1"></div>
            <div class="login-footer">
              <button (click)="goToAstralka()">Go To Astralka</button>
            </div>
        </div>
    </div>
  `,
  styleUrl: 'login.component.scss'
})
export class AstralkaLoginComponent {

  constructor(private router: Router) {
  }

  public async goToAstralka(): Promise<void> {
    await this.router.navigate(['astralka']);
  }
}
