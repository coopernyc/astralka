import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from "@angular/core";
import {IPersonInfo, PersonScope, UserRole} from "../../common";
import {SessionStorageService} from "../../services/session.storage.service";
import _ from "lodash";
import moment from "moment";
import {RestService} from "../../services/rest.service";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {faSave, faTrash} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'astralka-person',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule],
  template: `
    <div class="person-container">
      <form
        #frm="ngForm"
        class="entry-form"
        name="person"
        novalidate
        (ngSubmit)="frm.form.valid && onSave()"
      >
        <div class="entry-body">
          <div class="entry-group">
            <label>
              Person's Name
              @if (name.errors) {
                @if (name.errors['required']) {
                  <span> - required</span>
                }
                @if (name.errors['minlength']) {
                  <span> - at least 1 characters</span>
                }
                @if (name.errors['maxlength']) {
                  <span> - at most 100 characters</span>
                }
              }
            </label>
            <input
              style="width: 200px;"
              type="text"
              name="name"
              [(ngModel)]="entry.name"
              required
              minlength="1"
              maxlength="100"
              #name="ngModel"
              [ngClass]="{invalid: name.errors}"
            />
          </div>
          <div class="entry-group">
            <label>
              Description (Optional)
              @if (description.errors) {
                @if (description.errors['maxlength']) {
                  <span> - at most 250 characters</span>
                }
              }
            </label>
            <input
              style="width: 300px;"
              type="text"
              name="description"
              [(ngModel)]="entry.description"
              maxlength="250"
              #description="ngModel"
              [ngClass]="{invalid: name.errors}"
            />
          </div>
          <div class="entry-group">
            <label>Gender</label>
            <select
              name="gender"
              [(ngModel)]="entry.gender"
              #gender="ngModel"
            >
              @for (opt of [{value: 0, display: 'Female'}, {value: 1, display: 'Male'}]; track opt.value) {
                <option [value]="opt.value" [selected]="opt.value === entry.gender">{{ opt.display }}</option>
              }
            </select>
          </div>
          <div class="entry-group">
            <label>
              Location Name
              @if (locationName.errors) {
                @if (locationName.errors['required']) {
                  <span> - required</span>
                }
                @if (locationName.errors['minlength']) {
                  <span> - at least 1 characters</span>
                }
                @if (locationName.errors['maxlength']) {
                  <span> - at most 100 characters</span>
                }
              }
            </label>
            <input
              style="width: 200px;"
              type="text"
              name="locationName"
              [(ngModel)]="entry.locationName"
              required
              minlength="1"
              maxlength="100"
              #locationName="ngModel"
              [ngClass]="{invalid: locationName.errors}"
            />
          </div>
          <div class="entry-group">
            <label>
              Latitude &deg;
              @if (latitude.errors) {
                @if (latitude.errors['required']) {
                  <span> - required</span>
                }
                @if (latitude.errors['min']) {
                  <span> - &gt;= than -90</span>
                }
                @if (latitude.errors['max']) {
                  <span> - &lt;= than 90</span>
                }
              }
            </label>
            <input
              style="width: 120px;"
              type="number"
              name="latitude"
              [(ngModel)]="entry.latitude"
              required
              min="-90"
              max="90"
              #latitude="ngModel"
              [ngClass]="{invalid: latitude.errors}"
            />
          </div>
          <div class="entry-group">
            <label>
              Longitude &deg;
              @if (longitude.errors) {
                @if (longitude.errors['required']) {
                  <span> - required</span>
                }
                @if (longitude.errors['min']) {
                  <span> - &gt;= than -180</span>
                }
                @if (longitude.errors['max']) {
                  <span> - &lt;= than 180</span>
                }
              }
            </label>
            <input
              style="width: 120px;"
              type="number"
              name="longitude"
              [(ngModel)]="entry.longitude"
              required
              min="-180"
              max="180"
              #longitude="ngModel"
              [ngClass]="{invalid: longitude.errors}"
            />
          </div>
          <div class="entry-group">
            <label>
              Elevation (m)
              @if (elevation.errors) {
                @if (elevation.errors['required']) {
                  <span> - required</span>
                }
                @if (elevation.errors['min']) {
                  <span> - &gt;= than 0</span>
                }
                @if (elevation.errors['max']) {
                  <span> - &lt;= than 12000</span>
                }
              }
            </label>
            <input
              style="width: 120px;"
              type="number"
              name="elevation"
              [(ngModel)]="entry.elevation"
              required
              min="0"
              max="1200"
              #elevation="ngModel"
              [ngClass]="{invalid: elevation.errors}"
            />
          </div>
          <div class="entry-group">
            <label>
              DateTime (local)
              @if (dob.errors) {
                @if (dob.errors['required']) {
                  <span> - required</span>
                }
              }
            </label>
            <input
              type="datetime-local"
              name="dob"
              [(ngModel)]="entry.dob"
              required
              #dob="ngModel"
              [ngClass]="{invalid: dob.errors}"
            />
          </div>
          <div class="entry-group">
            <label>
              Offset from UTC (h)
              @if (timezone.errors) {
                @if (timezone.errors['required']) {
                  <span> - required</span>
                }
                @if (timezone.errors['min']) {
                  <span> - &gt;= than -12</span>
                }
                @if (timezone.errors['max']) {
                  <span> - &lt;= than 14</span>
                }
              }
            </label>
            <input
              style="width: 120px;"
              type="number"
              name="timezone"
              [(ngModel)]="entry.timezone"
              required
              min="-12"
              max="14"
              #timezone="ngModel"
              [ngClass]="{invalid: elevation.errors}"
            />
          </div>
          @if (hasUserRole(UserRole.Admin)) {
            <div class="entry-group">
              <label>Scope</label>
              <select
                [(ngModel)]="entry.scope"
                name="scope"
                #scope="ngModel"
              >
                @for (opt of [{value: 1, display: 'Private'}, {value: 0, display: 'Public'}]; track opt.value) {
                  <option [value]="opt.value" [selected]="opt.value === entry.scope">{{ opt.display }}</option>
                }
              </select>
            </div>
          }
        </div>
        <div class="entry-footer">
          <button
            type="submit"
            [disabled]="!frm.form.valid"
          >
            <fa-icon [icon]="faSave"></fa-icon>
            Save
          </button>
          <button
            type="button"
            [disabled]="!frm.form.valid || (entry.scope===PersonScope.Public && !hasUserRole(UserRole.Admin))"
            (click)="onRemove()"
          >
            <fa-icon [icon]="faTrash"></fa-icon>
            Delete
          </button>
          <button
            type="button"
            (click)="onRevert()"
            [disabled]="_.isEmpty(originalEntry.name)"
          >
            Revert
          </button>
          <button
            type="button"
            (click)="onClear()"
          >
            Clear
          </button>
        </div>
      </form>
    </div>
  `,
  styleUrl: 'person.component.scss'
})
export class AstralkaPersonComponent implements OnChanges {

