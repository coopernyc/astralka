import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  store(key: string, value: any): void {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      throw new Error('value should be defined');
    }
  }

  restore(key: string): any {
    const v = localStorage.getItem(key);
    if (v) {
      return JSON.parse(v);
    }
    return null;
  }

  clear(): void {
    localStorage.clear();
  }

  remove(key: string): void {
    localStorage.removeItem(key);
  }

}
