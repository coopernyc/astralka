import {Component} from "@angular/core";
import {CommonModule, NgOptimizedImage} from "@angular/common";

@Component({
  selector: 'astralka-loader',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div class="loader">
      <div>Gemini AI is processing your request</div>
      <img ngSrc="assets/loading.gif" alt="loading" height="17" width="200"/>
    </div>
  `,
  styleUrl: "loader.scss"
})
export class AstralkaLoaderComponent {
}
