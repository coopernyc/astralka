import {DestroyRef, Directive, ElementRef, inject, Input} from "@angular/core";
import {Observable, Subscription} from "rxjs";
import {Overlay, OverlayRef} from "@angular/cdk/overlay";
import {ComponentPortal} from "@angular/cdk/portal";
import {AstralkaLoaderComponent} from "./loader/loader";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Directive({
  selector: '[overlayLoader]',
  standalone: true
})
export class AstralkaLoaderDirective {

  private overlayRef!: OverlayRef;
  private subscription: Subscription | undefined;

  constructor(private elementRef: ElementRef, private overlay: Overlay) {
    this.overlayRef = this.overlay.create({
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(this.elementRef)
        .withPush(false)
        .withPositions(
          [
            {
              originX: "center",
              originY: "center",
              overlayX: "center",
              overlayY: "center"
            }
          ]
        )
    })
  };
  private _destroyRef: DestroyRef = inject(DestroyRef);

  @Input()
  set overlayLoader(obs: Observable<any>) {
    this.subscription?.unsubscribe();
    this.subscription = obs.pipe(
      takeUntilDestroyed(this._destroyRef)
    ).subscribe((data: any) => {
      const msg: string = data.result;
      if (msg === 'LOADING!') {
        this.show();
      } else {
        this.hide();
      }
    });
  };

  private show(): void {
    this.overlayRef.attach(new ComponentPortal(AstralkaLoaderComponent));
  }
  private hide(): void {
    this.overlayRef.detach();
  }

}
