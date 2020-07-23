import { Component, Input, OnInit } from '@angular/core';

import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { PartService } from '../../service/part.service';
import { Address, AddressDelimiter, Part, PartDimension, ProjectProfile, ProjectType } from '../../model/part.model';
import { Util } from '../../util/Util';

@Component({
  selector: 'app-prod-part',
  templateUrl: './prod-part.component.html',
  styleUrls: ['./prod-part.component.css']
})
export class ProdPartComponent implements OnInit {
  @Input() partId: number;
  @Input() unitOptions: Array<any> = [];
  @Input() title = true;

  value: Part | Part[];
  projectProfile: ProjectProfile;
  defProfileText = 'No Requirement Defined';

  constructor(public modalService: NgbModal, public partService: PartService, public spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.spinner.show();
    this.partService.getPartByPartId(this.partId).subscribe(v => {
      this.value = v;
      this.projectProfile = null;
      if (v.rfqMedia && v.rfqMedia.projectRfq && v.rfqMedia.projectRfq.projectProfile) {
        this.projectProfile = v.rfqMedia.projectRfq.projectProfile || null;
      }
      this.spinner.hide();
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
    return Util.shippingAddressInfo(address, AddressDelimiter.HTML_LINE_BREAK);
  }

  getPartDimension(dimension: PartDimension) {
    return Util.getPartDimension(dimension, this.unitOptions);
  }

  getUnit(unitId: number) {
    const result = (this.unitOptions || []).filter(unit => unit.id == unitId);
    return result.length ? result[0].symbol : '';
  }
}
