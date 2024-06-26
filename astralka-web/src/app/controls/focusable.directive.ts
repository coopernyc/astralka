import {Directive, HostBinding, Input} from '@angular/core';

type Both = '';
export type Focusable = Both | 'keyboard' | 'mouse' | 'none';

@Directive({
  selector: '[focusable]',
  standalone: true
})
export class AstralkaFocusableDirective {
  @Input()
  focusable: Focusable = '';

  @HostBinding('tabIndex')
  get tabIndex(): number {
    return this.focusable === 'keyboard' || this.focusable === '' ? 0 : -1;
  }

  @HostBinding('style.pointer-events')
  get pointerEvents(): string {
    return this.focusable === 'mouse' || this.focusable === '' ? 'auto' : 'none';
  }
}
