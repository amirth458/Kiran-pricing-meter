import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from './../../../../../environments/environment';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-insight-header',
  templateUrl: './insight-header.component.html',
  styleUrls: ['./insight-header.component.css']
})
export class InsightHeaderComponent implements OnInit {
  @ViewChild('filterColumns') filterColumns;
  @ViewChild('exportModal') exportModal;

  @Input() type;
  @Input() columns;
  @Input() gridOptions: GridOptions;
  @Output() filterColumnsChange = new EventEmitter();
  @Output() queryChange = new EventEmitter();
  @Output() createdDateChange = new EventEmitter();
  @Output() lastAttemptChange = new EventEmitter();

  @Output() download = new EventEmitter();
  @Output() uploadToZoho = new EventEmitter();

  env = environment.env;

  search = '';

  createdDateRange;
  lastAttemptDate;
  columnsClone = [];

  constructor(public modal: NgbModal, public toastr: ToastrService) {}

  ngOnInit() {
    const date = new Date();
    this.createdDateRange = [
      this.type === 'bid'
        ? new Date(date.getFullYear(), date.getMonth(), date.getDate() - 7)
        : new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30),
      new Date(date.getFullYear(), date.getMonth(), date.getDate())
    ];
    this.onTimeChanged('created');

    this.columnsClone = this.columns.map(item => ({
      name: item.headerName,
      hide: false
    }));
  }

  onFilterColumnsChange() {
    this.modal.dismissAll();
    this.filterColumnsChange.emit(this.columnsClone);
  }

  onSearchChange(ev) {
    this.queryChange.emit(ev);
  }

  get enableControls() {
    return this.gridOptions && this.gridOptions.api
      ? this.gridOptions.api.getDisplayedRowCount() > 0 &&
          //  TODO:
          // This can be removed once empty row rendering issue is fixed
          (this.gridOptions.api.getRowNode('0') ? this.gridOptions.api.getRowNode('0').data != null : false)
      : false;
  }

  onTimeChanged(type) {
    if (type === 'created') {
      if (this.createdDateRange[1] - this.createdDateRange[0] <= 30 * 24 * 3600 * 1000) {
        this.createdDateChange.emit(this.createdDateRange);
      } else {
        this.toastr.warning('The duration should be less than or equal to 30 days');
      }
    } else {
      this.lastAttemptChange.emit(this.lastAttemptDate);
    }
  }

  hasLastAttempt() {
    return ['customer', 'vendor'].includes(this.type);
  }

  setColumnVisibility(column) {
    this.columnsClone = this.columnsClone.map(item => ({
      ...item,
      hide: column.name === item.name ? !item.hide : item.hide
    }));
  }

  onFiltercolumns() {
    this.modal.open(this.filterColumns, {
      centered: true
    });
  }

  onExport() {
    this.modal.open(this.exportModal, {
      centered: true
    });
  }

  onDownload() {
    this.download.emit();
    this.modal.dismissAll();
  }

  onUploadToZoho() {
    this.uploadToZoho.emit();
    this.modal.dismissAll();
  }
}
