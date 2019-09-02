import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-column-search-filter',
  templateUrl: './column-search-filter.component.html',
  styleUrls: ['./column-search-filter.component.css'],
})
export class ColumnSearchFilterComponent implements OnInit {

  // Accept this from parent component
  @Input('height') height: string;
  @Input('width') width: string;
  @Input('options') options: Array<string>;
  @Input('searchColumns') searchColumns: Array<{
    name: string,
    checked: boolean,
    query: {
      type: string,
      queryString: string
    }
  }>;
  @Input('filterColumns') filterColumns: Array<
    {
      name: string,
      checked: boolean,
    }>;
  @Input('type') type: Array<string>

  // Visual
  searchColumnsClone = [];
  filterColumnsClone = [];
  activeTab: string;
  showBothTab = false;

  // Storage
  searchColumnsStrorage;
  filterColumnsStrorage;
  constructor() { }

  ngOnInit() {
    this.generateSchema();
    if (this.type.length > 0) {
      this.activeTab = this.type[0];
    } else {
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
    this.searchColumnsStrorage = this.searchColumnsClone;

    this.filterColumns.map((column, index) => {
      this.filterColumnsClone.push({
        ...column,
        id: index
      });
    });
    this.filterColumnsStrorage = this.filterColumnsClone;

  }

  toggleCheck(index, type) {
    if (type === 'search') {
      this.searchColumns[index].checked = !this.searchColumns[index].checked;
      this.searchColumnsClone[index].checked = !this.searchColumnsClone[index].checked;
    } else {

      this.filterColumns[index].checked = !this.filterColumns[index].checked;
      this.filterColumnsClone[index].checked = !this.filterColumnsClone[index].checked;
    }
  }

  toggleTab(tab) {
    this.activeTab = tab;
  }

  search(event, type) {
    const query = event.target.value;
    if (type === 'search') {
      this.searchColumnsClone = this.searchColumnsStrorage.filter(x => x.name.toString().toLowerCase().startsWith(query.toString().toLowerCase()));
    } else {
      this.filterColumnsClone = this.filterColumnsStrorage.filter(x => x.name.toString().toLowerCase().startsWith(query.toString().toLowerCase()));
    }
  }
}
