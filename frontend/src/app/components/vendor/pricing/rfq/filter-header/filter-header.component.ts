import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

import { MetadataService } from 'src/app/service/metadata.service';
import { MetadataConfig } from 'src/app/model/metadata.model';
import { AppPartStatus } from 'src/app/model/part.model';

@Component({
  selector: 'app-filter-header',
  templateUrl: './filter-header.component.html',
  styleUrls: ['./filter-header.component.css']
})
export class FilterHeaderComponent implements OnInit {
  @Input() status = 'other';
  @Output() change: EventEmitter<any> = new EventEmitter();

  filterForm: FormGroup;

  partStatusList;

  constructor(public metadataService: MetadataService, public fb: FormBuilder) {
    this.filterForm = this.fb.group({
      partStatusTypeId: [''],
      rfqId: [''],
      partId: [''],
      customerName: ['']
    });

    if (this.status === 'other') {
      this.metadataService
        .getAdminMetaData(MetadataConfig.PART_STATUS)
        .subscribe(
          v =>
            (this.partStatusList = v.filter(
              v => v.name !== AppPartStatus.AUTO_QUOTED && v.name !== AppPartStatus.MANUAL_QUOTE
            ))
        );
    }
  }

  ngOnInit() {
    this.filterForm.valueChanges
      .pipe(
        filter(value => value !== null && !value.type),
        debounceTime(500),
        distinctUntilChanged()
      )
      .subscribe(value => this.change.emit(value));
  }
}
