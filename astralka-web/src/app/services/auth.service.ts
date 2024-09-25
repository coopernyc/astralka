import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {RestService} from "./rest.service";

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class AstralkaAuthService {
  constructor(private rest: RestService, private http: HttpClient) {
  }

  /**
   * Attempts to log in a user with the provided credentials.
   *
   * @param {string} username - The username of the user trying to log in.
   * @param {string} password - The user's password for authentication.
   *
   * @returns {Observable<any>} An Observable containing the server response after processing the login attempt.
   *  - The structure of the response data may vary depending on the server implementation.
   *  - A successful response might include an authentication token or user information.
   */
   login(username: string, password: string): Observable<any> {
    return this.http.post(
      this.rest.serverUrl + '/signin',
      {
        username,
        password
      },
      httpOptions
    );
  }

  /**
   * Logs out the user from the application.
   *
   * @param {string} username - The username of the user to be logged out.
   *
   * @returns {Observable<any>} An Observable containing the server response after processing the logout request.
   *  - The structure of the response data may vary depending on the server implementation.
   */
  logout(username: string): Observable<any> {
    return this.http.post(
      this.rest.serverUrl + '/signout', { username }, httpOptions
    );
  }

  /**
   * Creates a new user account.
   *
   * @param {string} username - The unique username for the new account.
   * @param {string} email - The user's email address.
   * @param {string} password - The user-defined password for authentication.
   * @param {string} firstname - The user's first name.
   * @param {string} lastname - The user's last name.
   *
   * @returns {Observable<any>} An Observable containing the server response after processing the account creation request.
   *  - The structure of the response data may vary depending on the server implementation.
   */
  create_account(username: string, email: string, password: string, firstname: string, lastname: string) : Observable<any> {
    return this.http.post(
      this.rest.serverUrl + '/signup',
      {
        username,
        email,
        password,
        firstname,
        lastname
      },
      httpOptions
    );
  }
}
