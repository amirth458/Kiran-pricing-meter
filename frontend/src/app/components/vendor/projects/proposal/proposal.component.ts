import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { combineLatest, empty } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal, NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

import { BiddingService } from '../../../../service/bidding.service';
import { FilterOption } from '../../../../model/vendor.model';
import { MetadataService } from '../../../../service/metadata.service';
import { MetadataConfig } from '../../../../model/metadata.model';
import {
  AdminProposalRequest,
  PmProjectBidStatusType,
  PmProjectStatusType,
  ProposalTypeEnum,
  VendorConfirmationResponse
} from '../../../../model/bidding.order';
import { OrdersService } from '../../../../service/orders.service';
import { ProposalService } from '../../../../service/proposal.service';
import { Part, PartDimension, RfqMedia } from '../../../../model/part.model';
import { PartQuoteCustomerView } from '../../../../model/connect.model';
import { ZoomTypeEnum, ZoomParticipantEnum } from '../../../../model/conference.model';
import { ChatTypeEnum } from '../../../../model/chat.model';
import { UserService } from 'src/app/service/user.service';
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

  measurementUnits: any = [];
  invoiceItems: any = [];

  public proposalType = ProposalTypeEnum.VENDOR_PROPOSAL_TYPE;
  proposalTypeEnum = ProposalTypeEnum;

  bidPmProjectProcessId: number;
  PMProjectBids: VendorConfirmationResponse[] = [];
  releasedProposal: VendorConfirmationResponse = null;

  zoomParticipantEnum = ZoomParticipantEnum;
  zoomTypeEnum = ZoomTypeEnum;
  chatTypeEnum = ChatTypeEnum;

  isReleaseToSingleSupplier = null;
  customerOrderId = null;
  customer = null;
  activePartId = null;

  get totalCost() {
    return (this.quoteList || []).reduce((sum: number, quote: PartQuoteCustomerView) => {
      if (quote) {
        sum += Util.calcPartQuoteCost(quote);
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
    public userService: UserService,
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
    this.getReleasedPmProjectBids();
    this.metaDataService.getAdminMetaData(MetadataConfig.MEASUREMENT_UNIT_TYPE).subscribe(res => {
      this.measurementUnits = res || [];
    });
    this.metaDataService.getProcessMetaData('invoice_item').subscribe(v => (this.invoiceItems = v));
  }

  ngOnInit() {}

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
    this.spinner.show();
    this.biddingService.getDetailedPartInfo(this.offerId, this.vendorId).subscribe(parts => {
      (parts || []).map(p => {
        if (p.partQuoteCustomerView) {
          this.quoteList.push(p.partQuoteCustomerView);
        }
      });
      this.activePartId = this.quoteList[0].partId;
      this.spinner.hide();
      this.findAdminProposal((parts || []).map(p => p.partId));
      this.getProposalPartByIds((this.quoteList || []).map(quote => quote.proposalPartId));
    });
  }

  getAdminPartQuote() {
    this.spinner.show();
    this.proposalService.getAdminPartQuote(this.proposalPartIds).subscribe(quotes => {
      (quotes || []).map(p => {
        this.quoteList.push(p);
      });
      this.activePartId = this.quoteList[0].partId;
      this.releasedProposal = this.PMProjectBids.filter(_ => _.vendorId === this.quoteList[0].vendorId)[0];
      this.spinner.hide();
      if (this.isComplete()) {
        this.findAdminProposal((quotes || []).map(p => p.partId));
      }
      this.getProposalPartByIds((this.quoteList || []).map(quote => quote.proposalPartId));
    });
  }

  getProposalPartByIds(ids: Array<number>) {
    this.spinner.show();
    this.proposalService.getProposalPartByIds(ids).subscribe(parts => {
      (parts || []).map(p => {
        this.partInfo[p.id] = p;
        this.getReferenceFiles(p.id);
      });

      const order = this.partInfo[this.quoteList[0].proposalPartId].order;

      this.customerOrderId = order.id;
      this.isReleaseToSingleSupplier = order.isReleaseToSingleSupplier;

      this.getCustomerDetails(order.customerId);
      this.selectedTab = this.quoteList.length > 0 ? this.quoteList[0].partId : null;
      this.fetchProfilesTabInfo();
      this.spinner.hide();
    });
  }

  beforeChange($event: NgbTabChangeEvent) {
    this.selectedTab = Number($event.nextId);
    this.activePartId = $event.nextId;
    this.isReleaseToSingleSupplier = null;
    setTimeout(() => {
      const quotePart = this.quoteList.filter(p => p.partId == this.activePartId);
      const order = this.partInfo[quotePart[0].proposalPartId].order;
      this.customerOrderId = order.id;
      this.isReleaseToSingleSupplier = order.isReleaseToSingleSupplier;
      this.getCustomerDetails(order.customerId);
    }, 500);

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
    if (!(partDimension && partDimension.volume && partDimension.volume.unitId)) {
      const unit = this.measurementUnits.find(item => item.id === partDimension.volume.unitId);
      return `${partDimension.volume.value} ${unit.symbol}`;
    }
    return '';
  }

  findUnitById(id: number) {
    const units = (this.measurementUnits || []).filter(unit => unit.id === id);
    return units.length > 0 ? units[0] : null;
  }

  findAdminProposal(ids: Array<number>) {
    this.spinner.show();
    this.proposalService.getProposalPartByParentPartIds(ids).subscribe(v => {
      this.adminProposalInfo = (v || []).map(p => {
        p.partId = p.id;
        return p;
      });
      this.spinner.hide();
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
        this.route.navigateByUrl('/prodex/projects/proposal-issued');
      });
  }

  sendAllQuoteToCustomer() {
    const arr = Util.buildAdminProposalData(this.partInfo, this.quoteList, this.refMedia);
    const proposalsReq = [];
    (arr || []).map(proposalReq => proposalsReq.push(this.proposalService.updateAdminProposal(proposalReq)));
    this.spinner.show();
    combineLatest(proposalsReq)
      .pipe(
        catchError(err => {
          this.toasterService.error('unable to update admin proposal');
          this.modalService.dismissAll();
          return empty();
        }),
        switchMap(() => {
          const partIds = (this.quoteList || []).map(q => q.partId);
          const quote = (this.quoteList || []).length ? (this.quoteList || [])[0] : null;
          return this.proposalService.sendQuoteToCustomer(quote.vendorId, partIds);
        })
      )
      .subscribe(v => {
        this.toasterService.success('Admin proposal have been updated!');
        this.spinner.hide();
        this.route.navigateByUrl('/prodex/projects/proposal-issued');
      });
  }

  hideDetailView(isCustomerAccepted: boolean = false) {
    if (!isCustomerAccepted) {
      this.route.navigate(['.'], { relativeTo: this.router.parent });
    } else {
      this.route.navigateByUrl('/prodex/projects/customer-accepted');
    }
  }

  updateAdminProposal() {
    this.spinner.show();
    const arr = Util.buildAdminProposalData(this.partInfo, this.quoteList, this.refMedia);
    const proposalsReq = [];
    (arr || []).map(proposalReq => proposalsReq.push(this.proposalService.updateAdminProposal(proposalReq)));
    combineLatest(proposalsReq)
      .pipe(
        catchError(err => {
          this.toasterService.error('unable to update admin proposal');
          this.modalService.dismissAll();
          return empty();
        })
      )
      .subscribe(v => {
        this.modalService.dismissAll();
        this.toasterService.success('Proposal saved successfully!');
        this.spinner.hide();
      });
  }

  createProposal() {
    this.spinner.show();
    const arr = Util.buildAdminProposalData(this.partInfo, this.quoteList, this.refMedia);
    const proposalsReq = [];
    (arr || []).map(proposalReq => proposalsReq.push(this.proposalService.createAdminProposal(proposalReq)));
    combineLatest(proposalsReq)
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
        const statusName = (this.statusType || '').replace(/-/g, '_').toUpperCase();
        let url = '/prodex/projects/pm-release-queue/';
        if ((this.route.url || '').includes('/prodex/projects/proposal-issued/')) {
          url = '/prodex/projects/proposal-issued/';
        }
        url += `${this.offerId}/${statusName}/admin-proposal/${parentPartIds.join(',')}`;
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
        this.route.navigate(['.'], { relativeTo: this.router.parent });
      });
  }

  viewVendorProposal() {
    const statusName = (this.releasedProposal.bidPmProjectProcessStatus || '').replace(/_/g, '-').toLowerCase();
    const baseUrl = this.route.url.startsWith('/prodex/projects/pm-release-queue')
      ? `/prodex/projects/pm-release-queue/${this.offerId}/${statusName}/vendor-proposal/${this.releasedProposal.vendorId}`
      : `/prodex/projects/proposal-issued/${this.offerId}/${statusName}/vendor-proposal/${this.releasedProposal.vendorId}`;
    this.route.navigateByUrl(baseUrl);
  }

  getReleasedPmProjectBids() {
    this.spinner.show();
    this.biddingService.getReleasedPmProjectBids(this.offerId).subscribe(v => {
      this.PMProjectBids = v || [];
      const result = this.PMProjectBids.filter(bid => bid.vendorUserId == this.vendorId);
      const releasedProposals = this.PMProjectBids.filter((bid: VendorConfirmationResponse) => {
        return bid.bidPmProjectProcessStatus === PmProjectBidStatusType.RELEASED_TO_CUSTOMER;
      });
      if ((releasedProposals || []).length > 0) {
        this.releasedProposal = releasedProposals[0];
      }
      this.bidPmProjectProcessId = result.length ? result[0].bidPmProjectProcessId : null;
      this.spinner.hide();
      if (this.proposalType === this.proposalTypeEnum.VENDOR_PROPOSAL_TYPE) {
        this.fetchPartsAndQuote();
      } else {
        this.getAdminPartQuote();
      }
    });
  }

  async getCustomerDetails(customerId) {
    const body = {
      q: '',
      filterColumnsRequests: [
        { id: 11, displayName: 'Customer ID', selectedOperator: '=', searchedValue: customerId.toString() }
      ]
    };
    try {
      const res = await this.userService.getAllCustomers(0, 10, body).toPromise();
      this.customer = res.content[0];
    } catch (error) {
      console.log(error);
      this.customer = null;
    }
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
