import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { BiddingService } from '../../../../service/bidding.service';
import { Part, PartDimension, RfqMedia } from '../../../../model/part.model';
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
import { PartQuoteCustomerView } from '../../../../model/connect.model';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {
  offerId: number;
  vendorId: number;
  proposalPartIds: Array<number>;
  quoteList: PartQuoteCustomerView[];
  partInfo: any;
  refMedia: any;

  measurementUnits: any;
  invoiceItems: any;

  protected proposalType = ProposalTypeEnum.VENDOR_PROPOSAL_TYPE;
  proposalTypeEnum = ProposalTypeEnum;

  get totalCost() {
    return (this.quoteList || []).reduce((sum: number, quote: PartQuoteCustomerView) => {
      if (quote) {
        sum += quote.totalCost || 0;
      }
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
    this.partInfo = {};
    this.refMedia = {};
    this.quoteList = [];
    combineLatest(this.router.params, this.router.parent.params).subscribe(v => {
      const params: any = { ...v[0], ...v[1] };
      this.offerId = params.bidPmProjectId || null;
      this.vendorId = params.vendorId || null;
      if (params.proposalPartIds) {
        this.proposalPartIds = (params.proposalPartIds || '').split(',') as Array<number>;
      }
    });
    this.metaDataService.getAdminMetaData(MetadataConfig.MEASUREMENT_UNIT_TYPE).subscribe(res => {
      this.measurementUnits = res;
    });
    this.metaDataService.getProcessMetaData('invoice_item').subscribe(v => (this.invoiceItems = v));
  }

  ngOnInit() {
    if (this.proposalType === this.proposalTypeEnum.VENDOR_PROPOSAL_TYPE) {
      this.fetchPartsAndQuote();
    } else {
      this.getAdminPartQuote();
    }
  }

  getMediaBackgroundImage(rfqMedia: RfqMedia) {
    const image = rfqMedia.media && rfqMedia.media.partDimension && rfqMedia.media.partDimension.thumbnail400Location;
    return {
      'background-image': `url(${image || './assets/image/no-preview.jpg'})`
    };
  }

  fetchPartsAndQuote() {
    this.biddingService.getDetailedPartInfo(this.offerId, this.vendorId).subscribe(parts => {
      (parts || []).map(p => {
        this.quoteList.push(p.partQuoteCustomerView);
      });
      this.getProposalPartByIds((this.quoteList || []).map(quote => quote.proposalPartId));
    });
  }

  getAdminPartQuote() {
    this.proposalService.getAdminPartQuote(this.proposalPartIds).subscribe(quotes => {
      (quotes || []).map(p => {
        this.quoteList.push(p);
      });
      this.getProposalPartByIds(this.proposalPartIds);
    });
  }

  getProposalPartByIds(ids: Array<number>) {
    this.proposalService.getProposalPartByIds(ids).subscribe(parts => {
      (parts || []).map(p => {
        this.partInfo[p.id] = p;
        this.getReferenceFiles(p.id);
      });
    });
  }

  getDimension(rfqMedia: RfqMedia) {
    return rfqMedia && rfqMedia.media && Util.getPartDimension(rfqMedia.media.partDimension, this.measurementUnits);
  }

  getVolume(partDimension: PartDimension) {
    let unitId = partDimension.volume.unitId;
    if (!unitId) {
      unitId = partDimension.x.unitId;
    }
    const unit = this.measurementUnits.find(item => item.id === unitId);
    return `${partDimension.volume.value} ${unit.symbol}`;
  }

  findUnitById(id: number) {
    const units = (this.measurementUnits || []).filter(unit => unit.id === id);
    return units.length > 0 ? units[0] : null;
  }

  async getReferenceFiles(partId: number) {
    try {
      this.refMedia[partId] = await this.orderService.getReferenceFiles(partId).toPromise();
    } catch (error) {
      this.refMedia[partId] = [];
    }
  }

  createAdminProposal() {
    const arr: Array<AdminProposalRequest> = Object.keys(this.partInfo || []).map(id => {
      const proposal: Part = this.partInfo[id];
      let partDimension: PartDimension = null;
      const media = proposal.rfqMedia.media;
      if (proposal.rfqMedia && proposal.rfqMedia.media && proposal.rfqMedia.media.partDimension) {
        partDimension = proposal.rfqMedia.media.partDimension;
      }
      const dimension: ProposalPartDimension = {
        x: {
          unitId: partDimension ? partDimension.x.unitId : null,
          value: partDimension ? partDimension.x.value : null
        },
        y: {
          unitId: partDimension ? partDimension.y.unitId : null,
          value: partDimension ? partDimension.y.value : null
        },
        z: {
          unitId: partDimension ? partDimension.z.unitId : null,
          value: partDimension ? partDimension.z.value : null
        },
        volume: {
          unitId: partDimension ? partDimension.volume.unitId : null,
          value: partDimension ? partDimension.volume.unitId : null
        },
        surfaceArea: {
          unitId: partDimension ? partDimension.surfaceArea.unitId : null,
          value: partDimension ? partDimension.surfaceArea.unitId : null
        },
        thumbnail100Location: partDimension ? partDimension.thumbnail100Location : null,
        thumbnail200Location: partDimension ? partDimension.thumbnail200Location : null,
        thumbnail400Location: partDimension ? partDimension.thumbnail400Location : null
      };
      const quote = (this.quoteList || []).filter(q => q.proposalPartId === proposal.id);
      const customerQuote = quote.length > 0 ? quote[0] : null;
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
          targetDeliveryDate: Util.extendUtcDate(proposal.targetDeliveryDate),
          manualPricingAllowed: false,
          parentPartId: proposal.parentPartId,
          comments: proposal.comments || null,
          rfqMedia: {
            media: {
              connectorServiceId: media.connectorServiceId,
              uploadedAt: null,
              location: media.location,
              name: media.name,
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
      } as AdminProposalRequest;
    });
    const proposalsReq = [];
    (arr || []).map(proposalReq => {
      proposalsReq.push(this.proposalService.createAdminProposal(proposalReq));
    });
    this.spinner.show();
    combineLatest(proposalsReq).subscribe(v => {
      this.route.navigateByUrl(`${this.route.url}`);
      this.toasterService.success('Admin proposal successfully added!');
      this.spinner.hide();
    });
  }

  deleteAdminProposal() {
    const arr = [];
    (this.quoteList || []).map(q => {
      arr.push(this.proposalService.deleteAdminProposal(q.proposalPartId));
    });
    combineLatest(arr)
      .pipe(
        catchError(err => {
          this.toasterService.error('unable to delete admin proposal');
          return empty();
        })
      )
      .subscribe(() => {
        this.toasterService.success('proposals successfully deleted!');
        this.route.navigateByUrl(`/prodex/projects/pm-release-queue`);
      });
  }
}
