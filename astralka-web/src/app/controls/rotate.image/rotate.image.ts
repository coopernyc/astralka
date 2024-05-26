import {Component, Input} from "@angular/core";
import {CommonModule, IMAGE_LOADER, ImageLoaderConfig, NgOptimizedImage} from "@angular/common";
import {ChartSymbol} from "../graphics/chart-symbol";
import config from "../../../assets/config.json";
import {SafeHtmlPipe} from "../safe.html.pipe";

@Component({
  selector: 'astralka-rotate-image',
  standalone: true,
  imports: [CommonModule, ChartSymbol, NgOptimizedImage, SafeHtmlPipe],
  template: `
    <div class="image-rotate-container" style="position: relative;">
      <img
        [alt]="rotator.desciption"
        [ngSrc]="rotator.name"
        [width]="width"
        [height]="height"
      />
      <div class="img-description" title="Toggle Info">
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

  protected info!: any;

  constructor() {
  }
}
