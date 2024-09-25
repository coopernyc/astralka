import {Component, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {Router} from "@angular/router";
import {AstralkaAuthService} from "../../services/auth.service";
import {SessionStorageService} from "../../services/session.storage.service";
import {FormsModule} from "@angular/forms";
import _ from "lodash";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'astralka-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="login-container">
        <div class="login-wrapper">
            <div style="flex: 1; position: relative;">
              @if (failed) {
                <div class="error-panel">
                    <span>{{failedMessage}}</span>
                </div>
              }
              <div class="login-panel" style="">
                <form
                    #frm="ngForm"
                    name="form"
                    novalidate
                    (ngSubmit)="frm.form.valid && onSubmit()"
                >
                  <div class="form-group">
                    <label>
                      Username
                      @if (username.errors && frm.submitted) {
                        <span> - required</span>
                      }
                    </label>
                    <input
                      type="text"
                      name="username"
                      [(ngModel)]="form.username"
                      required
                      #username="ngModel"
                      [ngClass]="{ 'invalid': frm.submitted && username.errors }"
                    />

                  </div>
                  <div class="form-group">
                    <label>
                      Password
                      @if (password.errors && frm.submitted) {
                        @if (password.errors['required']) {
                          <span> - is required</span>
                        }
                        @if (password.errors['minlength']) {
                          <span> - at least 6 characters</span>
                        }
                      }
                    </label>
                    <input
                      type="password"
                      name="password"
                      [(ngModel)]="form.password"
                      required
                      minlength="6"
                      #password="ngModel"
                      [ngClass]="{ 'invalid': frm.submitted && password.errors }"
                    />
                  </div>
                  <div class="form-group footer">
                    <button type="submit">Sign In</button>
                    <button type="button" [disabled]="environment.production" (click)="goToSignUp()">Sign Up</button>
                  </div>
                </form>
              </div>
            </div>
        </div>
    </div>
  `,
  styleUrl: 'login.component.scss'
})
export class AstralkaLoginComponent implements OnInit {

  public form: any = {
    username: null,
    password: null
  };

  public failed: boolean = false;
  public failedMessage: string = '';

  /**
   * Creates an instance of the class.
   *
   * @param {Router} router - The router instance for navigating between routes.
   * @param {AstralkaAuthService} auth - The authentication service for user login and session management.
   * @param {SessionStorageService} session - The session storage service for managing session data.
   * @return {void}
   */
  constructor(
    private router: Router,
    private auth: AstralkaAuthService,
    private session: SessionStorageService
  ) {
  }

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   * It checks if the user is logged in, and if so, navigates to the 'astralka' route.
   *
   * @returns {void}
   */
  public ngOnInit(): void {
    if (this.session.isLoggedIn()) {
      this.router.navigate(['astralka']).then();
    }
  }

  /**
   * Submits the login form and handles the authentication process.
   * It sends the username and password to the authentication service.
   * Upon successful authentication, it stores the user data in the session
   * and navigates to the Astralka page. In case of failure, it sets an error message.
   *
   * @return {void} This method does not return a value.
   */
  public onSubmit(): void {
    const { username, password } = this.form;
    this.auth.login(username, password)
      .subscribe({
        next: async (data: any) => {
          if (data && data.authorized) {
            this.session.storeUser(data.user);
            await this.goToAstralka();
          } else {
            this.failedMessage = 'Error! Not authorized';
            this.failed = true;
          }
        },
        error: (err: any) => {
          this.failedMessage = 'Error! ' + _.isString(err.error) ? err.error : err.message ?? 'Cannot sign in.';
          this.failed = true;
        }
      });
  }

  /**
   * Navigates the router to the 'astralka' route asynchronously.
   *
   * @return {Promise<void>} A promise that resolves once the navigation is complete.
   */
  private async goToAstralka(): Promise<void> {
    await this.router.navigate(['astralka']);
  }

  /**
   * Navigates the user to the sign-up page.
   *
   * @return {Promise<void>} A promise that resolves when the navigation is complete.
   */
  public async goToSignUp(): Promise<void> {
    await this.router.navigate(['signup']);
  }

  protected readonly environment = environment;
}
