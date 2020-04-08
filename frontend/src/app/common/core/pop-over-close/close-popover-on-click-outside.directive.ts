import { Directive, HostListener, Input } from '@angular/core';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Directive({
  selector: '[closePopoverOnClickOutside]]'
})
export class ClosePopoverOnClickOutsideDirective {
  private active = false;

  @Input('closePopoverOnClickOutside') private popover: NgbPopover;

  @HostListener('document:click', ['$event.target'])
  private docClicked(target): void {
    if (!this.popover.isOpen()) {
      this.active = false;
    } else {
      if (!this.active) {
        this.active = true;
      } else {
        let cancelClose = false;
        let popoverWindows = document.getElementsByTagName('ngb-popover-window');

        for (let i = 0; i < popoverWindows.length; i++) {
          cancelClose = cancelClose || popoverWindows[i].contains(target);
        }
        if (!cancelClose) {
          this.popover.close();
        }
        this.active = this.popover.isOpen();
      }
    }
  }
}
