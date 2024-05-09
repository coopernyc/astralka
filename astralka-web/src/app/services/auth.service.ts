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

  logout(username: string): Observable<any> {
    return this.http.post(
      this.rest.serverUrl + '/signout', { username }, httpOptions
    );
  }

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
