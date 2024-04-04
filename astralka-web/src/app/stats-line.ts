import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { ChartSymbol } from "./chart-symbol";
import { ChartText } from "./chart-text";

@Component({
    selector: "[svgg-stat-line]",
    standalone: true,
    imports: [CommonModule, ChartSymbol, ChartText],
    template: `
        <svg:g>
            <g svgg-symbol [x]="x" [y]="y" [name]="stats?.name" [options]="{scale: 0.7}"></g>
            <g *ngIf="stats?.speed < 0" svgg-text [x]="x + 5" [y]="y" [text]="'r'"></g>
            <g svgg-text [x]="x + 13" [y]="y" [text]="stats?.label"></g>
            <g svgg-text [x]="x + space + 13" [y]="y" [text]="stats?.position.deg_fmt"></g>
            <g svgg-symbol [x]="x + space + 40" [y]="y" [name]="stats?.position.sign" [options]="{scale: 0.55}"></g>
            <g svgg-text [x]="x + space + 53" [y]="y" [text]="stats?.position.min_fmt+stats?.position.sec_fmt"></g>
            <g svgg-text [x]="x + space + 90" [y]="y" [text]="stats?.house"></g>
            <g svgg-text [x]="x + space + 135" [y]="y" [text]="stats?.dignities"></g>    
        </svg:g>
    `
})
export class StatsLine {
    @Input() x: number = 0;
    @Input() y: number = 0;
    @Input() stats: any = {};

    public get space(): number {
        return (this.stats?.label === "House") ? 40 : 70;
    }
}