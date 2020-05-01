import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GridOptions, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'app-insight-grid',
  templateUrl: './insight-grid.component.html',
  styleUrls: ['./insight-grid.component.css']
})
export class InsightGridComponent implements OnInit {
  @Input() gridOptions: GridOptions;
  @Input() rowData: any[];
  @Input() totalCount: number;

  @Output() gridReady: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  onGridReady(ev: GridReadyEvent) {
    this.gridReady.emit(ev);
  }
}
