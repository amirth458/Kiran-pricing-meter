import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-action-cell-renderer',
  templateUrl: './action-cell-renderer.component.html',
})
export class ActionCellRendererComponent implements ICellRendererAngularComp {

  params;

  constructor() { }

  agInit(params): void {
    this.params = params;
    if (!params.action) {
      throw new Error('Missing action parameter for ActionCellRendererComponent');
    }
  }

  onEdit(): void {
    this.params.action.edit(this.params);
  }

  onDelete(): void {
    this.params.action.delete(this.params);
  }
  refresh(): boolean {
    return false;
  }
}
export type CellAction = (params) => void;
