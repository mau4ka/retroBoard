import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appScroll]',
})
export class ScrollDirective {
  @Input('scrollDirection') direction!: string;
  @Input('widgetsContent') widgetsContent!: HTMLElement;

  constructor(private el: ElementRef) {}

  @HostListener('mouseover') onMouseIn() {
    if (this.direction === 'right') {
      this.widgetsContent.scrollTo({
        left: this.widgetsContent.scrollLeft + 100,
        behavior: 'smooth',
      });
    } else {
      this.widgetsContent.scrollTo({
        left: this.widgetsContent.scrollLeft - 100,
        behavior: 'smooth',
      });
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.direction === 'right') {
      this.widgetsContent.scrollTo({
        left: this.widgetsContent.scrollLeft + 100,
        behavior: 'smooth',
      });
    } else {
      this.widgetsContent.scrollTo({
        left: this.widgetsContent.scrollLeft - 100,
        behavior: 'smooth',
      });
    }
  }


}
