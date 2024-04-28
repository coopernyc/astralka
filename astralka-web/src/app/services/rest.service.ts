import { HttpClient, HttpEvent, HttpHandler, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { Observable, ReplaySubject, Subject, catchError, map, of, switchMap, tap } from "rxjs";
import { IPersonInfo } from "../common";

@Injectable({
    providedIn: 'root'
})
export class RestService implements OnDestroy {

    private serverUrl: string = "";

    public explain$: Subject<any> = new Subject<any>();
    public ready$: ReplaySubject<void> = new ReplaySubject<void>(1);


    constructor(private http: HttpClient) {
        this.http.get("config.json").subscribe((data:any) => {
            this.serverUrl = data.server;
            this.ready$.next();
          });
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

    // public natal_data(query: string): Observable<any> {
    //     const obs = this.http.get(`${this.serverUrl}/natal?${query}`);
    //     return obs ? obs.pipe(            
    //         catchError(err => {
    //             console.log(err);
    //             return of(null);
    //         })
    //     ) : of(null);
    // }

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
        this.explain$.next({ result: '... processing ...' });
        const obs = this.http.post(`${this.serverUrl}/explain`, {prompt: load.prompt});
        obs.pipe( 
            switchMap((x: any) => of(x.result)),          
            catchError(err => {
                console.log(err);
                return of(null);
            })
        ).subscribe(x => this.explain$.next({result: x, params: load.params}));
    }

    public explain(prompt: any): Observable<any> {        
        const obs = this.http.post(`${this.serverUrl}/explain`, prompt);
        return obs ? obs.pipe(
            map((x: any) => x.result),
            catchError(err => {
                console.log(err);
                return of(null);
            })
        ) : of(null);
    }

    public save(entry: any): Observable<any> {        
        const obs = this.http.post(`${this.serverUrl}/save`, entry);
        return obs ? obs.pipe(
            map((x: any) => x.result),
            catchError(err => {
                console.log(err);
                return of(null);
            })
        ) : of(null);
    }


    public searchPerson(name: string, withRefresh: boolean): Observable<IPersonInfo[]> {
        return this.http.post<IPersonInfo[]>(`${this.serverUrl}/people`, { name });        
    }
}