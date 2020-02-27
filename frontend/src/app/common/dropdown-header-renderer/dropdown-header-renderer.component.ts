import { Component } from '@angular/core';
import { IHeaderAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-dropdown-header-renderer',
  styleUrls: ['./dropdown-header-renderer.component.css'],
  templateUrl: './dropdown-header-renderer.component.html'
})
export class DropdownHeaderRendererComponent implements IHeaderAngularComp {
  params;
  options = [];
  value = '';
  constructor() {}

  agInit(params): void {
    this.params = params;
    // if (!this.params.data[this.params.colDef.field + 'Options']) {
    //   throw new Error('Missing options parameter for DropdownCellRendererComponent');
    // }
    // this.options = this.params.data[this.params.colDef.field + 'Options'];
    // if (!params.change) {
    //   throw new Error('Missing change handler for DropdownCellRendererComponent');
    // }
    // if (this.params.data[this.params.colDef.field]) {
    //   this.value = this.params.data[this.params.colDef.field];
    // }
  }

  onClick(event): void {
    this.params.column.colDef.headerRendererParams.action.dropdown();
  }
  refresh(): boolean {
    return false;
  }
}
export type CellAction = (params) => void;
