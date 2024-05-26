import {Pipe, PipeTransform} from "@angular/core";
import {SYMBOL_PLANET, SYMBOL_ZODIAC} from "../common";
import _ from "lodash";

@Pipe({
  name: 'astro',
  standalone: true
})
export class AstroPipe implements PipeTransform {

    // private capitalizeFirstLetter(str: string): string {
    //   return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    // }
    private insert_symbol(symbol: string, kind: string): string {
      return `<span style="white-space: nowrap; min-width: 15px; min-height: 15px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 13 13" class="gen-${kind}" id="${kind}-${symbol}">
        </svg>${symbol}
      </span>`;
    }

// <svg xmlns="http://www.w3.org/2000/svg"
//   width="13"
//   height="13"
//   viewBox="0 0 13 13">
//   <g svgg-symbol [x]="6" [y]="8" [name]="'${symbol}'" [options]="{scale: 0.65}"></g>
//     </svg>

    transform(value: string) {
        if (!value) {
          return '';
        }
        if (value.length === 1) {
          return value;
        }
        const planets = _.values(SYMBOL_PLANET).join('|');
        const zodiacs = _.values(SYMBOL_ZODIAC).join('|');
        const r_planets: RegExp = new RegExp(`\\b(${planets})\\b`, "ig");
        const r_zodiacs: RegExp = new RegExp(`\\b(${zodiacs})\\b`, "ig");
        const firstSpace = value.indexOf(' ');
        if (firstSpace === -1) {
          return value;
        }
        return value.slice(0, firstSpace) + value.slice(firstSpace)
            .replace(r_planets, `${this.insert_symbol('$1', 'planet')}`)
            .replace(r_zodiacs, `${this.insert_symbol('$1', 'zodiac')}`);
    }
}
