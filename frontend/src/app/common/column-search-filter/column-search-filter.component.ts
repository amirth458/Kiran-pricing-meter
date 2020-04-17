import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-column-search-filter',
  templateUrl: './column-search-filter.component.html',
  styleUrls: ['./column-search-filter.component.css']
})
export class ColumnSearchFilterComponent implements OnInit {
  @Input('height') height: string;
  @Input('width') width: string;

  @Output() public searchColumnsChange: EventEmitter<
    Array<{
      name: string;
      checked: boolean;
      query: {
        type: string;
        filter: string;
      };
    }>
  > = new EventEmitter();
  @Output() public filterColumnsChange: EventEmitter<
    Array<{
      name: string;
      checked: boolean;
    }>
  > = new EventEmitter();

  @Input('options') options: Array<string>;
  @Input('searchColumns') searchColumns: Array<{
    name: string;
    field: string;
    checked: boolean;
    query: {
      type: string;
      filter: string;
    };
  }>;
  @Input('filterColumns') filterColumns: Array<{
    name: string;
    field: string;
    checked: boolean;
  }>;
  @Input('type') type: Array<string>;

  // Visual
  searchColumnsClone = [];
  filterColumnsClone = [];
  activeTab: string;
  showBothTab = false;

  // Storage
  searchColumnsStorage;
  filterColumnsStorage;
  constructor() {}

  ngOnInit() {
    this.generateSchema();
    if (this.type.length > 0) {
      this.activeTab = 'search';
    }

    if (this.type.length > 1) {
      this.showBothTab = true;
    }
  }

  generateSchema() {
    this.searchColumns.map((column, index) => {
      this.searchColumnsClone.push({
        ...column,
        id: index
      });
    });
    this.searchColumnsStorage = this.searchColumnsClone;

    this.filterColumns.map((column, index) => {
      this.filterColumnsClone.push({
        ...column,
        id: index
      });
    });
    this.filterColumnsStorage = this.filterColumnsClone;
  }

  toggleCheck(index, type) {
    if (type === 'search') {
      this.searchColumnsClone[index].checked = !this.searchColumnsClone[index].checked;
      this.searchColumns.map((item, i) => {
        if (item.field === this.searchColumnsClone[index].field) {
          this.searchColumns[i].checked = !this.searchColumns[i].checked;
        }
      });
      this.searchColumnsChange.emit(this.searchColumns);
    } else {
      this.filterColumnsClone[index].checked = !this.filterColumnsClone[index].checked;
      this.filterColumns.map((item, i) => {
        if (item.field === this.filterColumnsClone[index].field) {
          this.filterColumns[i].checked = !this.filterColumns[i].checked;
        }
      });
      this.filterColumnsChange.emit(this.filterColumns);
    }
  }

  toggleTab(tab) {
    this.activeTab = tab;
  }

  search(event, type) {
    const query = event.target.value;
    if (type === 'search') {
      this.searchColumnsClone = this.searchColumnsStorage.filter(x =>
        x.name
          .toString()
          .toLowerCase()
          .startsWith(query.toString().toLowerCase())
      );
    } else {
      this.filterColumnsClone = this.filterColumnsStorage.filter(x =>
        x.name
          .toString()
          .toLowerCase()
          .startsWith(query.toString().toLowerCase())
      );
    }
  }
}
