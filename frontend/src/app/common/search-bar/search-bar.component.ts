import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  searchValue = '';

  @Output() searchChange = new EventEmitter();
  @Input()
  get search() {
    return this.searchValue;
  }

  set search(val) {
    this.searchValue = val;
    this.searchChange.emit(this.searchValue);
  }

  constructor() {}

  ngOnInit() {}
}
