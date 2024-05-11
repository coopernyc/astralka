import {Component, Input} from "@angular/core";
import {CommonModule, IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage} from "@angular/common";
import {ChartSymbol} from "../graphics/chart-symbol";
import config from "../../../assets/config.json";

@Component({
  selector: 'astralka-rotate-image',
  standalone: true,
  imports: [CommonModule, ChartSymbol, NgOptimizedImage],
  template: `
    <div class="image-rotate-container" style="position: relative;">
      <img [alt]="rotator.desciption" [ngSrc]="rotator.name" [width]="width" [height]="height" />
      <div class="img-description">
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
export class AstralkaRotateImageComponent {
  @Input() rotator!: any;
  @Input() width!: number;
  @Input() height!: number;

  constructor() {
  }
}
