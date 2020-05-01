import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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

  search = '';

  createdDateRange;
  lastAttemptDate;
  columnsClone = [];

  constructor(public modal: NgbModal) {}

  ngOnInit() {
    const date = new Date();
    this.createdDateRange = [new Date(date.getFullYear(), date.getMonth(), 1), date];
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
      this.createdDateChange.emit(this.createdDateRange);
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
