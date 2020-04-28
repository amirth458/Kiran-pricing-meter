import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-insight-header',
  templateUrl: './insight-header.component.html',
  styleUrls: ['./insight-header.component.css']
})
export class InsightHeaderComponent implements OnInit {
  @Output() queryChange = new EventEmitter();
  @Output() createdDateChange = new EventEmitter();
  @Output() lastAttemptChange = new EventEmitter();

  search = '';

  createdDateRange;
  lastAttemptDate;
  constructor() {}

  ngOnInit() {}

  onSearchChange(ev) {
    this.queryChange.emit(ev);
  }

  onTimeChanged(type, ev) {
    if (type === 'created') {
      this.createdDateChange.emit(ev);
    } else {
      this.lastAttemptChange.emit(ev);
    }
  }
}
