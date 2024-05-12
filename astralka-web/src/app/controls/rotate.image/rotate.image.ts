import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {CommonModule, IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage} from "@angular/common";
import {ChartSymbol} from "../graphics/chart-symbol";
import config from "../../../assets/config.json";
import {contextStaticData, getContext, rnd_suffix, StaticDataType} from "../../common";
import {SafeHtmlPipe} from "../safe.html.pipe";

@Component({
  selector: 'astralka-rotate-image',
  standalone: true,
  imports: [CommonModule, ChartSymbol, NgOptimizedImage, SafeHtmlPipe],
  template: `
    <div class="image-rotate-container" style="position: relative;">
      @if (show_info && info) {
        <div class="image-rotate-info">
          @switch(info.type) {
            @case(StaticDataType.Sign) {
              <h3>{{info.data.dates}}</h3>
              <h4>{{info.data.mode}}, {{info.data.element}} element, "<i>{{info.data.mantra}}</i>"</h4>
              <div>Body parts: {{info.data.bodyParts}}</div>
              <div>Tarot card: {{info.data.tarotCard}}</div>
              <div>Colors</div>
              <div style="align-items: center; display: flex">
                @for(color of info.data.colors; track color.name) {
                  <div class="color-sample" [style.background-color]="color.code"></div><span>{{color.name}}</span>
                }
              </div>
              <div [innerHTML]="info.data.description | safeHtml"></div>
              <p>&nbsp;</p>
            }
          }
        </div>
      } @else {
        <img
          [alt]="rotator.desciption"
          [ngSrc]="rotator.name"
          [width]="width"
          [height]="height"
          (click)="roll_again()"
          title="Click for new image"
        />
      }
      <div class="img-description" (click)="toggle()" title="Toggle Info">
        <span class="symbol">
          <svg xmlns="http://www.w3.org/2000/svg"
               width="20"
               height="20"
               viewBox="0 0 20 20">
            <g svgg-symbol [x]="10" [y]="12" [name]="rotator.description" [options]="{scale: 1, stroke_color: '#fff'}"></g>
          </svg>
        </span>
        <span class="description">{{rotator.description}}</span>
      </div>
    </div>
  `,
  styleUrl: 'rotate.image.scss',
  providers: [
    {
      provide: IMAGE_LOADER, useValue: (loaderConfig: ImageLoaderConfig) => {
        if (config.rotate_images) {
          return `${config.rotate_images.imageLoaderUrl}?src=${loaderConfig.src}&width=${loaderConfig.width}`;
        } else {
          return ``;
        }
      }
    }
  ]
})
export class AstralkaRotateImageComponent implements OnChanges {
  @Input() rotator!: any;
  @Input() width!: number;
  @Input() height!: number;

  protected show_info: boolean = false;
  protected info!: any;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.show_info = false;
  }

  public roll_again() {
    const name = getContext(this.rotator.data);
    this.rotator = {
      name: name + '.' + rnd_suffix(),
      description: name,
      data: this.rotator.data
    };
  }

  public toggle(): void {
    if (!this.show_info) {
      this.info = contextStaticData(getContext(this.rotator.data));
    }
    if (this.info) {
      this.show_info = !this.show_info;
      if (!this.show_info) {
        this.info = undefined;
      }
    }
  }

  protected readonly StaticDataType = StaticDataType;
}
