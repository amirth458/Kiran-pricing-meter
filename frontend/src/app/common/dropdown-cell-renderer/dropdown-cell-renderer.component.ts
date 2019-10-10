import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-dropdown-cell-renderer',
  styleUrls: ['./dropdown-cell-renderer.component.css'],
  templateUrl: './dropdown-cell-renderer.component.html',
})
export class DropdownCellRendererComponent implements ICellRendererAngularComp {

  params;
  options = [];
  value = '';
  constructor() { }

  agInit(params): void {
    this.params = params;
    if (!this.params.data[this.params.colDef.field + 'Options']) {
      throw new Error('Missing options parameter for DropdownCellRendererComponent');
    }
    this.options = this.params.data[this.params.colDef.field + 'Options'];
    if (!params.change) {
      throw new Error('Missing change handler for DropdownCellRendererComponent');
    }
    if (this.params.data[this.params.colDef.field]) {
      this.value = this.params.data[this.params.colDef.field];
    }
  }

  onChange(): void {
    this.params.change(this.params, this.value);
  }

  refresh(): boolean {
    return false;
  }
}
export type CellAction = (params) => void;
