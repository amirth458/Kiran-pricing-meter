import { Component, OnInit } from '@angular/core';
import { IFilterAngularComp } from 'ag-grid-angular';
import { IFilterParams, IDoesFilterPassParams } from 'ag-grid-community';

@Component({
  selector: 'app-status-dropdown-filter',
  templateUrl: './status-dropdown-filter.component.html',
  styleUrls: ['./status-dropdown-filter.component.css']
})
export class StatusDropdownFilterComponent implements IFilterAngularComp {
  status = 0;
  private params: IFilterParams;
  constructor() { }

  agInit(params: IFilterParams) {
    this.params = params;
  }

  isFilterActive(): boolean {
    return this.status !== 0;
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    const status = this.status === 1 ? 'RESPONDED' : 'NOTRESPONDED';
    return params.node.data.status === status;
  }

  getModel(): any {
    return {value: this.status};
  }

  setModel(model: any): void {
    this.status = model ? model.value : 0;
  }

  statusChange(id): void {
    this.status = id;
    this.params.filterChangedCallback();
  }
}
