import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BidPart } from 'src/app/model/order.model';
import { PartService } from '../../service/part.service';
import { Address, AddressDelimiter, Part, PartDimension, ProjectProfile } from '../../model/part.model';
import { Util } from '../../util/Util';

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

  value: Part;
  projectProfile: ProjectProfile;

  constructor(public modalService: NgbModal, public partService: PartService) {}

  ngOnInit() {
    this.partService.getPartByPartId(this.part.partId).subscribe(v => {
      this.value = v;
      if (v.rfqMedia && v.rfqMedia.projectRfq && v.rfqMedia.projectRfq.projectProfile) {
        this.projectProfile = v.rfqMedia.projectRfq.projectProfile;
      }
    });
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

  shippingAddressInfo(address: Address): string {
    return Util.shippingAddressInfo(address, AddressDelimiter.COMMA_SEPARATOR);
  }

  getPartDimension(dimension: PartDimension) {
    return Util.getPartDimension(dimension, this.unitOptions);
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
