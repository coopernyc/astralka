import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import _ from "lodash";

@Component({
    selector: `[svgg-line]`,
    standalone: true,
    imports: [CommonModule],
    template: `
        <svg:line 
            [attr.x1]="x1"
            [attr.y1]="y1"
            [attr.x2]="x2"
            [attr.y2]="y2"
            [attr.fill]="fill_color"
            [attr.stroke]="stroke_color"
            [attr.stroke-width]="stroke_width"
            [attr.stroke-dasharray]="stroke_dasharray"
        >
        </svg:line>
    `
})
export class ChartLine {
    @Input() x1: number = 0;
    @Input() y1: number = 0;
    @Input() x2: number = 0;
    @Input() y2: number = 0;
    @Input() options: any = {}
    
    public get fill_color(): string {
        return _.get(this.options, "fill", "none");        
    }
    public get stroke_color(): string {
        return _.get(this.options, "stroke_color", "#000");
    }
    public get stroke_width(): string {
        return _.get(this.options, "stroke_width", 1);
    }
    public get stroke_dasharray(): string {
        return _.get(this.options, "stroke_dasharray", "none");
    }
}