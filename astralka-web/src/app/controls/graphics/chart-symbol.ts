import {Component, Input} from "@angular/core";
import {
  COLLISION_RADIUS,
  SYMBOL_ASPECT,
  SYMBOL_CUSP,
  SYMBOL_HOUSE,
  SYMBOL_PLANET,
  SYMBOL_SCALE,
  SYMBOL_STROKE_COLOR,
  SYMBOL_STROKE_WIDTH,
  SYMBOL_ZODIAC
} from "../../common";
import {CommonModule} from "@angular/common";
import _ from "lodash";


@Component({
  selector: '[svgg-symbol]',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (fillBackground) {
        <svg:circle [attr.cx]="x" [attr.cy]="y" [attr.r]="COLLISION_RADIUS * this.scale" [attr.fill]="fillBackgroundColor" ></svg:circle>
    }
    <svg:g xmlns:svg="http://www.w3.org/2000/svg" [attr.transform]="transform">
      <svg:path
        [attr.d]="path[0]"
        [attr.stroke]="stroke_color"
        [attr.stroke-width]="stroke_width"
        fill="none"
      />

      <svg:path *ngIf="need2paths"
                [attr.d]="path[1]"
                [attr.stroke]="stroke_color"
                [attr.stroke-width]="stroke_width"
                fill="none"
      />
    </svg:g>
  `
})
export class ChartSymbol {
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Input() options: any = {};
  @Input() name: string = SYMBOL_ASPECT.Nonile;
  @Input() fillBackground: boolean = false;
  @Input() fillBackgroundColor: string = "transparent";

  constructor() {

  }

  public get transform(): string {
    let rotate = '';
    if (this.flipX) {
      rotate = `rotate(180) `;
    }
    let shift = [0, 0];
    switch (this.name) {
      case SYMBOL_PLANET.Sun:
        shift = [-1.15, -7.65];
        break;
      case SYMBOL_PLANET.Moon:
        shift = [-5, -7];
        break;
      case SYMBOL_PLANET.Mercury:
        shift = [-2.15, 7];
        break;
      case SYMBOL_PLANET.Venus:
        shift = [2.4, 6.5];
        break;
      case SYMBOL_PLANET.NorthNode:
        shift = [-2.2, 3];
        break;
      case SYMBOL_PLANET.SouthNode:
        shift = [2.6, -3];
        break;
      case SYMBOL_PLANET.Mars:
        shift = [2, -2.75];
        break;
      case SYMBOL_PLANET.Jupiter:
        shift = [-5.3, -2];
        break;
      case SYMBOL_PLANET.Saturn:
        shift = [4.3, 10];
        break;
      case SYMBOL_PLANET.Uranus:
        shift = [-5, -8];
        break;
      case SYMBOL_PLANET.Neptune:
        shift = [3, -5];
        break;
      case SYMBOL_PLANET.Pluto:
        shift = [5.7, -5];
        break;
      case SYMBOL_PLANET.Chiron:
        shift = [3.8, 5];
        break;
      case SYMBOL_PLANET.ParsFortuna:
        shift = [3.2, -4.1];
        break;
      case SYMBOL_PLANET.Lilith:
        shift = [2, 3];
        break;
      case SYMBOL_ZODIAC.Aries:
        shift = [-7.8, -2];
        break;
      case SYMBOL_ZODIAC.Taurus:
        shift = [-9, -11];
        break;
      case SYMBOL_ZODIAC.Gemini:
        shift = [-5, -6];
        break;
      case SYMBOL_ZODIAC.Cancer:
        shift = [9, -7.5];
        break;
      case SYMBOL_ZODIAC.Leo:
        shift = [-3, 3];
        break;
      case SYMBOL_ZODIAC.Virgo:
        shift = [-9, -5];
        break;
      case SYMBOL_ZODIAC.Libra:
        shift = [0, -8];
        break;
      case SYMBOL_ZODIAC.Scorpio:
        shift = [-9, -4];
        break;
      case SYMBOL_ZODIAC.Sagittarius:
        shift = [8, -9];
        break;
      case SYMBOL_ZODIAC.Capricorn:
        shift = [-9, -3];
        break;
      case SYMBOL_ZODIAC.Aquarius:
        shift = [-9, -1.5];
        break;
      case SYMBOL_ZODIAC.Pisces:
        shift = [-8, -8];
        break;
      case SYMBOL_HOUSE.Ascendant:
        shift = [9, -2];
        break;
      case SYMBOL_HOUSE.Descendant:
        shift = [9, -2];
        break;
      case SYMBOL_HOUSE.MediumCoeli:
        shift = [9, -2];
        break;
      case SYMBOL_HOUSE.ImmumCoeli:
        shift = [7, -2.5];
        break;
      case SYMBOL_CUSP.Cusp1:
        shift = [0, -3];
        break;
      case SYMBOL_CUSP.Cusp2:
        shift = [-2, -3];
        break;
      case SYMBOL_CUSP.Cusp3:
        shift = [-2, -3];
        break;
      case SYMBOL_CUSP.Cusp4:
        shift = [1, -4];
        break;
      case SYMBOL_CUSP.Cusp5:
        shift = [-2, -5];
        break;
      case SYMBOL_CUSP.Cusp6:
        shift = [3, -3];
        break;
      case SYMBOL_CUSP.Cusp7:
        shift = [-4, -4];
        break;
      case SYMBOL_CUSP.Cusp8:
        shift = [-1, -5];
        break;
      case SYMBOL_CUSP.Cusp9:
        shift = [1, -2];
        break;
      case SYMBOL_CUSP.Cusp10:
        shift = [-3, -3.5];
        break;
      case SYMBOL_CUSP.Cusp11:
        shift = [-3, -3];
        break;
      case SYMBOL_CUSP.Cusp12:
        shift = [-3, -3];
        break;
      case SYMBOL_ASPECT.Conjunction:
        shift = [2, 0];
        break;
      case SYMBOL_ASPECT.Opposition:
        shift = [-1.5, 4];
        break;
      case SYMBOL_ASPECT.Trine:
        shift = [0, -5.5];
        break;
      case SYMBOL_ASPECT.Square:
        shift = [0, 0];
        break;
      case SYMBOL_ASPECT.Sextile:
        shift = [0, 0];
        break;
      case SYMBOL_ASPECT.Semisextile:
        shift = [0, 2.5];
        break;
      case SYMBOL_ASPECT.Quincunx:
        shift = [0, -2.5];
        break;
      case SYMBOL_ASPECT.Semisquare:
        shift = [0, 2.5];
        break;
      case SYMBOL_ASPECT.Sesquisquare:
        shift = [0, -1.5];
        break;
      case SYMBOL_ASPECT.Quintile:
        shift = [0.5, -5.5];
        break;
      case SYMBOL_ASPECT.Biquintile:
        shift = [0.5, -6.5];
        break;
      case SYMBOL_ASPECT.Nonile:
        shift = [2, 1];
        break;
      case SYMBOL_ASPECT.Septile:
        shift = [0, 0];
        break;
      case SYMBOL_ASPECT.Binonile:
        shift = [0, 0];
        break;
      case SYMBOL_ASPECT.Decile:
        shift = [-4, -4];
        break;
      case SYMBOL_ASPECT.Centile:
        shift = [0, 0];
        break;
      case SYMBOL_ASPECT.Tridecile:
        shift = [0, 0];
        break;
      case SYMBOL_ASPECT.Biseptile:
        shift = [0, 0];
        break;
      case SYMBOL_ASPECT.Triseptile:
        shift = [0, 0];
        break;
      case SYMBOL_ASPECT.Vigintile:
        shift = [0, 0];
        break;

    }
    return `translate(${this.x + this.scale * shift[0]} ${this.y + this.scale * shift[1]}) ${rotate}scale(${this.scale}) `;
  }

  public get need2paths() {
    return _.includes([
      SYMBOL_PLANET.Mercury, SYMBOL_PLANET.Uranus, SYMBOL_PLANET.Pluto, SYMBOL_PLANET.Chiron,
      SYMBOL_CUSP.Cusp10, SYMBOL_CUSP.Cusp11, SYMBOL_CUSP.Cusp12
    ], this.name);
  }

  public get flipX() {
    return _.includes([SYMBOL_PLANET.SouthNode], this.name);
  }

  public get path(): string[] {

    let p: string[] = [];
    if (this.name == '') {
      return p;
    }
    let [x, y] = [0, 0];
    switch (this.name) {
      case SYMBOL_PLANET.Sun:
        p.push("m" + x + ", " + y + " -2.18182,0.727268 -2.181819,1.454543 -1.454552,2.18182 -0.727268,2.181819 0,2.181819 0.727268,2.181819 1.454552,2.18182 2.181819,1.454544 2.18182,0.727276 2.18181,0 2.18182,-0.727276 2.181819,-1.454544 1.454552,-2.18182 0.727268,-2.181819 0,-2.181819 -0.727268,-2.181819 -1.454552,-2.18182 -2.181819,-1.454543 -2.18182,-0.727268 -2.18181,0 m 0.727267,6.54545 -0.727267,0.727276 0,0.727275 0.727267,0.727268 0.727276,0 0.727267,-0.727268 0,-0.727275 -0.727267,-0.727276 -0.727276,0 m 0,0.727276 0,0.727275 0.727276,0 0,-0.727275 -0.727276,0");
        break;
      case SYMBOL_PLANET.Moon:
        p.push("m" + x + ", " + y + " a 7.4969283,7.4969283 0 0 1 0,14.327462 7.4969283,7.4969283 0 1 0 0,-14.327462 z");
        break;
      case SYMBOL_PLANET.Mercury:
        p.push("m" + x + ", " + y + " 4.26011,0 m -2.13005,-2.98207 0,5.11213 m 4.70312,-9.7983 a 4.70315,4.70315 0 0 1 -4.70315,4.70314 4.70315,4.70315 0 0 1 -4.70314,-4.70314 4.70315,4.70315 0 0 1 4.70314,-4.70315 4.70315,4.70315 0 0 1 4.70315,4.70315 z");
        [x, y] = [x + 6, y - 16];
        p.push("m" + x + ", " + y + " a 3.9717855,3.9717855 0 0 1 -3.95541,3.59054 3.9717855,3.9717855 0 0 1 -3.95185,-3.59445");
        break;
      case SYMBOL_PLANET.Venus:
        p.push("m" + x + ", " + y + " -4.937669,0.03973 m 2.448972,2.364607 0,-5.79014 c -3.109546,-0.0085 -5.624617,-2.534212 -5.620187,-5.64208 0.0044,-3.107706 2.526514,-5.621689 5.635582,-5.621689 3.109068,0 5.631152,2.513983 5.635582,5.621689 0.0044,3.107868 -2.510641,5.633586 -5.620187,5.64208");
        break;
      case SYMBOL_PLANET.Mars:
        p.push("m" + x + ", " + y + " c -5.247438,-4.150623 -11.6993,3.205518 -7.018807,7.886007 4.680494,4.680488 12.036628,-1.771382 7.885999,-7.018816 z m 0,0 0.433597,0.433595 3.996566,-4.217419 m -3.239802,-0.05521 3.295015,0 0.110427,3.681507");
        break;
      case SYMBOL_PLANET.Jupiter:
        p.push("m" + x + ", " + y + " c -0.43473,0 -1.30422,-0.40572 -1.30422,-2.02857 0,-1.62285 1.73897,-3.2457 3.47792,-3.2457 1.73897,0 3.47792,1.21715 3.47792,4.05713 0,2.83999 -2.1737,7.30283 -6.52108,7.30283 m 12.17269,0 -12.60745,0 m 9.99902,-11.76567 0,15.82279");
        break;
      case SYMBOL_PLANET.Saturn:
        p.push("m" + x + ", " + y + " c -0.52222,0.52221 -1.04445,1.04444 -1.56666,1.04444 -0.52222,0 -1.56667,-0.52223 -1.56667,-1.56667 0,-1.04443 0.52223,-2.08887 1.56667,-3.13332 1.04444,-1.04443 2.08888,-3.13331 2.08888,-5.22219 0,-2.08888 -1.04444,-4.17776 -3.13332,-4.17776 -1.97566,0 -3.65555,1.04444 -4.69998,3.13333 m -2.55515,-5.87499 6.26664,0 m -3.71149,-2.48054 0,15.14438");
        break;
      case SYMBOL_PLANET.Uranus:
        p.push("m" + x + ", " + y + "  0,10.23824 m 10.23633,-10.32764 0,10.23824 m -10.26606,-4.6394 10.23085,0 m -5.06415,-5.51532 0,11.94985");
        [x, y] = [x + 7, y + 14.5];
        p.push("m" + x + ", " + y + " a 1.8384377,1.8384377 0 0 1 -1.83844,1.83843 1.8384377,1.8384377 0 0 1 -1.83842,-1.83843 1.8384377,1.8384377 0 0 1 1.83842,-1.83844 1.8384377,1.8384377 0 0 1 1.83844,1.83844 z");
        break;
      case SYMBOL_PLANET.Neptune:
        p.push("m" + x + ", " + y + " 1.77059,-2.36312 2.31872,1.8045 m -14.44264,-0.20006 2.34113,-1.77418 1.74085,2.38595 m -1.80013,-1.77265 c -1.23776,8.40975 0.82518,9.67121 4.95106,9.67121 4.12589,0 6.18883,-1.26146 4.95107,-9.67121 m -7.05334,3.17005 2.03997,-2.12559 2.08565,2.07903 m -5.32406,9.91162 6.60142,0 m -3.30071,-12.19414 0,15.55803");
        break;
      case SYMBOL_PLANET.Pluto:
        p.push("m" + x + ", " + y + " a 5.7676856,5.7676856 0 0 1 -2.88385,4.99496 5.7676856,5.7676856 0 0 1 -5.76768,0 5.7676856,5.7676856 0 0 1 -2.88385,-4.99496 m 5.76771,13.93858 0,-8.17088 m -3.84512,4.32576 7.69024,0");
        [x, y] = [x - 2.3, y];
        p.push("m" + x + ", " + y + " a 3.3644834,3.3644834 0 0 1 -3.36448,3.36449 3.3644834,3.3644834 0 0 1 -3.36448,-3.36449 3.3644834,3.3644834 0 0 1 3.36448,-3.36448 3.3644834,3.3644834 0 0 1 3.36448,3.36448 z");
        break;
      case SYMBOL_PLANET.Chiron:
        p.push("m" + x + ", " + y + " a 3.8764725,3.0675249 0 0 1 -3.876473,3.067525 3.8764725,3.0675249 0 0 1 -3.876472,-3.067525 3.8764725,3.0675249 0 0 1 3.876472,-3.067525 3.8764725,3.0675249 0 0 1 3.876473,3.067525 z");
        [x, y] = [x, y - 13];
        p.push("m" + x + ", " + y + "   -3.942997,4.243844 4.110849,3.656151 m -4.867569,-9.009468 0,11.727251");
        break;
      case SYMBOL_PLANET.ParsFortuna:
        p.push("m" + x + ", " + y + " c-5.3,-4.2,-11.7,3.2,-7,7.8s12,-1.8,7.9,-7l-0.9,-0.8z m-7.4,7.8l8,-7m-8.1,-0.3l8,7");
        break;
      case SYMBOL_PLANET.Lilith:
        p.push("m" + x + ", " + y + " -2.525435,-1.12853 -1.464752,-1.79539 -0.808138,-2.20576 0.151526,-2.05188 0.909156,-1.5389 1.010173,-1.02593 0.909157,-0.56427 1.363735,-0.61556 m 2.315327,-0.39055 -1.716301,0.54716 -1.7163,1.09431 -1.1442,1.64146 -0.572102,1.64146 0,1.64146 0.572102,1.64147 1.1442,1.64145 1.7163,1.09432 1.716301,0.54715 m 0,-11.49024 -2.2884,0 -2.288401,0.54716 -1.716302,1.09431 -1.144201,1.64146 -0.5721,1.64146 0,1.64146 0.5721,1.64147 1.144201,1.64145 1.716302,1.09432 2.288401,0.54715 2.2884,0 m -4.36712,-0.4752 0,6.44307 m -2.709107,-3.41101 5.616025,0");
        break;
      case SYMBOL_PLANET.SouthNode:
      case SYMBOL_PLANET.NorthNode:
        p.push("m" + x + ", " + y + " -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 -0.6666667,1.3333333 0,0.6666667 0.6666667,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666666,-1.3333333 0,-0.6666667 -0.6666666,-1.3333333 -2,-2.66666665 -0.6666667,-1.99999995 0,-1.3333334 0.6666667,-2 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,2 0,1.3333334 -0.6666667,1.99999995 -2,2.66666665 -0.6666666,1.3333333 0,0.6666667 0.6666666,1.3333333 1.3333334,0.6666667 0.6666666,0 1.3333334,-0.6666667 0.6666667,-1.3333333 0,-0.6666667 -0.6666667,-1.3333333 -1.3333334,-0.6666667 -0.6666666,0 -1.3333334,0.6666667 m -7.9999999,-6 0.6666667,-1.3333333 1.3333333,-1.3333333 2,-0.6666667 2.6666666,0 2,0.6666667 1.3333333,1.3333333 0.6666667,1.3333333");
        break;
      case SYMBOL_ZODIAC.Aries:
        p.push("m " + x + ", " + y + " -0.9,-0.9 0,-1.8 0.9,-1.8 1.8,-0.8999998 1.8,0 1.8,0.8999998 0.9,0.9 0.9,1.8 0.9,4.5 m -9,-5.4 1.8,-1.8 1.8,0 1.8,0.9 0.9,0.9 0.9,1.8 0.9,3.6 0,9.9 m 8.1,-12.6 0.9,-0.9 0,-1.8 -0.9,-1.8 -1.8,-0.8999998 -1.8,0 -1.8,0.8999998 -0.9,0.9 -0.9,1.8 -0.9,4.5 m 9,-5.4 -1.8,-1.8 -1.8,0 -1.8,0.9 -0.9,0.9 -0.9,1.8 -0.9,3.6 0,9.9");
        break;
      case SYMBOL_ZODIAC.Taurus:
        p.push("m " + x + ", " + y + " 1,4 1,2 2,2 3,1 4,0 3,-1 2,-2 1,-2 1,-4 m -18,0 1,3 1,2 2,2 3,1 4,0 3,-1 2,-2 1,-2 1,-3 m -11,8 -2,1 -1,1 -1,2 0,3 1,2 2,2 2,1 2,0 2,-1 2,-2 1,-2 0,-3 -1,-2 -1,-1 -2,-1 m -4,1 -2,1 -1,2 0,3 1,3 m 8,0 1,-3 0,-3 -1,-2 -2,-1");
        break;
      case SYMBOL_ZODIAC.Gemini:
        p.push("m " + x + ", " + y + " 0,11.546414 m 0.9622011,-10.5842129 0,9.6220117 m 7.6976097,-9.6220117 0,9.6220117 m 0.962201,-10.5842128 0,11.546414 m -13.4708165,-14.4330172 1.9244023,1.924402 1.9244024,0.9622012 2.8866038,0.9622011 3.848804,0 2.886604,-0.9622011 1.924402,-0.9622012 1.924403,-1.924402 m -17.3196215,17.3196207 1.9244023,-1.9244024 1.9244024,-0.9622011 2.8866038,-0.9622012 3.848804,0 2.886604,0.9622012 1.924402,0.9622011 1.924403,1.9244024");
        break;
      case SYMBOL_ZODIAC.Cancer:
        p.push("m " + x + ", " + y + " -15,0 -2,1 -1,2 0,2 1,2 2,1 2,0 2,-1 1,-2 0,-2 -1,-2 11,0 m -18,3 1,2 1,1 2,1 m 4,-4 -1,-2 -1,-1 -2,-1 m -4,15 15,0 2,-1 1,-2 0,-2 -1,-2 -2,-1 -2,0 -2,1 -1,2 0,2 1,2 -11,0 m 18,-3 -1,-2 -1,-1 -2,-1 m -4,4 1,2 1,1 2,1");
        break;
      case SYMBOL_ZODIAC.Leo:
        p.push("m " + x + ", " + y + " -2,-1 -1,0 -2,1 -1,2 0,1 1,2 2,1 1,0 2,-1 1,-2 0,-1 -1,-2 -5,-5 -1,-2 0,-3 1,-2 2,-1 3,-1 4,0 4,1 2,2 1,2 0,3 -1,3 -3,3 -1,2 0,2 1,2 2,0 1,-1 1,-2 m -13,-5 -2,-3 -1,-2 0,-3 1,-2 1,-1 m 7,-1 3,1 2,2 1,2 0,3 -1,3 -2,3");
        break;
      case SYMBOL_ZODIAC.Virgo:
        p.push("m " + x + ", " + y + " 2.5894868,-2.5894868 1.7263245,2.5894868 0,9.4947847 m -2.5894868,-11.2211092 1.7263245,2.5894867 0,8.6316225 m 0.8631623,-9.4947847 2.5894867,-2.5894868 1.72632451,2.5894868 0,8.6316224 m -2.58948671,-10.3579469 1.72632447,2.5894867 0,7.7684602 m 0.86316224,-8.6316224 2.58948679,-2.5894868 1.7263244,2.5894868 0,13.8105959 m -2.5894867,-15.5369204 1.7263245,2.5894867 0,12.9474337 m 0.8631622,-13.8105959 2.5894868,-2.5894868 0.8631622,1.7263245 0.8631623,2.5894868 0,2.5894867 -0.8631623,2.58948673 -0.8631622,1.72632447 -1.7263245,1.7263245 -2.5894867,1.7263245 -4.3158113,1.7263245 m 7.7684602,-15.5369204 0.8631623,0.8631622 0.8631622,2.5894868 0,2.5894867 -0.8631622,2.58948673 -0.8631623,1.72632447 -1.7263245,1.7263245 -2.5894867,1.7263245 -3.452649,1.7263245");
        break;
      case SYMBOL_ZODIAC.Libra:
        p.push("m " + x + ", " + y + " c 0.7519,1e-5 1.3924,0.12227 1.9316,0.35156 0.6619,0.28495 1.2134,0.63854 1.666,1.0625 0.4838,0.45481 0.853,0.97255 1.1172,1.56641 0.2467,0.56612 0.3711,1.17397 0.3711,1.83789 0,0.64113 -0.1244,1.23948 -0.373,1.80859 -0.1624,0.36305 -0.3631,0.69725 -0.6055,1.00586 l -0.6367,0.8086 4.3789,0 0,0.67187 -5.4024,0 0,-0.91797 c 0.2173,-0.1385 0.4379,-0.27244 0.6367,-0.44726 0.4215,-0.36876 0.7529,-0.82784 0.9883,-1.35547 0.2215,-0.50074 0.334,-1.0358 0.334,-1.58594 0,-0.55653 -0.1122,-1.09434 -0.334,-1.5957 l -0,-0.002 0,-0.004 c -0.2292,-0.49901 -0.5581,-0.94778 -0.9746,-1.33789 l -0,-0.002 -0,-0.002 c -0.3967,-0.36155 -0.8679,-0.65723 -1.4062,-0.88476 l -0,0 c -0.4984,-0.20903 -1.0622,-0.30663 -1.6817,-0.30664 -0.5926,1e-5 -1.1526,0.10008 -1.6699,0.30273 l -0,0 c -0.5261,0.20799 -1.0032,0.5067 -1.4199,0.88867 l -0,0.002 -0,0.002 c -0.4166,0.39011 -0.7454,0.83887 -0.9746,1.33789 l 0,0.004 -0,0.002 c -0.2218,0.50136 -0.334,1.03915 -0.334,1.5957 0,0.55015 0.1125,1.08519 0.334,1.58594 l 0,0.002 0,0.004 c 0.229,0.49855 0.5574,0.94911 0.9746,1.33984 0.1876,0.17482 0.4143,0.31484 0.6367,0.45703 l 0,0.91797 -5.3906,0 0,-0.67187 4.3789,0 -0.6367,-0.8086 c -0.2428,-0.30904 -0.443,-0.64418 -0.6055,-1.00781 -0.2487,-0.56911 -0.3731,-1.16552 -0.3731,-1.80664 0,-0.66391 0.1244,-1.27178 0.3711,-1.83789 l 0,-0.002 c 3e-4,-5.8e-4 -2e-4,-10e-4 0,-0.002 0.2641,-0.59218 0.6326,-1.10871 1.1153,-1.5625 0.4847,-0.45571 1.0332,-0.80585 1.6562,-1.05859 0.5861,-0.23488 1.2294,-0.35546 1.9414,-0.35547 z m -7.8496,13.45899 15.6992,0 0,0.67187 -15.6992,0 z");
        break;
      case SYMBOL_ZODIAC.Scorpio:
        p.push("m " + x + ", " + y + " 2.3781101,-2.3781101 2.3781101,2.3781101 0,9.5124404 m -3.1708135,-11.0978471 2.3781101,2.3781101 0,8.719737 m 0.7927034,-9.5124404 2.3781101,-2.3781101 2.37811007,2.3781101 0,9.5124404 m -3.17081347,-11.0978471 2.3781101,2.3781101 0,8.719737 m 0.79270337,-9.5124404 2.37811013,-2.3781101 2.3781101,2.3781101 0,8.719737 1.5854067,1.5854068 m -4.7562202,-11.8905505 2.3781101,2.3781101 0,8.719737 1.5854067,1.5854067 2.3781101,-2.3781101");
        break;
      case SYMBOL_ZODIAC.Sagittarius:
        p.push("m " + x + ", " + y + " -17.11444,17.11444 m 17.11444,-17.11444 -3.2089575,1.0696525 -6.417915,0 m 7.4875675,1.0696525 -3.2089575,0 -4.27861,-1.0696525 m 9.6268725,-1.0696525 -1.0696525,3.2089575 0,6.41791504 m -1.0696525,-7.48756754 0,3.2089575 1.0696525,4.27861004 m -8.55722,0 -7.4875675,0 m 6.417915,1.06965246 -3.2089575,0 -3.2089575,-1.06965246 m 7.4875675,0 0,7.48756746 m -1.0696525,-6.417915 0,3.2089575 1.0696525,3.2089575");
        break;
      case SYMBOL_ZODIAC.Capricorn:
        p.push("m " + x + ", " + y + " 1.8047633,-3.6095267 4.5119084,9.0238168 m -4.5119084,-7.2190534 4.5119084,9.0238167 2.707145,-6.3166717 4.5119084,0 2.707145,-0.9023817 0.9023817,-1.8047633 0,-1.8047634 -0.9023817,-1.8047633 -1.8047634,-0.9023817 -0.9023816,0 -1.8047634,0.9023817 -0.9023817,1.8047633 0,1.8047634 0.9023817,2.707145 0.9023817,1.80476336 0.9023817,2.70714504 0,2.707145 -1.8047634,1.8047633 m 1.8047634,-16.2428701 -0.9023817,0.9023817 -0.9023817,1.8047633 0,1.8047634 1.8047634,3.6095267 0.9023816,2.707145 0,2.707145 -0.9023816,1.8047634 -1.8047634,0.9023816");
        break;
      case SYMBOL_ZODIAC.Aquarius:
        p.push("m " + x + ", " + y + " 2.8866035,-2.8866035 3.8488047,1.9244023 m -4.8110059,-0.9622011 3.8488047,1.9244023 2.8866035,-2.8866035 2.8866035,1.9244023 m -3.84880467,-0.9622011 2.88660347,1.9244023 2.8866035,-2.8866035 1.9244024,1.9244023 m -2.8866035,-0.9622011 1.9244023,1.9244023 2.8866035,-2.8866035 m -17.319621,8.6598105 2.8866035,-2.88660348 3.8488047,1.92440238 m -4.8110059,-0.96220121 3.8488047,1.92440231 2.8866035,-2.88660348 2.8866035,1.92440238 m -3.84880467,-0.96220121 2.88660347,1.92440231 2.8866035,-2.88660348 1.9244024,1.92440238 m -2.8866035,-0.96220121 1.9244023,1.92440231 2.8866035,-2.88660348");
        break;
      case SYMBOL_ZODIAC.Pisces:
        p.push("m " + x + ", " + y + " 4,2 2,2 1,3 0,3 -1,3 -2,2 -4,2 m 0,-17 3,1 2,1 2,2 1,3 m 0,3 -1,3 -2,2 -2,1 -3,1 m 16,-17 -3,1 -2,1 -2,2 -1,3 m 0,3 1,3 2,2 2,1 3,1 m 0,-17 -4,2 -2,2 -1,3 0,3 1,3 2,2 4,2 m -17,-9 18,0 m -18,1 18,0");
        break;
      case SYMBOL_HOUSE.Ascendant:
        p.push("m " + x + ", " + y + " -0.563078,-1.1261527 -1.689228,-0.5630765 -1.689229,0 -1.68923,0.5630765 -0.563076,1.1261527 0.563076,1.12615272 1.126154,0.56307636 2.815381,0.56307635 1.126152,0.56307647 0.563078,1.1261526 0,0.5630763 -0.563078,1.1261528 -1.689228,0.5630764 -1.689229,0 -1.68923,-0.5630764 -0.563076,-1.1261528 m -6.756916,-10.135374 -4.504611,11.8246032 m 4.504611,-11.8246032 4.504611,11.8246032 m -7.3199925,-3.94153457 5.6307625,0");
        break;
      case SYMBOL_HOUSE.Descendant:
        p.push("m " + x + ", " + y + " -0.5625,-1.125 -1.6875,-0.5625 -1.6875,0 -1.6875,0.5625 -0.5625,1.125 0.5625,1.125 1.125,0.5625 2.8125,0.5625 1.125,0.5625 0.5625,1.125 0,0.5625 -0.5625,1.125 -1.6875,0.5625 -1.6875,0 -1.6875,-0.5625 -0.5625,-1.125 m -11.25,-10.125 0,11.8125 m 0,-11.8125 3.9375,0 1.6875,0.5625 1.125,1.125 0.5625,1.125 0.5625,1.6875 0,2.8125 -0.5625,1.6875 -0.5625,1.125 -1.125,1.125 -1.6875,0.5625 -3.9375,0");
        break;
      case SYMBOL_HOUSE.MediumCoeli:
        p.push("m " + x + ", " + y + " -1.004085,-1.0040845 -1.004084,-0.5020423 -1.506127,0 -1.004085,0.5020423 -1.004084,1.0040845 -0.502043,1.50612689 0,1.00408458 0.502043,1.50612683 1.004084,1.0040846 1.004085,0.5020423 1.506127,0 1.004084,-0.5020423 1.004085,-1.0040846 m -17.57148,-9.0367612 0,10.5428881 m 0,-10.5428881 4.016338,10.5428881 m 4.016338,-10.5428881 -4.016338,10.5428881 m 4.016338,-10.5428881 0,10.5428881");
        break;
      case SYMBOL_HOUSE.ImmumCoeli:
        p.push("m " + x + ", " + y + " -1.208852,-1.2088514 -1.208851,-0.6044258 -1.813278,0 -1.208852,0.6044258 -1.20885,1.2088514 -0.604426,1.81327715 0,1.20885135 0.604426,1.8132772 1.20885,1.2088513 1.208852,0.6044259 1.813278,0 1.208851,-0.6044259 1.208852,-1.2088513 m -11.4840902,-10.8796629 0,12.6929401");
        break;
      case SYMBOL_CUSP.Cusp1:
        p.push("m" + x + ", " + y + " -2.5128753,7.7578884 1.00515009,0 m 3.01545031,-9.5832737 -1.0051501,1.8253853 -2.51287527,7.7578884 m 3.51802537,-9.5832737 -3.01545031,9.5832737 m 3.01545031,-9.5832737 -1.5077251,1.3690388 -1.50772521,0.9126929 -1.00515009,0.4563463 m 2.5128753,-0.9126927 -1.00515016,0.4563464 -1.50772514,0.4563463");
        break;
      case SYMBOL_CUSP.Cusp2:
        p.push("m" + x + ", " + y + " 0,-0.4545454 0.4545454,0 0,0.9090909 -0.9090909,0 0,-0.9090909 0.4545455,-0.9090909 0.4545454,-0.4545455 1.36363637,-0.4545454 1.36363633,0 1.3636364,0.4545454 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -4.5454546,2.72727269 -0.9090909,0.90909091 -0.9090909,1.8181818 m 6.8181818,-9.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -1.36363633,0.9090909 m 1.36363633,-5 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -3.6363637,2.72727269 m -1.3636363,1.81818181 0.4545454,-0.4545454 0.9090909,0 2.27272732,0.4545454 2.27272728,0 0.4545454,-0.4545454 m -5,0 2.27272732,0.9090909 2.27272728,0 m -4.5454546,-0.9090909 2.27272732,1.3636363 1.36363638,0 0.9090909,-0.4545454 0.4545454,-0.9090909 0,-0.4545455");
        break;
      case SYMBOL_CUSP.Cusp3:
        p.push("m" + x + ", " + y + " 0,-0.4545454 0.45454549,0 0,0.9090909 -0.90909089,0 0,-0.9090909 0.4545454,-0.9090909 0.45454549,-0.4545455 1.36363636,-0.4545454 1.36363635,0 1.3636364,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.4545455,0.4545454 -0.9090909,0.4545455 -1.36363635,0.4545454 m 2.27272725,-4.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.4545454,0.4545454 m -0.4545455,-3.6363636 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -0.90909095,0.4545454 m -0.9090909,0 0.9090909,0 1.36363635,0.4545455 0.4545455,0.45454542 0.4545454,0.90909091 0,1.36363637 -0.4545454,0.9090909 -0.9090909,0.4545455 -1.3636364,0.4545454 -1.3636364,0 -1.3636363,-0.4545454 -0.4545455,-0.4545455 -0.4545454,-0.9090909 0,-0.90909091 0.9090909,0 0,0.90909091 -0.4545455,0 0,-0.45454546 m 5,-1.81818182 0.4545455,0.90909091 0,1.36363637 -0.4545455,0.9090909 m -1.36363635,-4.0909091 0.90909095,0.4545455 0.4545454,0.90909088 0,1.81818182 -0.4545454,0.9090909 -0.45454549,0.4545455 -0.90909091,0.4545454");
        break;
      case SYMBOL_CUSP.Cusp4:
        p.push("m" + x + ", " + y + " -2.28678383,7.7750651 0.91471356,0 m 2.74414057,-9.6044922 -0.9147135,1.8294271 -2.28678386,7.7750651 m 3.20149736,-9.6044922 -2.74414057,9.6044922 m 2.74414057,-9.6044922 -7.3177083,6.8603516 7.3177083,0");
        break;
      case SYMBOL_CUSP.Cusp5:
        p.push("m" + x + ", " + y + " -2.27272725,4.5454545 m 2.27272725,-4.5454545 4.54545455,0 m -4.54545455,0.4545454 3.63636365,0 m -4.0909091,0.4545455 2.2727273,0 1.8181818,-0.4545455 0.9090909,-0.4545454 m -6.8181818,4.5454545 0.4545454,-0.4545454 1.3636364,-0.4545455 1.36363636,0 1.36363634,0.4545455 0.4545455,0.4545454 0.4545454,0.90909092 0,1.36363638 -0.4545454,1.3636364 -0.9090909,0.9090909 -1.81818185,0.4545454 -1.36363635,0 -0.9090909,-0.4545454 -0.4545455,-0.4545455 -0.4545454,-0.9090909 0,-0.9090909 0.9090909,0 0,0.9090909 -0.4545455,0 0,-0.45454545 m 5,-2.72727275 0.4545455,0.90909092 0,1.36363638 -0.4545455,1.3636364 -0.9090909,0.9090909 m -0.45454544,-5.4545455 0.90909094,0.4545455 0.4545454,0.9090909 0,1.8181818 -0.4545454,1.3636364 -0.90909094,0.9090909 -0.90909091,0.4545454");
        break;
      case SYMBOL_CUSP.Cusp6:
        p.push("m" + x + ", " + y + " 0,-0.4545455 -0.4545455,0 0,0.9090909 0.9090909,0 0,-0.9090909 -0.4545454,-0.9090909 -0.909091,-0.4545454 -1.3636363,0 -1.36363638,0.4545454 -0.90909092,0.9090909 -0.9090909,1.3636364 -0.4545455,1.3636364 -0.4545454,1.81818178 0,1.36363636 0.4545454,1.36363636 0.4545455,0.4545455 0.9090909,0.4545454 1.36363637,0 1.36363633,-0.4545454 0.9090909,-0.9090909 0.4545455,-0.90909096 0,-1.36363636 -0.4545455,-0.90909088 -0.4545454,-0.4545455 -0.9090909,-0.4545454 -1.36363638,0 -0.90909092,0.4545454 -0.4545454,0.4545455 -0.4545455,0.90909088 m 1.36363636,-4.54545458 -0.90909086,1.3636364 -0.4545455,1.3636364 -0.4545455,1.81818178 0,1.81818182 0.4545455,0.9090909 m 4.0909091,-0.4545454 0.4545454,-0.90909096 0,-1.36363636 -0.4545454,-0.90909088 m -0.9090909,-5 -0.90909093,0.4545454 -0.90909091,1.3636364 -0.45454546,0.9090909 -0.4545454,1.3636364 -0.4545455,1.81818178 0,2.27272732 0.4545455,0.9090909 0.4545454,0.4545454 m 1.36363637,0 0.90909093,-0.4545454 0.4545454,-0.4545455 0.4545455,-1.36363636 0,-1.81818182 -0.4545455,-0.90909092 -0.4545454,-0.4545454");
        break;
      case SYMBOL_CUSP.Cusp7:
        p.push("m" + x + ", " + y + " -0.9090909,2.7272727 m 6.8181818,-2.7272727 -0.4545454,1.3636363 -0.909091,1.3636364 -1.8181818,2.2727273 -0.90909088,1.36363633 -0.45454546,1.36363637 -0.45454545,1.8181818 m 0.90909091,-3.63636362 -0.90909091,1.81818182 -0.45454546,1.8181818 m 4.09090905,-6.8181818 -2.72727268,2.72727272 -0.90909091,1.36363637 -0.45454546,0.90909091 -0.45454545,1.8181818 0.90909091,0 m -1.36363641,-8.1818182 1.36363641,-1.3636363 0.90909091,0 2.27272728,1.3636363 m -3.63636365,-0.9090909 1.36363637,0 2.27272728,0.9090909 m -4.5454546,0 0.90909095,-0.4545454 1.36363637,0 2.27272728,0.4545454 0.9090909,0 0.4545455,-0.4545454 0.4545454,-0.9090909");
        break;
      case SYMBOL_CUSP.Cusp8:
        p.push("m" + x + ", " + y + " -1.3631244,0.4543748 -0.4543748,0.4543748 -0.4543748,0.9087496 0,1.3631244 0.4543748,0.9087496 0.9087496,0.4543748 1.3631244,0 1.3631244,-0.4543748 0.9087496,-0.4543748 0.4543748,-0.9087496 0,-1.3631244 -0.4543748,-0.9087496 -0.9087496,-0.4543748 -1.8174992,0 m 0.9087496,0 -2.271874,0.4543748 m 0,0.4543748 -0.4543748,0.9087496 0,1.8174992 0.4543748,0.4543748 m -0.4543748,0 1.3631244,0.4543748 m 0.4543748,0 1.8174992,-0.4543748 m 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.3631244 -0.4543748,-0.9087496 m 0.4543748,0 -1.8174992,-0.4543748 m -0.9087496,0 -0.9087496,0.9087496 -0.4543748,0.9087496 0,1.8174992 0.4543748,0.9087496 m 1.3631244,0 0.9087496,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.8174992 -0.4543748,-0.9087496 m -2.7262488,4.543748 -1.8174992,0.4543748 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 1.3631244,0.4543748 1.8174992,0 1.8174992,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.36312436 -0.4543748,-0.9087496 -0.4543748,-0.45437484 -0.9087496,-0.4543748 m -0.9087496,0 -2.271874,0.4543748 m 0.4543748,0 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 m -0.4543748,0 2.271874,0.4543748 2.7262488,-0.4543748 m 0,-0.4543748 0.4543748,-0.9087496 0,-1.36312436 -0.4543748,-0.9087496 m 0,-0.45437484 -1.3631244,-0.4543748 m -0.9087496,0 -0.9087496,0.4543748 -0.9087496,0.90874964 -0.4543748,0.9087496 0,1.36312436 0.4543748,0.9087496 0.4543748,0.4543748 m 1.8174992,0 0.9087496,-0.4543748 0.4543748,-0.4543748 0.4543748,-0.9087496 0,-1.81749916 -0.4543748,-0.90874964 -0.4543748,-0.4543748");
        break;
      case SYMBOL_CUSP.Cusp9:
        p.push("m" + x + ", " + y + " -0.4545455,0.9090909 -0.4545454,0.4545455 -0.9090909,0.45454542 -1.36363638,0 -0.90909092,-0.45454542 -0.4545454,-0.4545455 -0.4545455,-0.9090909 0,-1.3636364 0.4545455,-0.9090909 0.90909086,-0.9090909 1.36363637,-0.4545454 1.36363637,0 0.9090909,0.4545454 0.4545455,0.4545455 0.4545454,1.3636363 0,1.3636364 -0.4545454,1.81818182 -0.4545455,1.36363637 -0.9090909,1.36363641 -0.9090909,0.9090909 -1.36363638,0.4545454 -1.36363632,0 -0.909091,-0.4545454 -0.4545454,-0.9090909 0,-0.90909096 0.9090909,0 0,0.90909096 -0.4545455,0 0,-0.4545455 m 1.3636364,-3.1818182 -0.4545454,-0.9090909 0,-1.3636364 0.4545454,-0.9090909 m 4.0909091,-0.4545454 0.4545455,0.9090909 0,1.8181818 -0.4545455,1.81818182 -0.4545455,1.36363637 -0.9090909,1.36363641 m -1.81818178,-2.72727278 -0.45454546,-0.45454542 -0.45454546,-0.9090909 0,-1.8181819 0.45454546,-1.3636363 0.45454546,-0.4545455 0.90909091,-0.4545454 m 1.36363637,0 0.4545454,0.4545454 0.4545455,0.9090909 0,2.2727273 -0.4545455,1.81818182 -0.4545454,1.36363637 -0.4545455,0.90909091 -0.90909087,1.3636364 -0.90909091,0.4545454");
        break;
      case SYMBOL_CUSP.Cusp10:
        p.push("m" + x + ", " + y + " -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915");
        [x, y] = [x + 6.5, y - 1.5];
        p.push("m" + x + ", " + y + " -1.36363638,0.4545454 -0.90909092,0.9090909 -0.9090909,1.3636364 -0.4545455,1.3636364 -0.4545454,1.81818178 0,1.36363636 0.4545454,1.36363636 0.4545455,0.4545455 0.9090909,0.4545454 0.90909092,0 1.36363638,-0.4545454 0.9090909,-0.9090909 0.9090909,-1.36363641 0.4545455,-1.36363637 0.4545454,-1.81818182 0,-1.3636364 -0.4545454,-1.3636363 -0.4545455,-0.4545455 -0.9090909,-0.4545454 -0.9090909,0 m -1.36363638,0.9090909 -0.90909092,0.9090909 -0.4545454,0.9090909 -0.4545455,1.3636364 -0.4545455,1.81818178 0,1.81818182 0.4545455,0.9090909 m 3.1818182,0 0.9090909,-0.9090909 0.4545454,-0.90909091 0.4545455,-1.36363637 0.4545455,-1.81818182 0,-1.8181818 -0.4545455,-0.9090909 m -1.8181818,-0.9090909 -0.90909093,0.4545454 -0.90909091,1.3636364 -0.45454546,0.9090909 -0.4545454,1.3636364 -0.4545455,1.81818178 0,2.27272732 0.4545455,0.9090909 0.4545454,0.4545454 m 0.90909092,0 0.90909091,-0.4545454 0.90909087,-1.3636364 0.4545455,-0.90909091 0.4545454,-1.36363637 0.4545455,-1.81818182 0,-2.2727273 -0.4545455,-0.9090909 -0.4545454,-0.4545454");
        break;
      case SYMBOL_CUSP.Cusp11:
        p.push("m" + x + ", " + y + " -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915");
        [x, y] = [x + 6, y];
        p.push("m" + x + ", " + y + " -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915");
        break;
      case SYMBOL_CUSP.Cusp12:
        p.push("m" + x + ", " + y + " -2.28795747,7.7790553 0.91518297,0 m 2.7455489,-9.6094213 -0.9151829,1.830366 -2.28795748,7.7790553 m 3.20314038,-9.6094213 -2.7455489,9.6094213 m 2.7455489,-9.6094213 -1.3727744,1.3727745 -1.3727745,0.915183 -0.91518297,0.4575915 m 2.28795747,-0.915183 -0.91518301,0.4575915 -1.37277446,0.4575915");
        [x, y] = [x + 4, y + 1];
        p.push("m" + x + ", " + y + " 0,-0.4545454 0.4545454,0 0,0.9090909 -0.9090909,0 0,-0.9090909 0.4545455,-0.9090909 0.4545454,-0.4545455 1.36363637,-0.4545454 1.36363633,0 1.3636364,0.4545454 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -4.5454546,2.72727269 -0.9090909,0.90909091 -0.9090909,1.8181818 m 6.8181818,-9.0909091 0.4545455,0.9090909 0,0.9090909 -0.4545455,0.909091 -0.9090909,0.9090909 -1.36363633,0.9090909 m 1.36363633,-5 0.4545455,0.4545454 0.4545454,0.9090909 0,0.9090909 -0.4545454,0.909091 -0.9090909,0.9090909 -3.6363637,2.72727269 m -1.3636363,1.81818181 0.4545454,-0.4545454 0.9090909,0 2.27272732,0.4545454 2.27272728,0 0.4545454,-0.4545454 m -5,0 2.27272732,0.9090909 2.27272728,0 m -4.5454546,-0.9090909 2.27272732,1.3636363 1.36363638,0 0.9090909,-0.4545454 0.4545454,-0.9090909 0,-0.4545455");
        break;
      case SYMBOL_ASPECT.Conjunction:
        p.push("m" + x + ", " + y + "c0.06,-4.38,-6.81,-4.38,-6.75,0c-0.06,4.38,6.81,4.38,6.75,0z m-1,-2.4l2.97,-2.95l-2.97,2.95z");
        break;
      case SYMBOL_ASPECT.Opposition:
        p.push("m" + x + ", " + y + "c0.05,-3.28,-5.11,-3.28,-5.06,0c-0.05,3.28,5.11,3.28,5.06,0zm8,-8c0.05,-3.28,-5.11,-3.28,-5.06,0c-0.05,3.28,5.11,3.28,5.06,0zm-4.54,2.02l-4,4l4,-4z");
        break;
      case SYMBOL_ASPECT.Trine:
        p.push("m" + x + ", " + y + "l-5.98,9.33l11.28,0l-5.3,-9.33z");
        break;
      case SYMBOL_ASPECT.Square:
        p.push("m" + x + ", " + y + "m0,4l4,0l0,-8l-8,0l0,8z");
        break;
      case SYMBOL_ASPECT.Sextile:
        p.push("m" + x + ", " + y + "m5,5l-10,-10m0,10l10,-10m-10,5l10,0z");
        break;
      case SYMBOL_ASPECT.Semisextile:
        p.push("m" + x + ", " + y + "m-5,0l10,0m-5,0l-5,-5m5,5l5,-5z");
        break;
      case SYMBOL_ASPECT.Quincunx:
        p.push("m" + x + ", " + y + "m-5,0l10,0m-5,0l-5,5m5,-5l5,5z");
        break;
      case SYMBOL_ASPECT.Semisquare:
        p.push("m" + x + ", " + y + "m4,0l-8,0l6,-6");
        break;
      case SYMBOL_ASPECT.Sesquisquare:
        p.push("m" + x + ", " + y + "m0,4l4,0l0,-8l-8,0l0,8z m2,2l-4,0l4,-4");
        break;
      case SYMBOL_ASPECT.Quintile:
        p.push("m" + x + ", " + y + "c-0.31,-0.23,-0.73,-0.23,-1.04,0l-2.53,1.84l-2.14,1.55c-0.31,0.23,-0.44,0.62,-0.32,0.99l1.78,5.49c0.12,0.36,0.46,0.61,0.84,0.61h5.77c0.38,0,0.72,-0.25,0.84,-0.61l1.78,-5.49c0.12,-0.36,-0.01,-0.76,-0.32,-0.99l-4.67,-3.39z");
        break;
      case SYMBOL_ASPECT.Biquintile:
        p.push("m" + x + ", " + y + "c-0.31,-0.23,-0.73,-0.23,-1.04,0l-2.53,1.84l-2.14,1.55c-0.31,0.23,-0.44,0.62,-0.32,0.99l1.78,5.49c0.12,0.36,0.46,0.61,0.84,0.61h5.77c0.38,0,0.72,-0.25,0.84,-0.61l1.78,-5.49c0.12,-0.36,-0.01,-0.76,-0.32,-0.99l-4.67,-3.39z m5,12l-11,0z");
        break;
      case SYMBOL_ASPECT.Nonile:
        p.push("m" + x + ", " + y + "m-5,-5l8,0l-5,8l-5,-8z m0,8l8,0l-5-8l-5,8z");
        break;
      case SYMBOL_ASPECT.Septile:
        p.push("m" + x + ", " + y + "m2,-2l0,-1l-4,0l0,3l4,0l0,3,l-4,0l0,-1");
        break;
      case SYMBOL_ASPECT.Binonile:
        p.push("m" + x + ", " + y + "m-4,-4l8,0l0,4l-8,0zm4,0l0,8m-4,0l8,0");
        break;
      case SYMBOL_ASPECT.Decile:
        p.push("m" + x + ", " + y + "m4,0l0,8m-4,0l8,0");
        break;
      case SYMBOL_ASPECT.Centile:
        p.push("m" + x + ", " + y + "m-4,-4l8,8l-8,0l8,-8");
        break;
      case SYMBOL_ASPECT.Tridecile:
        p.push("m" + x + ", " + y + "m-4,0l8,0m-4,-4l0,8m-4,0l4,-4l4,4");
        break;
      case SYMBOL_ASPECT.Biseptile:
        p.push("m" + x + ", " + y + "m2,-2l0,-1l-4,0l0,3l4,0l0,3,l-4,0l0,-1m-1,-7l2,0m2,0l2,0");
        break;
      case SYMBOL_ASPECT.Triseptile:
        p.push("m" + x + ", " + y + "m2,-2l0,-1l-4,0l0,3l4,0l0,3,l-4,0l0,-1m-2,-7l2,0m1,0l2,0m1,0l2,0");
        break;
      case SYMBOL_ASPECT.Vigintile:
        p.push("m" + x + ", " + y + "l-3,0l0,-4l6,0l0,4l-3,0l-4,4m4,-4l4,4");
        break;
    }
    return p;
  }

  public get stroke_color(): string {
    return _.get(this.options, "stroke_color", SYMBOL_STROKE_COLOR);
  }

  public get stroke_width(): string {
    return _.get(this.options, "stroke_width", SYMBOL_STROKE_WIDTH);
  }

  public get scale(): number {
    return _.get(this.options, "scale", SYMBOL_SCALE);
  }

  protected readonly COLLISION_RADIUS = COLLISION_RADIUS;
}
