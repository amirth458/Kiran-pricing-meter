import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';

import { BidProcessStatusEnum } from '../../model/connect.model';
import { Part } from 'src/app/model/part.model';
@Component({
  selector: 'app-part-list',
  templateUrl: './part-list.component.html',
  styleUrls: ['./part-list.component.css']
})
export class PartListComponent implements OnInit {
  @Input()
  set parts(parts: Part[]) {
    this.partList = parts || [];
    if (this.partList.length) {
      this.changeSelected(this.partList[0]);
    }
  }
  get parts() {
    return this.partList;
  }
  @Input() showRefFile = false;
  @Input() selectable = false;

  @Output() toggleSelection: EventEmitter<any> = new EventEmitter<any>();

  status = BidProcessStatusEnum;

  partList: Part[] = [];
  selected = null;

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

  changeSelected(part) {
    this.selected = part.partId;
    this.toggleSelection.emit(part);
  }
}
