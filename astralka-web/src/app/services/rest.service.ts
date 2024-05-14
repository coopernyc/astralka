import {HttpClient} from "@angular/common/http";
import {Injectable, OnDestroy} from "@angular/core";
import {catchError, map, Observable, of, ReplaySubject, Subject, switchMap} from "rxjs";
import {IPersonInfo} from "../common";
import _ from "lodash";
import config from "assets/config.json";

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

  public house_systems(): Observable<any> {
    const obs = this.http.get(`${this.serverUrl}/hsys`);
    return obs ? obs.pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

  public chart_data(load: any): Observable<any> {
    const obs = this.http.post(`${this.serverUrl}/chart-data`, load);
    return obs ? obs.pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

  public do_explain(load: any): void {
    this.explain$.next({ result: 'LOADING!', context: load.context});
    const obs = this.http.post(`${this.serverUrl}/explain`, {prompt: load.prompt});
    obs.pipe(
      switchMap((x: any) => of(x.result)),
      catchError(err => {
        console.log(err);
        return of(`ERROR! ${err.message}`);
      })
    ).subscribe(x => this.explain$.next({result: x, params: load.params}));
  }

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

  public saveToQuickPick(id: string, username: string): Observable<any> {
    const obs = this.http.post(`${this.serverUrl}/save-to-qp`, {id, username});
    return obs ? obs.pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

  public removeFromQuickPick(id: string, username: string): Observable<any> {
    const obs = this.http.post(`${this.serverUrl}/remove-from-qp`, {id, username});
    return obs ? obs.pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

  public getQuickPickList(username: string): Observable<any> {
    const obs = this.http.post(`${this.serverUrl}/qp-list`, {username});
    return obs ? obs.pipe(
      catchError(err => {
        console.log(err);
        return of(null);
      })
    ) : of(null);
  }

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

  public searchPerson(name: string, username: string, withRefresh: boolean): Observable<IPersonInfo[]> {
    const load = _.assign({}, {name}, {username});
    return this.http.post<IPersonInfo[]>(`${this.serverUrl}/people`, load);
  }
}
