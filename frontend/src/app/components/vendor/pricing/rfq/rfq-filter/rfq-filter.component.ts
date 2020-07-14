import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';

import { RfqFilter } from '../../../../../model/part.model';
import { Util } from '../../../../../util/Util';

@Component({
  selector: 'app-rfq-filter',
  templateUrl: './rfq-filter.component.html',
  styleUrls: ['./rfq-filter.component.css']
})
export class RfqFilterComponent implements OnInit {
  @Input() placeholder: string;
  @Output()
  formChange: EventEmitter<RfqFilter> = new EventEmitter<RfqFilter>(null);
  formGroup: FormGroup = this.fb.group({
    query: [''],
    dateRange: [Util.getDateRange()]
  });

  constructor(public fb: FormBuilder) {}

  ngOnInit() {
    this.formGroup.valueChanges
      .pipe(startWith({ dateRange: Util.getDateRange() }), debounceTime(500), distinctUntilChanged())
      .subscribe((value: any) => this.formChange.emit(value));
  }
}
