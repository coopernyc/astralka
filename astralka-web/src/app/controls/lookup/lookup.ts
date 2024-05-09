import {CommonModule} from "@angular/common";
import {CdkPortal, PortalModule} from "@angular/cdk/portal";
import {Overlay, OverlayConfig, OverlayModule, OverlayRef} from "@angular/cdk/overlay";
import {ActiveDescendantKeyManager} from "@angular/cdk/a11y";
import {
  AfterViewInit, ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter, Input, OnChanges,
  OnInit,
  Output,
  QueryList, SimpleChanges,
  ViewChild,
  ViewChildren
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {debounceTime, distinctUntilChanged, Observable, Subject, switchMap, tap} from "rxjs";
import {RestService} from "../../services/rest.service";
import {IPersonInfo, PersonScope} from "../../common";
import {LookupOption} from "./lookup-options";
import {SessionStorageService} from "../../services/session.storage.service";
import {ScrollingModule} from "@angular/cdk/scrolling";

@Component({
    selector: 'lookup',
    standalone: true,
    imports: [CommonModule, FormsModule, OverlayModule, PortalModule, LookupOption, ScrollingModule],
    template: `
        <input
            #input
            id="name"
            type="text"
            autocomplete="off"
            spellcheck="off"
            (keyup)="search(getValue($event))"
            (keydown)="manage($event)"
        />

        <ng-template cdkPortal #overlayTemplate="cdkPortal" class="dropdown">
            <cdk-virtual-scroll-viewport itemSize="26" minBufferPx="200" maxBufferPx="400" class="dd">
              <lookup-option [class.pub]="person.scope === PersonScope.Public" *cdkVirtualFor="let person of list;" [value]="person" (selected)="selectOption($event)">
                <div class="dd-item">
                  <div style="flex: 1; overflow: hidden;">{{person.name}}</div>
                  <div style="flex: 0 20px; tex-align: right;">{{person.scope === PersonScope.Private ? 'Prv' : 'Pub'}}</div>
                </div>
              </lookup-option>
            </cdk-virtual-scroll-viewport>
<!--            <div class="dd">-->
<!--                @for(person of list; track person.name) {-->
<!--                    &lt;!&ndash; <div class="dd-item">{{person.name}}</div> &ndash;&gt;-->
<!--                    <lookup-option [value]="person" (selected)="selectOption($event)">-->
<!--                      <div style="display: flex; flex-direction: row; width: 100%; overflow: hidden">-->
<!--                        <div style="flex: 1; overflow: hidden;">{{person.name}}</div>-->
<!--                        <div style="flex: 0 20px; tex-align: right;">{{person.scope === PersonScope.Private ? 'Prv' : 'Pub'}}</div>-->
<!--                      </div>-->
<!--                    </lookup-option>-->
<!--                }-->
<!--            </div>-->
        </ng-template>
    `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AstralkaLookupControlComponent implements OnInit, AfterViewInit, OnChanges {

    public people$!: Observable<IPersonInfo[]>;
    private withRefresh = false;
    private query$: Subject<string> = new Subject<string>();
    private overlayRef!: OverlayRef;
    private showing: boolean = false;
    private keyManager!: ActiveDescendantKeyManager<LookupOption>;
    public list!: IPersonInfo[];

    @Input() query: string = "";
    @ViewChild("input") public input!: ElementRef;
    @ViewChild(CdkPortal) public contentTemplate!: CdkPortal;
    @ViewChildren(LookupOption) public options!: QueryList<LookupOption>;
    @Output() selected: EventEmitter<IPersonInfo> = new EventEmitter<IPersonInfo>();

    constructor(private rest: RestService,
        private overlay: Overlay,
        private session: SessionStorageService,
        private cdr: ChangeDetectorRef) {
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes['query']) {
        this.query = changes['query'].currentValue ?? '';
        if (this.input && this.input.nativeElement) {
          this.setValue(this.query);
        }
      }
    }

  public getValue(event: Event): string {
        return (event.target as HTMLInputElement).value;
    }

    private setValue(value: string) {
        this.input.nativeElement.value = value;
    }

    public search(name: string): void {
        this.query$.next(name);
    }

    public manage(event: KeyboardEvent): void {
        if (this.showing) {
            this.handleVisibleDropDown(event);
        } else {
            this.handleHiddenDropDown(event);
        }
    }

    ngAfterViewInit(): void {
        this.setValue(this.query);
        this.keyManager = new ActiveDescendantKeyManager(this.options || [])
          .withHorizontalOrientation('ltr')
          .withVerticalOrientation()
          .withWrap();
    }

    private handleVisibleDropDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Enter':
            case ' ':
                if (this.keyManager.activeItem) {
                this.selectOption(this.keyManager.activeItem);
                }
                break;
            case 'Escape':
                this.hide();
                break;
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowRight':
            case 'ArrowLeft':
                this.keyManager.onKeydown(event);
                this.keyManager.activeItem?.scrollIntoView();
                event.preventDefault();
                break;
            case 'Tab':
                this.keyManager.onKeydown(event);
                this.keyManager.activeItem?.scrollIntoView();
                break;
            case 'PageUp':
            case 'PageDown':
                event.preventDefault();
                break;
            default:
                event.stopPropagation();
                const firstFound = this.options.first;
                if (firstFound) {
                    firstFound.scrollIntoView();
                    this.keyManager.setActiveItem(firstFound);
                }
        }
    }

    private handleHiddenDropDown(event: KeyboardEvent): void {
        switch (event.key) {
            case 'Enter':
            case ' ':
            case 'ArrowDown':
            case 'ArrowUp':
                if (this.list && this.list.length) {
                    this.showDropdown();
                }
                if (this.selectedOption) {
                    this.selectedOption.scrollIntoView();
                }
                break;
            default:
                if (this.list && this.list.length) {
                    this.showDropdown();
                }
                event.stopPropagation();
                const firstFound = this.options.first;
                if (firstFound) {
                    firstFound.scrollIntoView();
                    this.keyManager.setActiveItem(firstFound);
                }
          }
    }

    private selectedOption!: LookupOption;
    public selectOption(option: LookupOption) {
        if (this.selectedOption !== option) {
            this.selectedOption = option;
            this.setValue(option.value.name);
            this.hide();
            this.selected.next(this.selectedOption.value);
        }
    }

    ngOnInit(): void {
        this.people$ = this.query$.pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(name => {
              const username = this.session.restoreUser().username;
              return this.rest.searchPerson(name, username, this.withRefresh);
            }),
            tap((list: any[]) => {
                if (list && list.length > 0) {
                    this.showDropdown();
                }
            })
        );
        this.people$.subscribe((list: IPersonInfo[]) => {
            if (list.length) {
                this.list = list;
            } else {
                this.list = [];
                this.hide();
            }
            try {
                this.cdr.detectChanges();
            } catch (e) {}
        });
    }

    public showDropdown(): void {
        if (!this.showing) {
            this.overlayRef = this.overlay.create(this.getOverlayConfig());
            this.overlayRef.attach(this.contentTemplate);
            this.syncWidth();
            this.overlayRef.backdropClick().subscribe(() => this.hide());
            this.showing = true;
        }
    }
    private hide(): void {
      if (this.showing && this.overlayRef) {
        this.overlayRef.detach();
        this.showing = false;
      }
    }
    private syncWidth(): void {
        if (!this.overlayRef) {
          return;
        }
        const refRectWidth =
        this.input.nativeElement.getBoundingClientRect().width;
        this.overlayRef.updateSize({ width: refRectWidth });
    }
    private getOverlayConfig(): OverlayConfig {
        const positionStrategy = this.overlay
          .position()
          .flexibleConnectedTo(this.input.nativeElement)
          .withPush(true)
          .withPositions([
            {
              originX: 'start',
              originY: 'bottom',
              overlayX: 'start',
              overlayY: 'top',
              offsetY: 2,
            },
            {
              originX: 'start',
              originY: 'top',
              overlayX: 'start',
              overlayY: 'bottom',
              offsetY: -2,
            },
          ]);

        const scrollStrategy = this.overlay.scrollStrategies.reposition();
        return new OverlayConfig({
          minWidth: "220px",
          maxWidth: "220px",
          positionStrategy: positionStrategy,
          scrollStrategy: scrollStrategy,
          hasBackdrop: true,
          backdropClass: 'cdk-overlay-transparent-backdrop',
        });
    }

  protected readonly PersonScope = PersonScope;
}
