import { Component, OnInit, Input, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
import { GridOptions, GridReadyEvent } from 'ag-grid-community';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { Util } from '../../../../util/Util';
import { LinkCellRendererComponent } from 'src/app/common/link-cell-renderer/link-cell-renderer.component';
@Component({
  selector: 'app-insight-grid',
  templateUrl: './insight-grid.component.html',
  styleUrls: ['./insight-grid.component.css']
})
export class InsightGridComponent implements OnInit {
  @Input() gridOptions: GridOptions;
  @Input() rowData: any[];

  @Output() gridReady: EventEmitter<any> = new EventEmitter();
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent,
    linkCellRenderer: LinkCellRendererComponent
  };
  @ViewChild('date') date: ElementRef;
  util = Util;
  constructor() {}

  ngOnInit() {
    this.gridOptions.frameworkComponents = this.frameworkComponents;
    this.gridOptions.columnDefs = this.gridOptions.columnDefs.map(col => {
      if (
        (col.headerTooltip.includes('date') ||
          col.headerTooltip.includes('last_login') ||
          col.headerTooltip.includes('time')) &&
        col.headerTooltip != 'rfq_quote_time'
      ) {
        return {
          ...col,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.date
          }
        };
      }
      return col;
    });
  }

  onGridReady(ev: GridReadyEvent) {
    this.gridReady.emit(ev);
  }
}
