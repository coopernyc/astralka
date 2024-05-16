import {Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {DragService} from '../services/drag.service';
import {IDroppableEventObject, IDroppableOptions} from "../common";

@Directive({
  selector: '[droppable]',
  standalone: true
})
export class DroppableDirective implements OnInit, OnDestroy {

  private onDragEnter!: Function;
  private onDragLeave!: Function;
  private onDragOver!: Function;
  private onDrop!: Function;

  public options: IDroppableOptions = {
    zone: 'tab-zone'
  }

  @Input()
  set droppable(options: IDroppableOptions) {
    if (options) {
      this.options = options;
    }
  }
  @Output()
  onDropComplete: EventEmitter<IDroppableEventObject> = new EventEmitter<IDroppableEventObject>();

  constructor(private el: ElementRef,
              private renderer: Renderer2,
              private service: DragService) {
    this.renderer.addClass(this.el.nativeElement, "tab-droppable");
  }

  public ngOnInit() {
    if (this.options.zone) {
      this.service.addZone(this.options.zone, {
        begin: () => {
          this.renderer.addClass(this.el.nativeElement, "tab-droppable-target");
        },
        end: () => {
          this.renderer.removeClass(this.el.nativeElement, "tab-droppable-target");
        }
      });
      this.addOnDragEvents();
    }
  }

  public ngOnDestroy() {
    if (this.options.zone) {
      this.service.removeAvailableZone(this.options.zone);
    }
    try {
      this.onDragEnter();
      this.onDragLeave();
      this.onDragOver();
      this.onDrop();
    } catch(e) {}
  }

  private addOnDragEvents(): void {
    this.onDragEnter = this.renderer.listen(
      this.el.nativeElement,
      'dragenter',
      (event: DragEvent) => {
        this.handleDragEnter(event);
      }
    );
    this.onDragLeave = this.renderer.listen(
      this.el.nativeElement,
      'dragleave',
      (event: DragEvent) => {
        this.handleDragLeave(event);
      }
    );
    this.onDragOver = this.renderer.listen(
      this.el.nativeElement,
      'dragover',
      (event: DragEvent) => {
        this.handleDragOver(event);
      }
    );
    this.onDrop = this.renderer.listen(
      this.el.nativeElement,
      'drop',
      (event: DragEvent) => {
        this.handleDrop(event);
      }
    );
  }

  private handleDragEnter(event: DragEvent): void {
    if (this.options.zone && this.service.canDrop(this.options.zone)) {
      event.preventDefault();
      this.renderer.addClass(event.target, "tab-droppable-zone");
    }
  }
  private handleDragLeave(event: DragEvent): void {
    if (this.options.zone && this.service.canDrop(this.options.zone)) {
      this.renderer.removeClass(event.target, "tab-droppable-zone");
    }
  }

  private handleDragOver(event: DragEvent): void {
    if (this.options.zone && this.service.canDrop(this.options.zone)) {
      event.preventDefault();
    }
  }

  private handleDrop(event: DragEvent): void {
    this.service.dimZones();
    this.renderer.removeClass(event.target, "tab-droppable-zone");
    let data: any = null;
    if (event.dataTransfer) {
      data = JSON.parse(event.dataTransfer.getData("Text"));
    }
    this.onDropComplete.next({
      data: data,
      zone: this.options.data
    });
  }

}
