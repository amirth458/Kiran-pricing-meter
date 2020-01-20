import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'img[default]',
  host: {
    '(error)': 'updateUrl()',
    '(load)': 'load()',
    '[src]': 'src'
  }
})
export class ImgPreloadDirective {
  @Input() src: string;
  @Input() default: string;
  @HostBinding('class') className;
  @Input() class: string;

  updateUrl() {
    this.src = this.default;
  }

  load() {
    this.className = `${this.class} image-loaded`;
  }
}
