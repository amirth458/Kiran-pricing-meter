import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { BiddingService } from '../../../../service/bidding.service';
import { FilterOption } from '../../../../model/vendor.model';
import { MetadataService } from '../../../../service/metadata.service';
import { MetadataConfig } from '../../../../model/metadata.model';
import {
  AdminProposalRequest,
  PmProjectStatusType,
  ProposalPartDimension,
  ProposalPartQuote,
  ProposalTypeEnum
} from '../../../../model/bidding.order';
import { OrdersService } from '../../../../service/orders.service';
import { ProposalService } from '../../../../service/proposal.service';
import { Part, PartDimension, RfqMedia } from '../../../../model/part.model';
import { PartQuoteCustomerView } from '../../../../model/connect.model';
import { RfqPricingService } from '../../../../service/rfq-pricing.service';
import { Util } from '../../../../util/Util';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {
  @ViewChild('overWriteModal') overWriteModal: TemplateRef<any>;
  offerId: number;
  vendorId: number;
  statusType: string;
  proposalPartIds: Array<number>;
  quoteList: PartQuoteCustomerView[];
  partInfo: any;
  refMedia: any;
  adminProposalInfo: Part[];
  processProfiles: any[] = null;
  pricingProfiles: any[] = null;
  selectedTab: number = null;
  pmProjectStatusType = PmProjectStatusType;
  showPartDetails = false;

  measurementUnits: any;
  invoiceItems: any;

  public proposalType = ProposalTypeEnum.VENDOR_PROPOSAL_TYPE;
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
    public spinner: NgxSpinnerService,
    public modalService: NgbModal,
    protected pricingService: RfqPricingService
  ) {
    this.partInfo = {};
    this.refMedia = {};
    this.quoteList = [];
    combineLatest(this.router.params, this.router.parent.params).subscribe(v => {
      const params: any = { ...v[0], ...v[1] };
      this.offerId = params.bidPmProjectId || null;
      this.vendorId = params.vendorId || null;
      this.statusType = (params.statusType || '').replace(/-/g, '_').toUpperCase();
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

  isComplete() {
    return (
      this.statusType === PmProjectStatusType.COMPLETE && this.proposalType === ProposalTypeEnum.ADMIN_PROPOSAL_TYPE
    );
  }

  isQuoteEditable() {
    return (
      this.proposalType === ProposalTypeEnum.ADMIN_PROPOSAL_TYPE && this.statusType !== PmProjectStatusType.COMPLETE
    );
  }

  showProfilesTab() {
    return (
      this.statusType === PmProjectStatusType.CUSTOMER_ACCEPTED ||
      this.proposalType === ProposalTypeEnum.ADMIN_PROPOSAL_TYPE
    );
  }

  fetchPartsAndQuote() {
    this.biddingService.getDetailedPartInfo(this.offerId, this.vendorId).subscribe(parts => {
      (parts || []).map(p => {
        if (p.partQuoteCustomerView) {
          this.quoteList.push(p.partQuoteCustomerView);
        }
      });
      console.log(this.quoteList);
      this.findAdminProposal((parts || []).map(p => p.partId));
      this.getProposalPartByIds((this.quoteList || []).map(quote => quote.proposalPartId));
    });
  }

  getAdminPartQuote() {
    this.proposalService.getAdminPartQuote(this.proposalPartIds).subscribe(quotes => {
      (quotes || []).map(p => {
        this.quoteList.push(p);
      });
      if (this.isComplete()) {
        this.findAdminProposal((quotes || []).map(p => p.partId));
      }
      this.getProposalPartByIds((this.quoteList || []).map(quote => quote.proposalPartId));
    });
  }

  getProposalPartByIds(ids: Array<number>) {
    this.proposalService.getProposalPartByIds(ids).subscribe(parts => {
      (parts || []).map(p => {
        this.partInfo[p.id] = p;
        this.getReferenceFiles(p.id);
      });
      this.selectedTab = this.quoteList.length > 0 ? this.quoteList[0].partId : null;
      this.fetchProfilesTabInfo();
    });
  }

  beforeChange($event: NgbTabChangeEvent) {
    this.selectedTab = Number($event.nextId);
    if (this.showProfilesTab()) {
      this.fetchProfilesTabInfo();
    }
  }

  fetchProfilesTabInfo() {
    this.getProcessProfile(false);
    this.getPricingProfiles();
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

  findAdminProposal(ids: Array<number>) {
    this.proposalService.getProposalPartByParentPartIds(ids).subscribe(v => {
      this.adminProposalInfo = (v || []).map(p => {
        p.partId = p.id;
        return p;
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
    if ((this.adminProposalInfo || []).length > 0) {
      const options: any = {
        centered: true,
        size: 'sm',
        windowClass: 'over-write-modal',
        backdrop: 'static'
      };
      this.modalService.open(this.overWriteModal, options).result.then(
        result => {},
        reason => {}
      );
    } else {
      this.createProposal();
    }
  }

  sendQuote(vendorId: number, ids: Array<number>) {
    this.spinner.show();
    this.proposalService
      .sendQuoteToCustomer(vendorId, ids)
      .pipe(
        catchError(err => {
          this.toasterService.error('unable to send proposal to customer');
          this.modalService.dismissAll();
          return empty();
        })
      )
      .subscribe(() => {
        this.toasterService.success('Admin proposal have been updated!');
        this.spinner.hide();
        this.route.navigateByUrl('/prodex/projects/pm-release-queue');
      });
  }

  sendAllQuoteToCustomer() {
    const arr = (this.quoteList || []).map(q => q.partId);
    const quote = (this.quoteList || []).length ? (this.quoteList || [])[0] : null;
    this.sendQuote(quote.vendorId, arr);
  }

  updateAdminProposal() {
    this.spinner.show();
    combineLatest(this.buildAdminProposalData())
      .pipe(
        catchError(err => {
          this.toasterService.error('unable to update admin proposal');
          this.modalService.dismissAll();
          return empty();
        })
      )
      .subscribe(v => {
        this.modalService.dismissAll();
        const parentPartIds = (v || []).map((p: AdminProposalRequest) => p.part.parentPartId);
        this.toasterService.success('Admin proposal have been updated!');
        this.spinner.hide();
        this.route.navigateByUrl('/prodex/projects/pm-release-queue');
      });
  }

  buildAdminProposalData(isCreate: boolean = false): Array<AdminProposalRequest> {
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
          value: partDimension ? partDimension.volume.value : null
        },
        surfaceArea: {
          unitId: partDimension ? partDimension.surfaceArea.unitId : null,
          value: partDimension ? partDimension.surfaceArea.value : null
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
        isManualPricing: true,
        isGlobalRule: false,
        isAutoQuoteOverride: true,
        globalRuleReason: {
          id: 1
        },
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
        adminMargin: customerQuote.marginCost || 0,
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
          postProcessTypeIds: proposal.postProcessTypeIds,
          order: {
            id: proposal.order.id
          }
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
      proposalsReq.push(
        isCreate
          ? this.proposalService.createAdminProposal(proposalReq)
          : this.proposalService.updateAdminProposal(proposalReq)
      );
    });
    return proposalsReq;
  }

  createProposal() {
    this.spinner.show();
    combineLatest(this.buildAdminProposalData(true))
      .pipe(
        catchError(err => {
          this.toasterService.error('unable to create admin proposal');
          this.modalService.dismissAll();
          return empty();
        })
      )
      .subscribe(v => {
        this.modalService.dismissAll();
        const parentPartIds = (v || []).map((p: AdminProposalRequest) => p.part.parentPartId);
        this.toasterService.success('Admin proposal successfully added!');
        this.spinner.hide();
        const url =
          '/prodex/projects/pm-release-queue/' +
          `${this.offerId}/${this.statusType}/admin-proposal/${parentPartIds.join(',')}`;
        this.route.navigateByUrl(url);
      });
  }

  deleteAdminProposal() {
    const arr = [];
    (this.quoteList || []).map(q => {
      arr.push(this.proposalService.deleteAdminProposal(q.partId));
    });
    this.spinner.show();
    combineLatest(arr)
      .pipe(
        catchError(err => {
          this.toasterService.error('unable to delete admin proposal');
          return empty();
        })
      )
      .subscribe(() => {
        this.spinner.hide();
        this.toasterService.success('proposals successfully deleted!');
        this.route.navigateByUrl(`/prodex/projects/pm-release-queue`);
      });
  }

  getPartIdFromQuote(): number {
    const quote = (this.quoteList || []).filter(f => f.partId === this.selectedTab);
    return quote.length > 0 ? quote[0].proposalPartId : null;
  }

  async getProcessProfile(applyGlobalRule: boolean = false) {
    const partId = this.getPartIdFromQuote();
    const part: Part = this.partInfo[partId] as Part;
    this.spinner.show();
    const res = await this.orderService.getMatchingProcessProfiles([part.rfqMedia.id], applyGlobalRule).toPromise();

    this.processProfiles = [];
    this.processProfiles = res.map(item => ({
      id: item.processProfileId,
      profileId: item.processProfileId,
      vendorName: item.corporateName,
      processProfileName: item.processProfileName,
      facilityName: item.facilityName,
      material: item.material,
      equipment: item.equipment
    }));
    this.spinner.hide();
  }

  async getPricingProfiles() {
    const partId = this.getPartIdFromQuote();
    const part: Part = this.partInfo[partId] as Part;
    this.spinner.show();
    try {
      const pageSize = 1000;
      let data = [];
      let page = 0;
      let filter: FilterOption = { size: pageSize, sort: '', page, q: '' };

      let currentData = await this.pricingService
        .getScreenPricingProfileByPartId(
          part.id,
          this.processProfiles.map(profile => profile.profileId),
          filter
        )
        .toPromise();
      while (currentData.length) {
        page = page + 1;
        data = data.concat(currentData);
        filter = { size: pageSize, sort: '', page, q: '' };
        if (currentData.length == pageSize) {
          currentData = await this.pricingService
            .getScreenPricingProfileByPartId(
              part.id,
              this.processProfiles.map(profile => profile.profileId),
              filter
            )
            .toPromise();
        } else {
          currentData = [];
        }
      }
      this.pricingProfiles = data.map(item => ({
        selected: false,
        id: item.processPricingId,
        vendorName: item.processVendorName,
        pricingProfile: item.pricingProfileName,
        material: item.material,
        equipment: item.equipment,
        processProfile: item.processProfileName,
        totalCost: null
      }));
      this.spinner.hide();
    } catch (e) {
      this.spinner.hide();
      this.pricingProfiles = [];
    }
  }
}
