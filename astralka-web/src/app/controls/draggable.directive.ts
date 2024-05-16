import {Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {DragService} from '../services/drag.service';
import {IDraggableOptions} from "../common";

@Directive({
  selector: '[draggable]',
  standalone: true
})
export class DraggableDirective implements OnInit, OnDestroy {

  private onDragStart!: Function;
  private onDragEnd!: Function;
  private options!: IDraggableOptions;

  @Input()
  set draggable(options: IDraggableOptions) {
    this.options = options;
  }

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private service: DragService) {
    this.renderer.setProperty(this.el.nativeElement, "draggable", true);
    this.renderer.addClass(this.el.nativeElement, "tab-draggable");
  }

  public ngOnInit() {
    if (this.options.zones) {
      this.addDragEvents();
    }
  }

  public ngOnDestroy() {
    try {
      this.onDragStart();
      this.onDragEnd();
    } catch(e) {}
  }

  private addDragEvents(): void {
    this.onDragStart = this.renderer.listen(
      this.el.nativeElement,
      'dragstart',
      (event: DragEvent) => {
        if (this.options.zones) {
          this.service.startDrag(this.options.zones);
          event.dataTransfer!.setData('Text', JSON.stringify(this.options.data));
        }
      }
    );
    this.onDragEnd = this.renderer.listen(
      this.el.nativeElement,
      'dragend',
      () => {
        this.service.dimZones();
      }
    )
  }

}
