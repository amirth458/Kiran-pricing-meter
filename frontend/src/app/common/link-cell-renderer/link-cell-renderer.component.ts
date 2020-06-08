import { Component } from '@angular/core';
import { ILoadingCellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-link-cell-renderer',
  templateUrl: './link-cell-renderer.component.html',
  styleUrls: ['./link-cell-renderer.component.css']
})
export class LinkCellRendererComponent implements ILoadingCellRendererAngularComp {
  params;

  constructor() {}

  agInit(params): void {
    this.params = params;
    if (!params.action) {
      throw new Error('Missing action parameter for LinkCellRendererComponent');
    }
  }

  refresh(): boolean {
    return false;
  }

  onClick() {
    this.params.action(this.params);
  }
}
