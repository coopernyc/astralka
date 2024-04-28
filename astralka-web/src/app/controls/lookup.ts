import { CommonModule } from "@angular/common";
import { CdkPortal, PortalModule } from "@angular/cdk/portal";
import { Overlay, OverlayConfig, OverlayModule, OverlayRef } from "@angular/cdk/overlay";
import { A11yModule, ActiveDescendantKeyManager } from "@angular/cdk/a11y";
import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Observable, Subject, debounceTime, distinctUntilChanged, fromEvent, switchMap, tap } from "rxjs";
import { RestService } from "../services/rest.service";
import { IPersonInfo } from "../common";
import { BrowserModule } from "@angular/platform-browser";
import { LookupOption } from "./lookup-options";

@Component({
    selector: 'lookup',
    standalone: true,
    imports: [CommonModule, FormsModule, OverlayModule, PortalModule, LookupOption],
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
        
        <ng-template cdk-portal #overlayTemplate="cdkPortal" class="dropdown">
            <div class="dd">
                @for(person of list; track person.name) {
                    <!-- <div class="dd-item">{{person.name}}</div> -->
                    <lookup-option [value]="person" (selected)="selectOption($event)">{{person.name}}</lookup-option>
                }
            </div>    
        </ng-template>
    `
})
export class PeopleLookup implements OnInit, AfterViewInit {

    public people$!: Observable<IPersonInfo[]>; 
    private withRefresh = false;
    private query$: Subject<string> = new Subject<string>();
    private overlayRef!: OverlayRef;
    private showing: boolean = false;
    private keyManager!: ActiveDescendantKeyManager<LookupOption>;
    public list!: IPersonInfo[];

    @ViewChild("input") public input!: ElementRef;
    @ViewChild(CdkPortal) public contentTemplate!: CdkPortal;    
    @ViewChildren(LookupOption) public options!: QueryList<LookupOption>;
    @Output() selected: EventEmitter<IPersonInfo> = new EventEmitter<IPersonInfo>();

    constructor(private restService: RestService, 
        private overlay: Overlay,
        private cdr: ChangeDetectorRef) {        
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
            switchMap(name => this.restService.searchPerson(name, this.withRefresh)),
            tap((list: any[]) => {
                if (list && list.length > 0) {
                    this.showDropdown();
                }
                console.log(list);
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
        this.overlayRef.detach();
        this.showing = false;
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
              offsetY: 4,
            },
            {
              originX: 'start',
              originY: 'top',
              overlayX: 'start',
              overlayY: 'bottom',
              offsetY: -4,
            },
          ]);
    
        const scrollStrategy = this.overlay.scrollStrategies.reposition();
        return new OverlayConfig({
          positionStrategy: positionStrategy,
          scrollStrategy: scrollStrategy,
          hasBackdrop: true,
          backdropClass: 'cdk-overlay-transparent-backdrop',
        });
      }



}