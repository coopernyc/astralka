import {HttpClient} from "@angular/common/http";
import {Injectable, OnDestroy} from "@angular/core";
import {catchError, map, Observable, of, ReplaySubject, Subject, switchMap} from "rxjs";
import {IPersonInfo} from "../common";
import _ from "lodash";
// @ts-ignore
import config from "assets/config.json";

/**
 * @description
 * This service handles all the communication with the backend server for operations
 * related to house systems, chart data, explanation functionality, database population,
 * entry saving and removal, and management of quick-pick lists.
 */
@Injectable({
  providedIn: 'root'
})
export class RestService implements OnDestroy {

  public serverUrl: string = "";

  public explain$: Subject<any> = new Subject<any>();
  public ready$: ReplaySubject<void> = new ReplaySubject<void>(1);

  constructor(private http: HttpClient) {
    this.serverUrl = config.server;
  }

  ngOnDestroy(): void {
    this.explain$.complete();
    this.ready$.complete();
  }

  /**
   * Retrieves the house systems from the server.
   *
   * @return {Observable<any>} An observable that emits the house systems data or null in case of an error.
   */
  public house_systems(): Observable<any> {
    const obs = this.http.get(`${this.serverUrl}/hsys`);
    return obs ? obs.pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

  /**
   * Sends a POST request to retrieve chart data based on the provided load.
   *
   * @param {any} load - The data payload to be sent with the POST request.
   * @return {Observable<any>} - An observable containing the chart data or null in case of an error.
   */
  public chart_data(load: any): Observable<any> {
    const obs = this.http.post(`${this.serverUrl}/chart-data`, load);
    return obs ? obs.pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

  /**
   * Initiates an explanation process by sending a POST request to the server with the provided load.
   * Updates the explanation state with the result or an error if it occurs.
   *
   * @param {Object} load - The load object containing context and prompt data.
   * @return {void} No return value.
   */
  public do_explain(load: any): void {
    console.log(load);
    this.explain$.next({ result: 'LOADING!', context: load.context});
    const obs = this.http.post(`${this.serverUrl}/explain`, {prompt: load.prompt});
    obs.pipe(
      switchMap((x: any) => of(x.result)),
      catchError(err => {
        console.log(err);
        return of(`ERROR! ${err.message}`);
      })
    ).subscribe(x => this.explain$.next({result: x, params: load}));
  }

  /**
   * Sends the given prompt to the server for explanation and returns an observable that emits the result.
   *
   * @param {any} prompt - The prompt data to be sent to the server.
   * @return {Observable<any>} An observable that emits the result of the explanation or an error message upon failure.
   */
  public explain(prompt: any): Observable<any> {
    const obs = this.http.post(`${this.serverUrl}/explain`, prompt);
    return obs ? obs.pipe(
      map((x: any) => x.result),
      catchError(err => {
        console.log(err);
        return of(`ERROR! ${err.message}`);
      })
    ) : of(null);
  }

  /**
   * Sends a request to populate the database with the given username.
   *
   * @param {string} username - The username to be used for populating the database.
   * @return {Observable<any>} - An observable that emits the result of the population request.
   */
  public populate_db(username: string): Observable<any> {
    const obs = this.http.post(`${this.serverUrl}/populate`, { username });
    return obs ? obs.pipe(
      map((x: any) => x.result),
      catchError(err => {
        console.log(err);
        return of(`ERROR! ${err.message}`);
      })
    ) : of(null);
  }

  /**
   * Saves an entry to the server with the specified username.
   *
   * @param {any} entry - The entry data to be saved.
   * @param {string} username - The username associated with the entry.
   * @return {Observable<any>} - An Observable that emits the result of the save operation.
   */
  public save(entry: any, username: string): Observable<any> {
    const load = _.assign({}, entry, {username});
    const obs = this.http.post(`${this.serverUrl}/save`, load);
    return obs ? obs.pipe(
      map((x: any) => x.result),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

  /**
   * Re-saves the provided list of IDs to a quick pick using the specified username.
   *
   * @param {string[]} ids - An array of ID strings to be re-saved.
   * @param {string} username - The username associated with the re-save operation.
   * @return {Observable<any>} An observable that emits the result of the HTTP POST request.
   */
  public reSaveToQuickPick(ids: string[], username: string): Observable<any> {
    const obs = this.http.post(`${this.serverUrl}/resave-qp`, {ids, username});
    return obs ? obs.pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

  /**
   * Saves the provided ID and username to QuickPick.
   *
   * @param {string} id - The ID to save.
   * @param {string} username - The username associated with the ID.
   * @return {Observable<any>} An observable that emits the server's response or null in case of an error.
   */
  public saveToQuickPick(id: string, username: string): Observable<any> {
    const obs = this.http.post(`${this.serverUrl}/save-to-qp`, {id, username});
    return obs ? obs.pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

  /**
   * Removes an item from the QuickPick list based on provided id and username.
   *
   * @param {string} id - The unique identifier of the item to be removed.
   * @param {string} username - The username associated with the item to be removed.
   * @return {Observable<any>} - An observable that completes with the result of the operation.
   */
  public removeFromQuickPick(id: string, username: string): Observable<any> {
    const obs = this.http.post(`${this.serverUrl}/remove-from-qp`, {id, username});
    return obs ? obs.pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

  /**
   * Retrieves a quick pick list for a given user.
   *
   * @param {string} username - The username for whom the quick pick list is to be fetched.
   * @return {Observable<any>} An observable that emits the quick pick list, or null in case of an error.
   */
  public getQuickPickList(username: string): Observable<any> {
    const obs = this.http.post(`${this.serverUrl}/qp-list`, {username});
    return obs ? obs.pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

  /**
   * Removes an entry from the server based on the provided data and username.
   *
   * @param entry The data entry to be removed.
   * @param username The username of the person requesting the removal.
   * @return An Observable that emits the result of the removal operation or null in case of an error.
   */
  public remove(entry: any, username: string): Observable<any> {
    const load = _.assign({}, entry, {username});
    const obs = this.http.post(`${this.serverUrl}/remove`, load);
    return obs ? obs.pipe(
      map((x: any) => x.result),
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

  /**
   * Searches for a person based on the provided name and username.
   *
   * @param {string} name - The name of the person to search for.
   * @param {string} username - The username of the person to search for.
   * @param {boolean} withRefresh - Indicates whether to refresh the data from the server.
   * @return {Observable<IPersonInfo[]>} An observable containing an array of person information.
   */
  public searchPerson(name: string, username: string, withRefresh: boolean): Observable<IPersonInfo[]> {
    const load = _.assign({}, {name}, {username});
    return this.http.post<IPersonInfo[]>(`${this.serverUrl}/people`, load);
  }
}
