import { Component } from '@angular/core';
import { ICellRendererAngularComp, ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-multi-select-cell-renderer',
  styleUrls: ['./multi-select-cell-renderer.component.css'],
  templateUrl: './multi-select-cell-renderer.component.html',
})
export class MultiSelectCellRendererComponent implements ICellEditorAngularComp {

  params;
  options = [];
  value = [];
  equipment = '';
  items = [];
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
      if (Array.isArray(this.params.data[this.params.colDef.field])) {
        this.params.data[this.params.colDef.field].map(item => {
          if (Array.isArray(item)) {
            this.value = [...this.value, ...item];
          } else {
            this.value.push(item);
          }
        });

      } else {
        this.value = [this.params.data[this.params.colDef.field]];
      }
    }
    // console.log({ options: this.options });
    this.items = [];
    this.value.map(item => {
      this.items.push(this.options.find(option => option.id == item));
    });


  }

  refresh(): boolean {
    return false;
  }

  getValue = () => this.value;
  isPopUp = () => true;
}
export type CellAction = (params) => void;
