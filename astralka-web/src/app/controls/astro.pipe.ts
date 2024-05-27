import {Pipe, PipeTransform} from "@angular/core";
import {SYMBOL_ASPECT, SYMBOL_PLANET, SYMBOL_ZODIAC} from "../common";
import _ from "lodash";

@Pipe({
  name: 'astro',
  standalone: true
})
export class AstroPipe implements PipeTransform {

  private readonly planets = _.values(SYMBOL_PLANET).join('|');
  private readonly aspects: string = _.values(SYMBOL_ASPECT).join('|');
  private readonly zodiacs = _.values(SYMBOL_ZODIAC).join('|');
  private readonly r_planets: RegExp = new RegExp(`\\b(${this.planets})\\b`, "ig");
  private readonly r_zodiacs: RegExp = new RegExp(`\\b(${this.zodiacs})\\b`, "ig");
  private readonly r_aspects: RegExp = new RegExp(`\\b(${this.aspects})\\b`, "ig");

  private capitalizeFirstLetter(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  private insert_symbol(symbol: string, kind: string): string {
    return `<span style="white-space: nowrap; min-width: 15px; min-height: 15px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 13 13" class="gen-${kind}" id="${kind}-${symbol}">
        </svg>${symbol}
      </span>`;
  }

  transform(value: string) {
    if (!value) {
      return '';
    }
    if (value.length === 1) {
      return value;
    }
    const firstSpace = value.indexOf(' ');
    if (firstSpace === -1) {
      return value;
    }
    return value.slice(0, firstSpace) + value.slice(firstSpace)
      .replace(this.r_planets, (x: string) => {
        const a = this.capitalizeFirstLetter(x);
        return `${this.insert_symbol(a, 'planet')}`;
      })
      .replace(this.r_aspects, (x: string) => {
        const a = this.capitalizeFirstLetter(x);
        return `${this.insert_symbol(a, 'aspect')}`;
      })
      .replace(this.r_zodiacs, (x: string) => {
        const a = this.capitalizeFirstLetter(x);
        return `${this.insert_symbol(a, 'zodiac')}`;
      });
  }
}
