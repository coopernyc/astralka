import {Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  /**
   * Stores a value in local storage under a given key.
   *
   * @param {string} key - The key to store the value under.
   * @param {any} value - The value to store.
   *
   * @throws {Error} If the value is undefined.
   */
  public store(key: string, value: any): void {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      throw new Error('value should be defined');
    }
  }

  /**
   * Retrieves a value from local storage by key.
   *
   * @param {string} key - The key of the value to retrieve.
   *
   * @returns {any} The retrieved value, or null if not found.
   */
  restore(key: string): any {
    const v = localStorage.getItem(key);
    if (v) {
      return JSON.parse(v);
    }
    return null;
  }

  /**
   * Clears all items from local storage.
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * Removes an item from local storage by key.
   *
   * @param {string} key - The key of the item to remove.
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

}
