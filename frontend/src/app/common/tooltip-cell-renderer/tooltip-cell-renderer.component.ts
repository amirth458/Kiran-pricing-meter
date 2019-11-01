import { AfterViewInit, Component, ElementRef} from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid';

declare var $: any;

@Component({
  selector: 'app-tooltip-cell-renderer',
  templateUrl: './tooltip-cell-renderer.component.html',
  styleUrls: ['./tooltip-cell-renderer.component.css']
})
export class TooltipCellRendererComponent implements ICellRendererAngularComp, AfterViewInit  {

  item: ICellRendererParams;

  constructor(private element: ElementRef) { }

  agInit(params): void {
    this.item = params;
  }

  refresh(params: any): boolean {
    return false;
  }

  scrollableElement() {
    return this.element.nativeElement.offsetWidth < this.element.nativeElement.scrollWidth
  }

  ngAfterViewInit(): void {
    $(() => {
      if (this.scrollableElement()) {
        $('[data-toggle="popover"]').popover();
      }
    });
  }

}
