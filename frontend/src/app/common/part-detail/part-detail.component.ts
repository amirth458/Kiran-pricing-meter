import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BidPart } from 'src/app/model/order.model';
import { BidProcessStatusEnum } from 'src/app/model/connect.model';

@Component({
  selector: 'app-part-detail',
  templateUrl: './part-detail.component.html',
  styleUrls: ['./part-detail.component.css']
})
export class PartDetailComponent implements OnInit {
  @Input() part: BidPart;
  @Input() unitOptions: Array<any> = [];

  @Input() connectView = false;
  @Input() proposalPartId = null;
  @Input() comment = null;

  bidStatus = BidProcessStatusEnum;

  constructor(public modalService: NgbModal) {}

  ngOnInit() {}

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

  get tolerance() {
    const result = [];
    if (this.part.tolerance && this.part.tolerance.length) {
      this.part.tolerance.forEach(element => {
        const concat = element.split(':');
        concat.forEach(el => result.push(el));
      });
    }
    return result;
  }

  get displayComment() {
    return (this.comment || '').slice(0, 200);
  }

  getUnit(unitId: number) {
    const result = (this.unitOptions || []).filter(unit => unit.id == unitId);
    return result.length ? result[0].symbol : '';
  }
}
