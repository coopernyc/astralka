import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, map, of, switchMap } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RestService {

    private serverUrl: string = "";

    public explain$: Subject<any> = new Subject<any>();

    constructor(private http: HttpClient) {
        this.http.get("config.json").subscribe((data:any) => {
            this.serverUrl = data.server;
          });
    }

    public natal_data(query: string): Observable<any> {
        const obs = this.http.get(`${this.serverUrl}/natal?${query}`);
        return obs ? obs.pipe(            
            catchError(err => {
                console.log(err);
                return of(null);
            })
        ) : of(null);
    }


    public do_explain(load: any): void {
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
}