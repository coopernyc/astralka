import {
  AfterViewInit,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Input,
  NgZone,
  OnChanges,
  Output,
  SimpleChanges
} from "@angular/core";
import {CommonModule} from "@angular/common";
import {AstralkaFocusableDirective} from "../focusable.directive";
import {
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  mergeAll,
  Observable,
  of,
  Subject,
  takeUntil,
  tap
} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
  selector: 'astralka-slider',
  standalone: true,
  imports: [CommonModule, AstralkaFocusableDirective],
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.width]="width"
      [attr.height]="height"
      [attr.viewBox]="'0 0 ' + width + ' ' + height"
      (keydown)="onKeyboardEvent($event)"
    >
      <g transform="translate(0,-2)">
        <rect rx="2" ry="2" [attr.x]="(thumbWidth)/2 + margin" [attr.y]="(height - sliderHeight)/2" [attr.width]="width - thumbWidth - margin*2" [attr.height]="sliderHeight" stroke="black" fill="white" />
        <rect focusable rx="3" ry="3" (dblclick)="reset()" [attr.x]="X(value) - thumbWidth/2" [attr.y]="(height - thumbHeight)/2" [attr.width]="thumbWidth" [attr.height]="thumbHeight" stroke="black" fill="white" />
      </g>
    </svg>
  `,
})
export class AstralkaSliderControlComponent implements OnChanges, AfterViewInit {

  @Input() width: number = 200;
  @Input() height: number = 26;
  @Input() step: number = 1;
  @Input() range!: [number, number];
  @Input() value!: number;
  public margin: number = 4;
  public sliderHeight!: number;
  public thumbWidth: number = 10;
  public thumbHeight: number = 16;
  private valueChange$: Subject<number> = new Subject<number>();
  @Output() valueChange: Observable<number> = this.valueChange$.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );
  private _destroyRef = inject(DestroyRef);

  constructor(private zone: NgZone, private el: ElementRef) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['height'] || changes['width']) {
      this.sliderHeight = this.height / 4;
    }
  }

  public onKeyboardEvent(event: KeyboardEvent): void {
    switch(event.key) {
      case 'ArrowLeft':
        if (this.value - this.step >= this.range[0]) {
          this.value -= this.step;
        }
        break;
      case 'ArrowRight':
        if (this.value + this.step <= this.range[1]) {
          this.value += this.step;
        }
        break;
    }
    return this.valueChange$.next(this.value);
  }

  public X(val: number): number {
    const b = (this.width - this.thumbWidth - this.margin*2) / (this.range[1] - this.range[0]);
    const x0 = this.thumbWidth / 2 + this.margin;
    const v0 = this.range[0];
    return  b * (val - v0) + x0;
  }

  public V(x: number): number {
    const b = (this.width - this.thumbWidth - this.margin*2) / (this.range[1] - this.range[0]);
    const x0 = this.thumbWidth / 2 + this.margin;
    const v0 = this.range[0];
    const result = Math.round((x - x0) / b + v0);
    return result > this.range[1]
      ? this.range[1]
      : result < this.range[0]
        ? this.range[0]
        : result;
  }

  ngAfterViewInit() {
    const thumb = this.el.nativeElement;
    const mouseDown$ = fromEvent(thumb, 'mousedown');
    const mouseUp$ = fromEvent(thumb, 'mouseup');
    const mouseLeave$ = fromEvent(thumb, 'mouseleave');
    const mouseStop$ = of(mouseUp$, mouseLeave$).pipe(mergeAll());
    const mouseMove$ = fromEvent(thumb, 'mousemove');

    mouseDown$.pipe(
      takeUntilDestroyed(this._destroyRef),
      filter((m) => m instanceof MouseEvent),
      map(m => m as MouseEvent),
      concatMap(m => {
        let startX = m.pageX;
        return mouseMove$.pipe(
          filter((m) => m instanceof MouseEvent),
          map(m => m as MouseEvent),
          tap(m => {
            m.preventDefault();
            const deltaX = m.pageX - startX;
            if (deltaX !== 0) {
              startX = m.pageX;
              this.zone.run(() => {
                this.value = this.V(this.X(this.value) + deltaX);
              });
            }
          }),
          takeUntil(mouseStop$)
        );
      })
    ).subscribe();

    mouseStop$.pipe(takeUntilDestroyed(this._destroyRef)).subscribe(m => {
      this.valueChange$.next(this.value);
    });
  }

  public reset(): void {
    if (this.value !== 0) {
      this.value = 0;
      this.valueChange$.next(this.value);
    }
  }
}
