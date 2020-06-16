import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent implements OnInit {
  filter: FormControl;

  @Output() searchChange = new EventEmitter();
  @Input()
  get search() {
    return this.filter.value;
  }
  set search(value) {
    this.filter.setValue(value);
  }

  constructor() {
    this.filter = new FormControl(null);
  }

  ngOnInit() {
    this.filter.valueChanges
      .pipe(
        filter(value => value !== null),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => this.searchChange.emit(value));
  }
}