  @Input()
  public entry: any;

  @Output() clear: EventEmitter<void> = new EventEmitter<void>();
  @Output() deleted: EventEmitter<void> = new EventEmitter<void>();
  @Output() saved: EventEmitter<any> = new EventEmitter<any>();

  public failed: boolean = false;
  public failedMessage: string = '';

  public originalEntry: any;

  /**
   * Constructs an instance of the class with provided services.
   *
   * @param {SessionStorageService} session - Instance of SessionStorageService to manage session storage.
   * @param {RestService} rest - Instance of RestService to make RESTful API calls.
   */
  constructor(
    private session: SessionStorageService,
    private rest: RestService
  ) {
  }

  /**
   * Handles changes by comparing current and previous value of the 'entry' property.
   * Updates internal state with the current value and makes a deep copy as the original.
   *
   * @param {SimpleChanges} changes - Object containing the current and previous values of the changed properties.
   * @return {void} This method does not return a value.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['entry']) {
      this.entry = changes['entry'].currentValue;
      this.originalEntry = _.cloneDeep(this.entry);
    }
  }

  /**
   * Saves the current entry of person information by formatting the data and sending it to the backend service.
   * If the user has admin role, sets the scope accordingly; otherwise, sets it to private.
   * Upon success, emits the saved person object; upon failure, logs the error and sets an error message.
   *
   * @return {void}
   */
  public onSave(): void {
    const person: IPersonInfo = {
      name: this.entry.name,
      description: this.entry.description,
      date: moment(this.entry.dob).format("YYYY-MM-DD HH:mm:ss"),
      timezone: this.entry.timezone,
      dateUT: moment.utc(this.entry.dob).add(-this.entry.timezone, 'hours').format("YYYY-MM-DD HH:mm:ss"),
      location: {
        latitude: this.entry.latitude,
        longitude: this.entry.longitude,
        elevation: this.entry.elevation,
        name: this.entry.locationName
      },
      gender: _.toNumber(this.entry.gender),
      scope: this.hasUserRole(UserRole.Admin) ? _.toNumber(this.entry.scope) : PersonScope.Private
    };
    this.rest.save(person, this.username)
      .subscribe({
        next: (data: any) => {
          this.failed = false;
          this.saved.emit(person);
        },
        error: (err: any) => {
          console.log(err);
          this.failedMessage = 'Error! ' + _.isString(err.error) ? err.error : err.message ?? 'Cannot create account.';
          this.failed = true;
        }
      })
  }
  /**
   * Initiates the removal process for an entry and handles the response.
   *
   * Constructs a deletion object with the name and scope of the current entry,
   * and sends a removal request via the REST service using the provided username.
   *
   * Subscribes to the resulting observable to handle success and error responses.
   * On success, sets the `failed` flag to false and emits the `deleted` event.
   * On error, logs the error, sets the `failed` flag to true, and updates the `failedMessage`.
   *
   * @return {void} No return value.
   */
  public onRemove(): void {
    const del = {
      name: this.entry.name,
      scope: this.entry.scope
    };
    this.rest.remove(del, this.username)
      .subscribe({
        next: (data: any) => {
          this.failed = false;
          this.deleted.emit();
        },
        error: (err: any) => {
          console.log(err);
          this.failed = true;
          this.failedMessage = 'Error! ' + _.isString(err.error) ? err.error : err.message ?? 'Cannot create account.';
        }
      });
  }
  /**
   * Notifies listeners that the clear event has been triggered.
   *
   * @return {void} This method does not return a value.
   */
  public onClear(): void {
    this.clear.emit();
  }
  /**
   * Reverts the current entry to its original state.
   *
   * @return {void} This method does not return a value.
   */
  public onRevert(): void {
    this.entry = this.originalEntry;
  }
  /**
   * Checks if the currently restored user has the specified role.
   *
   * @param {string} role - The role to check against the user's roles.
   * @return {boolean} Returns true if the user has the specified role; otherwise, false.
   */
  public hasUserRole(role: string): boolean {
    const user = this.session.restoreUser();
    return user && _.includes(user.roles, role);
  }
  /**
   * Retrieves the username of the currently authenticated user from the session.
   *
   * @return {string} The username of the current user.
   */
  public get username(): string {
    const user = this.session.restoreUser();
    return user.username;
  }

  protected readonly PersonScope = PersonScope;
  protected readonly UserRole = UserRole;
  protected readonly faSave = faSave;
  protected readonly faTrash = faTrash;
  protected readonly _ = _;
}
