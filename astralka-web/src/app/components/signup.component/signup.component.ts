import {Component} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router} from "@angular/router";
import {AstralkaAuthService} from "../../services/auth.service";
import _ from "lodash";

@Component({
  selector: 'astralka-signup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  template: `
    <div class="signup-container">
      <div class="signup-wrapper">
        <div class="wrapper-content">
          <div class="content-header">
            <h3>Welcome to Astralka!</h3>
            @if (!isSuccessful) {
              <p>Fill out the form below to create Astralka account</p>
            }
          </div>
          @if (!isSuccessful) {
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
                    @if (username.errors['required']) {
                      <span> - required</span>
                    }
                    @if (username.errors['minlength']) {
                      <span> - at least 3 characters</span>
                    }
                    @if (username.errors['maxlength']) {
                      <span> - at most 20 characters</span>
                    }
                  }
                </label>
                <input
                  style="width: 160px"
                  type="text"
                  name="username"
                  [(ngModel)]="form.username"
                  required
                  minlength="3"
                  maxlength="20"
                  #username="ngModel"
                  [ngClass]="{ 'invalid': frm.submitted && username.errors }"
                />
              </div>
              <div class="form-group">
                <label>
                  Email
                  @if (email.errors && frm.submitted) {
                    @if (email.errors['required']) {
                      <span> - required</span>
                    }
                    @if (email.errors['email']) {
                      <span> - not valid email</span>
                    }
                  }
                </label>
                <input
                  style="width: 280px"
                  type="text"
                  name="email"
                  [(ngModel)]="form.email"
                  required
                  email
                  #email="ngModel"
                  [ngClass]="{ 'invalid': frm.submitted && email.errors }"
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
              <div class="form-group">
                <label>
                  First Name
                  @if (firstname.errors && frm.submitted) {
                    @if (firstname.errors['required']) {
                      <span> - required</span>
                    }
                    @if (firstname.errors['minlength']) {
                      <span> - at least 1 characters</span>
                    }
                    @if (firstname.errors['maxlength']) {
                      <span> - at most 50 characters</span>
                    }
                  }
                </label>
                <input
                  type="text"
                  name="firstname"
                  [(ngModel)]="form.firstname"
                  required
                  minlength="1"
                  maxlength="50"
                  #firstname="ngModel"
                  [ngClass]="{ 'invalid': frm.submitted && firstname.errors }"
                />
              </div>
              <div class="form-group">
                <label>
                  Last Name
                  @if (lastname.errors && frm.submitted) {
                    @if (lastname.errors['required']) {
                      <span> - required</span>
                    }
                    @if (lastname.errors['minlength']) {
                      <span> - at least 1 characters</span>
                    }
                    @if (lastname.errors['maxlength']) {
                      <span> - at most 20 characters</span>
                    }
                  }
                </label>
                <input
                  type="text"
                  name="lastname"
                  [(ngModel)]="form.lastname"
                  required
                  minlength="1"
                  maxlength="50"
                  #lastname="ngModel"
                  [ngClass]="{ 'invalid': frm.submitted && lastname.errors }"
                />
              </div>
              <div class="failed">
                @if (frm.submitted && failed) {
                  {{ failedMessage }}
                }
              </div>
              <div class="form-group footer">
                <button type="submit">Create Account</button>
                <!--              <button type="button" (click)="goToSignUp()">Sign Up</button>-->
                <div class="foot-note">
                  By clicking Create Account you agree with <a href="/assets/astralka_terms_and_conditions.pdf" target="_blank">Terms and Condition</a> of Astralka web site.
                </div>
              </div>
            </form>
          } @else {
            <p>Account created successfully!</p>
            <button (click)="goToLogin()">Go back to Sign In</button>
          }
        </div>
      </div>
    </div>
  `,
  styleUrl: 'signup.component.scss'
})
export class AstralkaSignUpComponent {

  public form: any = {
    username: null,
    email: null,
    password: null,
    firstname: null,
    lastname: null
  };

  public isSuccessful: boolean = false;
  public failed: boolean = false;
  public failedMessage: string = '';

  /**
   * Initializes a new instance of the component with dependencies injected.
   * @param {Router} router - The router service for navigation.
   * @param {AstralkaAuthService} auth - The authentication service.
   */
  constructor(
    private router: Router,
    private auth: AstralkaAuthService
  ) {
  }

  /**
   * Handles the submission of a user registration form. Extracts form data
   * and calls the `create_account` method of the `auth` service to create
   * a new user account. Sets the status flags based on the success or failure
   * of the account creation process.
   *
   * @return {void}
   */
  public onSubmit(): void {
    const { username, password, email, firstname, lastname } = this.form;

    this.auth.create_account(username, email, password, firstname, lastname).subscribe({
      next: data => {
        this.isSuccessful = true;
        this.failed = false;
      },
      error: err => {
        console.log(err);
        this.failedMessage = 'Error! ' + _.isString(err.error) ? err.error : err.message ?? 'Cannot create account.';
        this.failed = true;
      }
    });
  }

  /**
   * Navigates the user to the login page by redirecting to the root path.
   *
   * @return {Promise<void>} A promise that resolves when the navigation is complete.
   */
  public async goToLogin(): Promise<void> {
    await this.router.navigate(['']);
  }
}
