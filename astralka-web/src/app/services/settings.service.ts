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
  private readonly _house_system_settings: Map<string, any> = new Map();

  constructor(
    private storage: LocalStorageService
  ) {
    this.init_map_settings("aspect-settings", this._aspect_settings);
    this.init_map_settings("transit-settings", this._transit_settings);
    this.init_map_settings("house-system-settings", this._house_system_settings);
  }

  private init_map_settings(name: string, map: Map<string, any>) {
    const s: any[] = this.storage.restore(name) as any[];
    if (s && s.length) {
      _.reduce(s, (acc, v) => {
        acc.set(name === 'house-system-settings'? v.id : v.name, v);
        return acc;
      }, map);
    } else {
      let o!: any;
      switch (name) {
        case 'aspect-settings':
          o = _.values(SYMBOL_ASPECT);
          _.reduce(o, (acc, v) => {
            acc.set(v, {name: v, enabled: true});
            return acc;
          }, map);
          break;
        case 'transit-settings':
          o = _.reject(_.values(SYMBOL_PLANET), x => _.includes([
            SYMBOL_PLANET.ParsFortuna, SYMBOL_PLANET.NorthNode, SYMBOL_PLANET.SouthNode
          ], x));
          _.reduce(o, (acc, v) => {
            acc.set(v, {name: v, enabled: true});
            return acc;
          }, map);
          break;
        case 'house-system-settings':
          o = _.reduce([
            {
              "id": "E",
              "name": "Equal (cusp 1 is asc)"
            },
            {
              "id": "B",
              "name": "Alcabitius"
            },
            {
              "id": "C",
              "name": "Campanus"
            },
            {
              "id": "H",
              "name": "Azimuthal"
            },
            {
              "id": "K",
              "name": "Koch"
            },
            {
              "id": "M",
              "name": "Morinus"
            },
            {
              "id": "O",
              "name": "Parphyrius"
            },
            {
              "id": "P",
              "name": "Placidus"
            },
            {
              "id": "R",
              "name": "Regiomontanus"
            },
            {
              "id": "T",
              "name": "Polich/Page"
            },
            {
              "id": "U",
              "name": "Krusinski/Pisa/Goelzer"
            },
            {
              "id": "V",
              "name": "Vehlow Equal"
            },
            {
              "id": "X",
              "name": "Meridian"
            },
            {
              "id": "W",
              "name": "Equal, whole sign"
            }
          ], (acc, v) => {
            const m = {
              id: v.id,
              name: v.name,
              selected: v.id === 'P'
            };
            acc.set(m.id, m);
            return acc;
          }, map);
          break;
      }
      this.storage.store(name, Array.from(map.values()));
    }
  }

  public get aspect_settings_iter(): IterableIterator<any> {
    return this._aspect_settings.values();
  }

  public get transit_settings_iter(): IterableIterator<any> {
    return this._transit_settings.values();
  }

  public get house_system_settings_iter(): IterableIterator<any> {
    return this._house_system_settings.values();
  }

  public get house_system_selected(): any {
    return _.find(Array.from(this.house_system_settings_iter), v => v.selected);
  }

  public update_map_settings(name: string, value: any) {
    let map!: Map<string, any>;
    switch (name) {
      case "aspect-settings":
        map = this._aspect_settings;
        map.set(value.name, value);
        break;
      case "transit-settings":
        map = this._transit_settings;
        map.set(value.name, value);
        break;
      case "house-system-settings":
        map = this._house_system_settings;
        map.forEach((v, k) => {
          v.selected = k === value.id;
        });
        break;
    }

    this.storage.store(name, Array.from(map.values()));
    this.settings_change$.next();
  }

}
