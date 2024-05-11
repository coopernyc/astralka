import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import _ from "lodash";

@Component({
    selector: `[svgg-text]`,
    standalone: true,
    imports: [CommonModule],
    template: `
        @if (fillBackground) {
          <svg:text
              filter="url(#solid)"
              [attr.x]="x"
              [attr.y]="y"
              [attr.dominant-baseline]="'central'"
              [attr.fill]="fill_color"
              [attr.stroke]="stroke_color"
              [attr.stroke-width]="stroke_width"
              [attr.stroke-dasharray]="stroke_dasharray"
              [attr.font-size]="font_size"
          >
          {{text}}
          </svg:text>
        }
        <svg:text
          filter=""
          [attr.x]="x"
          [attr.y]="y"
          [attr.dominant-baseline]="'central'"
          [attr.fill]="fill_color"
          [attr.stroke]="stroke_color"
          [attr.stroke-width]="stroke_width"
          [attr.stroke-dasharray]="stroke_dasharray"
          [attr.font-size]="font_size"
        >
          {{text}}
        </svg:text>
    `,
})
export class ChartText {
    @Input() x: number = 0;
    @Input() y: number = 0;
    @Input() text: string = "";
    @Input() options: any = {};
    @Input() fillBackground: boolean = true;

    public get fill_color(): string {
        return _.get(this.options, "fill", "#000");
    }
    public get stroke_color(): string {
        return _.get(this.options, "stroke_color", "#000");
    }
    public get stroke_width(): string {
        return _.get(this.options, "stroke_width", 0);
    }
    public get stroke_dasharray(): string {
        return _.get(this.options, "stroke_dasharray", "none");
    }
    public get font_size(): string {
        return _.get(this.options, "font_size", 10);
    }
}
