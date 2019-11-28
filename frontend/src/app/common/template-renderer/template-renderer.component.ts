import { Component, TemplateRef } from '@angular/core';
import { AgEditorComponent, ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid';

// Reference: https://www.ag-grid.com/javascript-grid-cell-editor/angular.php

@Component({
  selector: 'app-template-renderer',
  template: `
    <ng-container
      *ngTemplateOutlet="template; context: templateContext"
    ></ng-container>
  `
})
export class TemplateRendererComponent implements ICellRendererAngularComp, AgEditorComponent {
  template: TemplateRef<any>;
  templateContext: { $implicit: any, params: any };
  params: any;

  refresh(params: any): boolean {
    this.templateContext = {
      $implicit: params.data,
      params: params
    };
    return true;
  }

  agInit(params: any): void {
    params.cellStartedEdit = params.hasOwnProperty('cellStartedEdit');
    this.template = params['ngTemplate'];
    this.params = params;
    this.refresh(params);
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {
    // TODO: analysis required
  }

  focusIn(): void {
    // TODO: analysis required
  }

  focusOut(): void {
    // TODO: analysis required
  }

  getFrameworkComponentInstance(): any {
    // TODO: analysis required
  }

  getValue(): any {
    const fieldDef = this.params.colDef.field.split('.');
    if ( fieldDef.length > 0 ) {
      let val = this.params.data;
      for (let key in fieldDef) {
        val = val[fieldDef[key]] || {};
      }
      return val;
    }
    return this.params.data[this.params.colDef.field];
  }

  isCancelAfterEnd(): boolean {
    // TODO: analysis required
    return false;
  }

  isCancelBeforeStart(): boolean {
    // TODO: analysis required
    return false;
  }

  isPopup(): boolean {
    // TODO: analysis required
    return false;
  }

}
