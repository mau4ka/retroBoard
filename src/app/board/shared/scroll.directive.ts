import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appScroll]',
})
export class ScrollDirective {
  @Input('scrollDirection') direction!: string;
  @Input('boardComponent') boardComponent!: HTMLElement;

  constructor(private el: ElementRef) {}

  @HostListener('mouseover') onMouseIn() {
    if (this.direction === 'right') {
      this.boardComponent.scrollTo({
        left: this.boardComponent.scrollLeft + 100,
        behavior: 'smooth',
      });
    } else {
      this.boardComponent.scrollTo({
        left: this.boardComponent.scrollLeft - 100,
        behavior: 'smooth',
      });
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    if (this.direction === 'right') {
      this.boardComponent.scrollTo({
        left: this.boardComponent.scrollLeft + 100,
        behavior: 'smooth',
      });
    } else {
      this.boardComponent.scrollTo({
        left: this.boardComponent.scrollLeft - 100,
        behavior: 'smooth',
      });
    }
  }
}
