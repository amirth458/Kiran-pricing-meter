import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { environment } from './../../../../../environments/environment';

@Component({
  selector: 'app-insight-header',
  templateUrl: './insight-header.component.html',
  styleUrls: ['./insight-header.component.css']
})
export class InsightHeaderComponent implements OnInit {
  @ViewChild('filterColumns') filterColumns;

  @Input() type;
  @Input() columns;
  @Output() filterColumnsChange = new EventEmitter();
  @Output() queryChange = new EventEmitter();
  @Output() createdDateChange = new EventEmitter();
  @Output() lastAttemptChange = new EventEmitter();

  env = environment.env;

  search = '';

  createdDateRange;
  lastAttemptDate;
  columnsClone = [];

  constructor(public modal: NgbModal, public toastr: ToastrService) {}

  ngOnInit() {
    const date = new Date();
    this.createdDateRange = [
      new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30),
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

  onTimeChanged(type) {
    if (type === 'created') {
      console.log(this.createdDateRange[1] - this.createdDateRange[0]);
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
}
