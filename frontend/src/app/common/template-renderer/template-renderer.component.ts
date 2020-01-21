import { AfterViewInit, Component, ElementRef, TemplateRef } from '@angular/core';
import { AgEditorComponent, ICellRendererAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid';

// Reference: https://www.ag-grid.com/javascript-grid-cell-editor/angular.php
declare var $: any;

@Component({
  selector: 'app-template-renderer',
  template: `
    <ng-container
      *ngTemplateOutlet="template; context: templateContext"
    ></ng-container>
  `
})
export class TemplateRendererComponent implements ICellRendererAngularComp, AgEditorComponent, AfterViewInit  {
  template: TemplateRef<any>;
  templateContext: { $implicit: any, params: any, refreshCell: any };
  params: any;
  tooltipCell = false;

  constructor(private element: ElementRef) { }

  refresh(params: any): boolean {
    this.templateContext = {
      $implicit: params.data,
      params,
      refreshCell: this.refreshCell
    };
    return true;
  }

  agInit(params: any): void {
    params.cellStartedEdit = params.hasOwnProperty('cellStartedEdit');
    if (!params.cellStartedEdit && params.colDef.cellRendererParams && params.colDef.cellRendererParams.tooltipCell) {
      this.tooltipCell = params.colDef.cellRendererParams.tooltipCell;
      $(this.element.nativeElement).addClass('tooltip-cell');
    }
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

  refreshCell(): void {
    const el = this.element.nativeElement.querySelector('div');
    // determine tooltip popover
    if (el && (el.offsetWidth < el.scrollWidth)) {
      $(el).popover();
    } else {
      $(el).popover('hide');
      $(el).popover('disable');
      $(el).popover('dispose');
    }
  }

  ngAfterViewInit(): void {
    if (this.tooltipCell) {
      $(() => {
        this.params.api.addEventListener('columnResized', () => this.refreshCell());
        this.refreshCell();
      });
    }
  }

}
