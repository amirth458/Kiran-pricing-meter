import { Component, OnInit, Input } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import { StatusTypes } from '../../model/connect.model';
import { Part } from 'src/app/model/part.model';
@Component({
  selector: 'app-part-list',
  templateUrl: './part-list.component.html',
  styleUrls: ['./part-list.component.css']
})
export class PartListComponent implements OnInit {
  @Input() parts: Part[];
  @Input() showRefFile = false;

  status = StatusTypes;

  constructor(public spinner: NgxSpinnerService, public modalService: NgbModal) {}

  ngOnInit() {}

  preparePostProcessValues(ids: Array<number>) {
    // return Util.preparePostProcessValues(this.postProcessAction, ids);
  }

  open(content, size: any = 'lg') {
    this.modalService
      .open(content, {
        size,
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      })
      .result.then(
        result => {},
        reason => {}
      );
  }
}
