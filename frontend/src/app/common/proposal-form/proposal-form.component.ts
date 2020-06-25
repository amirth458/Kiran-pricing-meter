import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';

import { forkJoin } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { GovernanceMediaEnum, Part, PartDimension, RfqMedia } from '../../model/part.model';
import { ProjectService } from '../../service/project.service';
import { Util } from '../../util/Util';
import { OrdersService } from 'src/app/service/orders.service';
import { RfqPricingService } from 'src/app/service/rfq-pricing.service';
import { mergeMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-proposal-form',
  templateUrl: './proposal-form.component.html',
  styleUrls: ['./proposal-form.component.css']
})
export class ProposalFormComponent implements OnInit {
  @Input() values: Array<number>;
  @Input() partIds: Array<number>;
  @Input() vendorId: number;

  tabs: Array<{
    id: number;
    part: Part;
    proposal: Part;
  }> = [];
  active: number;
  measurementUnits: any;
  isCustomerAgreed = false;
  util = Util;

  governanceMediaEnum = GovernanceMediaEnum;
  parts: Part[] = [];
  constructor(
    public modalService: NgbModal,
    public projectService: ProjectService,
    public spinner: NgxSpinnerService,
    public metadataService: OrdersService,
    public toaster: ToastrService,
    public rfqService: RfqPricingService
  ) {}

  ngOnInit() {
    this.metadataService.getAllMeasurementUnitType().subscribe(v => {
      this.measurementUnits = v.metadataList;
    });
  }

  getMediaBackgroundImage(rfqMedia: RfqMedia) {
    const image = rfqMedia.media && rfqMedia.media.partDimension && rfqMedia.media.partDimension.thumbnail400Location;
    return {
      'background-image': `url(${image || './assets/image/no-preview.jpg'})`
    };
  }

  openForm(templateRef: TemplateRef<any>, size: any = 'lg') {
    this.spinner.show();
    const partArr = (this.partIds || []).map(partId => this.rfqService.getPartDetail(partId));
    const arr = (this.values || []).map(id => this.projectService.getProposalFormData(id));
    forkJoin(arr)
      .pipe(
        mergeMap(proposalParts => {
          return forkJoin(partArr).pipe(
            map(partDetails => {
              return { proposalParts, partDetails };
            })
          );
        })
      )
      .subscribe((response: { proposalParts: any; partDetails: Part[] }) => {
        this.parts = response.partDetails;
        (response.proposalParts || []).map(prop => {
          const v = (this.parts || []).filter(p => p.id === prop.parentPartId);
          this.tabs.push({
            id: prop.parentPartId,
            proposal: prop,
            part: v.length > 0 ? v[0] : null
          });
        });
        this.active = this.tabs.length > 0 ? this.tabs[0].id : 0;
        this.spinner.hide();
        const modal = this.modalService.open(templateRef, {
          centered: true,
          size,
          windowClass: 'proposal-form-modal'
        });
        modal.result.then(
          () => {},
          () => {
            this.tabs.length = 0;
            this.isCustomerAgreed = false;
          }
        );
      });
  }

  getDimension(rfqMedia: RfqMedia) {
    return rfqMedia && rfqMedia.media && Util.getPartDimension(rfqMedia.media.partDimension, this.measurementUnits);
  }

  getVolume(partDimension: PartDimension) {
    const unit = this.measurementUnits.find(item => item.id === partDimension.volume.unitId);
    return `${partDimension.volume.value} cu${unit ? unit.symbol : ''}`;
  }
}
