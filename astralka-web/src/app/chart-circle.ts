import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import _ from "lodash";

@Component({
    selector: `[svgg-circle]`,
    standalone: true,
    imports: [CommonModule],
    template: `
        <svg:circle 
            [attr.cx]="cx"
            [attr.cy]="cy"
            [attr.r]="radius"
            [attr.fill]="fill_color"
            [attr.stroke]="stroke_color"
            [attr.stroke-width]="stroke_width"
        >
        </svg:circle>
    `
})
export class ChartCircle {
    @Input() cx: number = 0;
    @Input() cy: number = 0;
    @Input() radius: number = 0;
    @Input() options: any = { fill: "none",  }
    
    public get fill_color(): string {
        return _.get(this.options, "fill", "none");        
    }
    public get stroke_color(): string {
        return _.get(this.options, "stroke_color", "#000");
    }
    public get stroke_width(): string {
        return _.get(this.options, "stroke_width", );
    }
}