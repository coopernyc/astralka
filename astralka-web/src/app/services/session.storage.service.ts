import {Injectable} from "@angular/core";

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {
  constructor() {
  }

  /**
   * Clears all entries in the session storage.
   *
   * @return {void} No return value.
   */
  public clean(): void {
    window.sessionStorage.clear();
  }

  /**
   * Stores the given user data in session storage.
   *
   * @param {any} user - The user object to be stored.
   * @return {void} - No return value.
   */
  public storeUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Restores the user object from the session storage.
   *
   * @return {any} The parsed user object if it exists, otherwise null.
   */
  public restoreUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  /**
   * Checks if the user is currently logged in by verifying if a user key exists in session storage.
   *
   * @return {boolean} Returns true if the user is logged in (i.e., a user key exists in session storage), otherwise returns false.
   */
  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    return !!user;
  }
}
