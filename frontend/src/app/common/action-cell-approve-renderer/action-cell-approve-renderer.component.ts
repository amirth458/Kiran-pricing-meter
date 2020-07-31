import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Store } from '@ngrx/store';
import { AppTypes } from '../../store';

@Component({
  selector: 'app-action-cell-approve-renderer',
  templateUrl: './action-cell-approve-renderer.component.html',
  styleUrls: ['./action-cell-approve-renderer.component.css']
})
export class ActionCellApproveRendererComponent implements ICellRendererAngularComp {
  params;

  constructor(private store: Store<any>) {}

  agInit(params): void {
    this.params = params;
    if (!params.action) {
      throw new Error('Missing action parameter for ActionCellRendererComponent');
    }
  }

  refresh(): boolean {
    return false;
  }
  onApprove(): void {
    this.params.action.approve(this.params);
  }

  onDecline(): void {
    this.params.action.decline(this.params);
  }

  onView(): void {
    this.params.action.view(this.params);
  }

  onCommunicate(): void {
    this.store.dispatch({
      type: AppTypes.UpdateSidebarInfo,
      payload: {vendor: this.params.data}
    });
  }

  onEdit(): void {
    this.params.action.edit(this.params);
  }
}
export type CellAction = (params) => void;
