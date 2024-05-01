import {Injectable} from "@angular/core";
import {SYMBOL_ASPECT, SYMBOL_PLANET} from "../common";
import _ from "lodash";
import {LocalStorageService} from "./local.storage.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  public settings_change$: Subject<void> = new Subject<void>();

  private readonly _aspect_settings: Map<string, any> = new Map();
  private readonly _transit_settings: Map<string, any> = new Map();

  constructor(
    private storage: LocalStorageService
  ) {
    // const aset: any[] = this.storage.restore("aspect-settings") as any[];
    // if (aset) {
    //   _.reduce(aset, (acc, v) => {
    //     acc.set(v.name, v);
    //     return acc;
    //   }, this._aspect_settings);
    // } else {
    //   _.reduce(SYMBOL_ASPECT, (acc, v) => {
    //     acc.set(v, {name: v, enabled: true});
    //     return acc;
    //   }, this._aspect_settings);
    //   this.storage.store("aspect-settings", Array.from(this._aspect_settings.values()));
    // }
    this.init_map_settings("aspect-settings", this._aspect_settings);
    this.init_map_settings("transit-settings", this._transit_settings);
  }

  private init_map_settings(name: string, map: Map<string, any>) {
    const s: any[] = this.storage.restore(name) as any[];
    if (s && s.length) {
      _.reduce(s, (acc, v) => {
        acc.set(v.name, v);
        return acc;
      }, map);
    } else {
      let o!: any;
      switch (name) {
        case 'aspect-settings':
          o = _.values(SYMBOL_ASPECT);
          break;
        case 'transit-settings':
          o = _.reject(_.values(SYMBOL_PLANET), x => _.includes([
            SYMBOL_PLANET.ParsFortuna, SYMBOL_PLANET.NorthNode, SYMBOL_PLANET.SouthNode
          ], x));
          break;
      }
      _.reduce(o, (acc, v) => {
        acc.set(v, {name: v, enabled: true});
        return acc;
      }, map);
      this.storage.store(name, Array.from(map.values()));
    }
  }

  public get aspect_settings_iter(): IterableIterator<any> {
    return this._aspect_settings.values();
  }
  public get aspect_settings(): Map<string, any> {
    return this._aspect_settings;
  }

  public get transit_settings_iter(): IterableIterator<any> {
    return this._transit_settings.values();
  }
  public get transit_settings(): Map<string, any> {
    return this._transit_settings;
  }

  public update_map_settings(name: string, value: any) {
    let map!: Map<string, any>;
    switch (name) {
      case "aspect-settings":
        map = this._aspect_settings;
        break;
      case "transit-settings":
        map = this._transit_settings;
        break;
    }
    map.set(value.name, value);
    this.storage.store(name, Array.from(map.values()));
    this.settings_change$.next();
  }

}
