import { AfterViewInit, Component, ElementRef } from '@angular/core';

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

  refreshCell(): void {
    const el = this.element.nativeElement.querySelector('div');
    // determine tooltip popover
    if (el.offsetWidth < el.scrollWidth) {
      $(el).popover();
    } else {
      $(el).popover('hide');
      $(el).popover('disable');
      $(el).popover('dispose');
    }
  }

  ngAfterViewInit(): void {
    $(() => {
      this.item.api.addEventListener('columnResized', () => this.refreshCell());
      this.refreshCell();
    });
  }

}
