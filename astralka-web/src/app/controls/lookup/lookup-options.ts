import { A11yModule, Highlightable } from "@angular/cdk/a11y";
import { CommonModule } from "@angular/common";
import { Component, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, ViewChild } from "@angular/core";

@Component({
    selector: 'lookup-option',
    standalone: true,
    imports: [CommonModule, A11yModule],
    template: `<div #option><ng-content></ng-content></div>`,
    host: {
        role: 'listbox',
        '[attr.aria-label]': 'value',
        },
    styleUrl: './lookup-option.scss'
})
export class LookupOption implements Highlightable {

    @Input()
    public value!: any;

    @ViewChild('option')
    private option!: ElementRef;

    @HostBinding('class.active')
    public active = false;

    @Output()
    public selected: EventEmitter<any> = new EventEmitter<any>();

    setActiveStyles(): void {
        this.active = true;
    }
    setInactiveStyles(): void {
        this.active = false;
    }

    @HostListener('click', ['$event'])
    public onClick(event: UIEvent): void {
        event.preventDefault();
        if (!this.disabled) {
            this.selected.next(this);
        }
    }

    @HostBinding('class.disabled')
    public disabled: boolean = false;

    getLabel?(): string {
        throw new Error("Method not implemented.");
    }

    scrollIntoView() {
        this.option.nativeElement.scrollIntoView({ block: 'center' });
    }

}
