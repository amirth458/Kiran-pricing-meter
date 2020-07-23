import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest } from 'rxjs';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { BiddingService } from '../../../../service/bidding.service';
import { BidPart } from '../../../../model/part.model';
import { MetadataService } from '../../../../service/metadata.service';
import { MetadataConfig } from '../../../../model/metadata.model';
import {
  AdminProposalRequest,
  ProposalPartDimension,
  ProposalPartQuote,
  ProposalTypeEnum
} from '../../../../model/bidding.order';
import { OrdersService } from '../../../../service/orders.service';
import { ProposalService } from '../../../../service/proposal.service';
import { Util } from '../../../../util/Util';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {
  offerId: number;
  vendorId: number;
  proposalInfo: BidPart[];
  refMedia: any;

  measurementUnits: any;
  invoiceItems: any;
  proposalType = ProposalTypeEnum.VENDOR_PROPOSAL_TYPE;
  proposalTypeEnum = ProposalTypeEnum;

  get totalCost() {
    return (this.proposalInfo || []).reduce((sum: number, part: BidPart) => {
      const quote = part.partQuoteCustomerView;
      sum += quote.totalCost || 0;
      return sum;
    }, 0);
  }

  constructor(
    public route: Router,
    public router: ActivatedRoute,
    public biddingService: BiddingService,
    public metaDataService: MetadataService,
    public proposalService: ProposalService,
    public orderService: OrdersService,
    public toasterService: ToastrService,
    public spinner: NgxSpinnerService
  ) {
    this.refMedia = {};
    combineLatest(this.router.params, this.router.parent.params).subscribe(v => {
      const params: any = { ...v[0], ...v[1] };
      this.offerId = params.bidPmProjectId || null;
      this.vendorId = params.vendorId || null;
    });
    this.metaDataService.getAdminMetaData(MetadataConfig.MEASUREMENT_UNIT_TYPE).subscribe(res => {
      this.measurementUnits = res;
    });
    this.metaDataService.getProcessMetaData('invoice_item').subscribe(v => (this.invoiceItems = v));
  }

  ngOnInit() {
    this.getVendorProposal();
  }

  getMediaBackgroundImage(location: string) {
    return {
      'background-image': `url(${location || './assets/image/no-preview.jpg'})`
    };
  }

  getDimension(part: BidPart) {
    if (!((this.measurementUnits || []).length > 0 && part)) {
      return '';
    }
    const arr = [];
    if (part.x && part.x.unitId) {
      const xUnit = this.findUnitById(part.x.unitId);
      arr.push(`${part.x.value} ${xUnit.symbol || ''}`);
    }
    if (part.y && part.y.unitId) {
      const yUnit = this.findUnitById(part.y.unitId);
      arr.push(`${part.y.value} ${yUnit.symbol || ''}`);
    }
    if (part.z && part.z.unitId) {
      const zUnit = this.findUnitById(part.z.unitId);
      arr.push(`${part.z.value} ${zUnit.symbol || ''}`);
    }
    return arr.join(' x ');
  }

  getVolume(part: BidPart) {
    if (!((this.measurementUnits || []).length > 0 && part)) {
      return '';
    }
    let volume = '';
    if (part.volume && part.volume.unitId) {
      const volumeUnit = this.findUnitById(part.volume.unitId);
      volume = `${part.volume.value || 0} ${volumeUnit.symbol || ''}`;
    }
    return volume;
  }

  findUnitById(id: number) {
    const units = (this.measurementUnits || []).filter(unit => unit.id === id);
    return units.length > 0 ? units[0] : null;
  }

  getVendorProposal() {
    this.biddingService.getDetailedPartInfo(this.offerId, this.vendorId).subscribe(offerInfo => {
      this.proposalInfo = offerInfo || [];
      (this.proposalInfo || []).map(proposal => {
        this.getReferenceFiles(proposal.partId);
      });
    });
  }

  async getReferenceFiles(partId: number) {
    try {
      this.refMedia[partId] = await this.orderService.getReferenceFiles(partId).toPromise();
    } catch (error) {
      this.refMedia[partId] = [];
    }
  }

  createAdminProposal() {
    const arr: Array<AdminProposalRequest> = (this.proposalInfo || []).map(proposal => {
      const dimension: ProposalPartDimension = {
        x: {
          unitId: proposal.x.unitId,
          value: proposal.x.value
        },
        y: {
          unitId: proposal.y.unitId,
          value: proposal.y.value
        },
        z: {
          unitId: proposal.z.unitId,
          value: proposal.z.value
        },
        volume: {
          unitId: proposal.volume.unitId,
          value: proposal.volume.value
        },
        surfaceArea: {
          unitId: proposal.surfaceArea.unitId,
          value: proposal.surfaceArea.value
        },
        thumbnail100Location: proposal.thumbnail100Location,
        thumbnail200Location: proposal.thumbnail200Location,
        thumbnail400Location: proposal.thumbnail400Location
      };
      const customerQuote = proposal.partQuoteCustomerView;
      const partQuote: ProposalPartQuote = {
        isAdminQuote: true,
        expiredAt: Util.extendUtcDate(customerQuote.expiredAt),
        isManualPricing: false,
        isGlobalRule: false,
        isAutoQuoteOverride: false,
        globalRuleReason: [],
        partQuoteDetailList: (customerQuote.partQuoteDetails || []).map(q => {
          return {
            extendedCost: 0,
            invoiceCost: q.value,
            invoiceItemId: q.invoiceItemId,
            invoiceLineItemId: null,
            partQuoteId: q.partQuoteId,
            processPricingConditionTypeId: null,
            unit: q.unit,
            unitPrice: q.unitPrice
          };
        }),
        totalCost: customerQuote.totalCost,
        adminMargin: 0,
        vendorId: customerQuote.vendorId
      };
      const mediaFiles = this.refMedia[proposal.partId] || [];
      return {
        part: {
          materialPropertyType: proposal.materialPropertyType,
          materialPropertyValues: proposal.materialPropertyValues,
          equipmentPropertyType: proposal.equipmentPropertyType,
          equipmentPropertyValues: proposal.equipmentPropertyValues,
          cuttingBondingAllowed: false,
          quantity: proposal.quantity,
          targetDeliveryDate: proposal.deliveryDate,
          manualPricingAllowed: false,
          parentPartId: proposal.partId,
          comments: proposal.comments || null,
          rfqMedia: {
            media: {
              connectorServiceId: proposal.connectorServiceId,
              uploadedAt: null,
              location: proposal.filePath,
              name: proposal.fileName,
              partDimension: dimension
            }
          },
          postProcessTypeIds: proposal.postProcessTypeIds
        },
        partQuote,
        partDimensionUpdated: false,
        referenceMedias: (mediaFiles || []).map(file => {
          return {
            name: file.name,
            uploadedAt: file.uploadedAt,
            location: file.location
          };
        })
      };
    });
    const proposalsReq = [];
    (arr || []).map(proposalReq => {
      proposalsReq.push(this.proposalService.createAdminProposal(proposalReq));
    });
    this.spinner.show();
    combineLatest(proposalsReq).subscribe(v => {
      console.log(v);
      this.toasterService.success('Admin proposal successfully added!');
      this.spinner.hide();
    });
  }
}
