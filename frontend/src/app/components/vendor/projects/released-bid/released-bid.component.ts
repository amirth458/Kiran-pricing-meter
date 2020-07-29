import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { ColDef, GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { combineLatest, empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { BidPart, Part } from '../../../../model/part.model';
import { BiddingService } from '../../../../service/bidding.service';
import { Chat, ChatTypeEnum } from 'src/app/model/chat.model';
import { ConferenceRequest, Conference } from 'src/app/model/conference.model';
import { DefaultEmails } from '../../../../../assets/constants';
import { AdminProposalRequest, MinimumProposalInfo, VendorConfirmationResponse } from '../../../../model/bidding.order';
import { OrdersService } from '../../../../service/orders.service';
import { PartQuoteCustomerView } from '../../../../model/connect.model';
import { ProposalService } from '../../../../service/proposal.service';
import { ToastrService } from 'ngx-toastr';
import { TemplateRendererComponent } from '../../../../common/template-renderer/template-renderer.component';
import { UserService } from 'src/app/service/user.service';
import { Util } from '../../../../util/Util';
import { ZoomService } from 'src/app/service/zoom.service';

@Component({
  selector: 'app-released-bid',
  templateUrl: './released-bid.component.html',
  styleUrls: ['./released-bid.component.css']
})
export class ReleasedBidComponent implements OnInit {
  @ViewChild('sendMailModal') sendMailModal: TemplateRef<any>;
  @ViewChild('additionalColDefRef') additionalColDefRef: TemplateRef<any>;
  @ViewChild('communicationCell') communicationCell: TemplateRef<any>;
  @ViewChild('overWriteModal') overWriteModal: TemplateRef<any>;

  bidProjectId: number;
  @Input()
  set value(value: number) {
    this.bidProjectId = value;
    this.getReleasedPmProjectBids();
  }
  get value(): number {
    return this.bidProjectId;
  }

  partInfo: BidPart[];
  @Input()
  set bidParts(value: BidPart[]) {
    this.partInfo = value;
    if (value) {
      this.getAdminProposal(value.map(p => p.partId));
    }
  }
  get bidParts(): BidPart[] {
    return this.partInfo;
  }

  get bidPartIds(): Array<number> {
    return (this.partInfo || []).map(item => item.partId) || [];
  }

  columnDefs: ColDef[] = [];
  gridOptions: GridOptions;
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  rowData: VendorConfirmationResponse[];
  proposalInfo: any;
  adminProposalInfo: Part[];

  offer: VendorConfirmationResponse;
  quoteList: PartQuoteCustomerView[];
  proposalPartInfo: any;
  refMedia: any;

  chatTypeEnum = ChatTypeEnum;
  chat: Chat;

  user = {};
  meetingInfo = {};
  schdulingForUserId;
  schdulingForBidPmProjectProcessId;

  from = '';
  to = '';
  cc = [];
  bcc = [];

  constructor(
    public biddingService: BiddingService,
    public spinner: NgxSpinnerService,
    public modalService: NgbModal,
    public router: Router,
    public currencyPipe: CurrencyPipe,
    public datePipe: DatePipe,
    public proposalService: ProposalService,
    public zoomService: ZoomService,
    public userService: UserService,
    public toaster: ToastrService,
    public orderService: OrdersService
  ) {
    this.proposalInfo = {};
  }

  ngOnInit() {
    this.user = this.userService.getUserInfo();
    this.initGrid();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      rowSelection: 'multiple',
      rowMultiSelectWithClick: true,
      onCellFocused: event => {
        if (
          event.column &&
          (event.column.getColId() == 'additionalColDefRef' || event.column.getColId() == 'communication')
        ) {
          this.gridOptions.suppressRowClickSelection = true;
        } else {
          this.gridOptions.suppressRowClickSelection = false;
        }
      }
    };
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: 'No',
        valueGetter: 'node.rowIndex + 1',
        width: 80,
        hide: false,
        sortable: false,
        filter: false,
        checkboxSelection: true
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'vendorName'
      },
      {
        headerName: 'Quantity of Process profiles',
        field: 'numberOfProcessProfile',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'numberOfProcessProfile'
      },
      {
        headerName: 'Total Proposed Amount',
        field: 'totalProposalAmount',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'totalProposalAmount',
        valueFormatter: dt => {
          return this.currencyPipe.transform(dt.value || '', 'USD', 'symbol', '0.0-3');
        }
      },
      {
        headerName: 'Proposal Delivery Date',
        field: 'proposalDeliveryDates',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'proposalDeliveryDates',
        valueFormatter: dt => {
          const arr = (dt.value || []).map(value => {
            return this.datePipe.transform(value || '', Util.dateFormat);
          });
          return arr.join(', ');
        }
      },
      {
        headerName: 'Proposal Expiry Date',
        field: 'proposalExpiryDates',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'proposalExpiryDates',
        valueFormatter: dt => {
          const arr = (dt.value || []).map(value => {
            return this.datePipe.transform(value || '', Util.dateFormat);
          });
          return arr.join(', ');
        }
      },
      {
        headerName: 'Status',
        field: 'bidPmProjectProcessStatus',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'bidPmProjectProcessStatus'
      },
      {
        headerName: '',
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer: 'templateRenderer',
        field: 'additionalColDefRef',
        cellRendererParams: {
          ngTemplate: this.additionalColDefRef
        }
      },
      {
        headerName: 'Communication with Vendor',
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer: 'templateRenderer',
        field: 'communication',
        width: 260,
        suppressSizeToFit: true,
        cellRendererParams: {
          ngTemplate: this.communicationCell
        }
      }
    ];
  }

  getReleasedPmProjectBids() {
    this.spinner.show('releaseLoadingPanel');
    this.biddingService.getReleasedPmProjectBids(this.bidProjectId).subscribe(v => {
      this.rowData = v || [];
      this.rowData.map(user => this.getScheduledMeetings(user));
      if (this.rowData.length > 0) {
        this.fetchProposalInfo(this.rowData.map(item => item.vendorId));
      }
      this.spinner.hide('releaseLoadingPanel');
    });
  }

  openOverWriteModal(offer: VendorConfirmationResponse) {
    if ((this.adminProposalInfo || []).length > 0) {
      this.offer = offer;
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
    }
  }

  resetOverWriteDataMember() {
    this.quoteList = [];
    this.proposalPartInfo = {};
    this.refMedia = {};
  }

  async overWriteProposal() {
    this.resetOverWriteDataMember();
    this.spinner.show();
    const parts: any = await this.biddingService
      .getDetailedPartInfo(this.bidProjectId, this.offer.vendorId)
      .toPromise();
    (parts || []).map(p => {
      if (p.partQuoteCustomerView) {
        this.quoteList.push(p.partQuoteCustomerView);
      }
    });
    const proposalPartIds = (this.quoteList || []).map(quote => quote.proposalPartId);
    const proposalParts = await this.proposalService.getProposalPartByIds(proposalPartIds).toPromise();
    (proposalParts || []).map(p => (this.proposalPartInfo[p.id] = p));
    for (const p of proposalParts || []) {
      try {
        this.refMedia[p.id] = await this.orderService.getReferenceFiles(p.id).toPromise();
      } catch (error) {
        this.refMedia[p.id] = [];
      }
    }
    const arr = Util.buildAdminProposalData(this.proposalPartInfo, this.quoteList, this.refMedia);
    const proposalsReq = [];
    (arr || []).map(proposalReq => proposalsReq.push(this.proposalService.createAdminProposal(proposalReq)));
    combineLatest(proposalsReq)
      .pipe(
        catchError(err => {
          this.toaster.error('unable to update admin proposal');
          this.modalService.dismissAll();
          return empty();
        })
      )
      .subscribe((proposals: AdminProposalRequest[]) => {
        this.modalService.dismissAll();
        this.spinner.hide();
        if ((proposals || []).length > 0) {
          const ids = (proposals || []).map(p => p.part.parentPartId);
          this.toaster.success('Proposal saved successfully!');
          this.router.navigateByUrl(`${this.router.url}/admin-proposal/${ids.join(',')}`);
        } else {
          this.toaster.error('unable to update admin proposal');
        }
      });
  }

  getAdminProposal(ids: Array<number>) {
    this.proposalService.getProposalPartByParentPartIds(ids).subscribe(v => {
      this.adminProposalInfo = v || [];
    });
  }

  fetchProposalInfo(vendorIds: Array<number>) {
    const arr = [];
    vendorIds.map(vendorId => {
      arr.push(this.biddingService.getDetailedPartInfo(this.bidProjectId, vendorId));
    });
    this.spinner.show('releaseLoadingPanel');
    combineLatest(arr).subscribe(v => {
      this.spinner.hide('releaseLoadingPanel');
      const bidParts = (v || []).reduce((acc, value) => {
        acc = acc.concat(value || []);
        return acc;
      }, []);
      (bidParts || []).map((part: BidPart) => {
        if (part.partQuoteCustomerView) {
          const quote = part.partQuoteCustomerView;
          if (this.proposalInfo[quote.vendorId]) {
            this.proposalInfo[quote.vendorId].proposalPartIds.push(quote.proposalPartId);
          } else {
            this.proposalInfo[quote.vendorId] = {
              vendorId: quote.vendorId,
              offerId: this.bidProjectId,
              proposalPartIds: [quote.proposalPartId]
            } as MinimumProposalInfo;
          }
        }
      });
    });
  }

  viewVendorOffer($event: any, vendorId: number) {
    this.router.navigateByUrl(`${this.router.url}/vendor-proposal/${vendorId}`);
  }

  viewAdminProposal() {
    const ids = (this.adminProposalInfo || []).map(p => p.parentPartId);
    this.router.navigateByUrl(`${this.router.url}/admin-proposal/${ids.join(',')}`);
  }

  sendMail(row: any = null) {
    this.from = DefaultEmails.from;
    this.to = DefaultEmails.to;
    this.cc = [];
    this.bcc = row && row.vendorEmail ? [row.vendorEmail] : null;
    if (!this.bcc) {
      this.bcc = this.gridOptions.api.getSelectedRows().map(dataRow => dataRow.vendorEmail);
    }
    if (this.bcc && this.bcc.length > 0) {
      this.modalService.open(this.sendMailModal, {
        centered: true,
        size: 'lg'
      });
    }
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  openDateTimeSelector(row) {
    this.schdulingForUserId = row.vendorUserId;
    this.schdulingForBidPmProjectProcessId = row.bidPmProjectProcessId;
  }

  onTimeChanged(event) {
    this.spinner.show();
    const meetingTime = new Date(event).toISOString();

    const conference: ConferenceRequest = {
      hostUserId: this.userService.getUserInfo().id,
      participantUserId: this.schdulingForUserId,
      partId: 0,
      bidOrderId: 0,
      bidPmProjectProcessId: this.schdulingForBidPmProjectProcessId,
      customerOrderId: 0,
      vendorOrderId: 0,

      conferenceTopic: 'Meeting for Bid PM Project Process Id ' + this.schdulingForBidPmProjectProcessId.toString(),
      conferencePassword: this.schdulingForBidPmProjectProcessId.toString(),
      startTimeInUTC: meetingTime.substr(0, meetingTime.length - 5) + 'Z',
      duration: 1
    };
    this.zoomService.createConference(conference).subscribe(
      (res: Conference) => {
        if (res) {
          this.getAllScheduledMeetings();
        }
        this.spinner.hide();
        this.toaster.success('Meeting time set.');
        this.schdulingForUserId = null;
      },
      err => {
        console.log({ err });
        this.schdulingForUserId = null;
        this.spinner.hide();
        this.toaster.error('Error while setting meeting time.');
      }
    );
  }

  getAllScheduledMeetings() {
    if (this.rowData.length) {
      this.rowData.map(user => this.getScheduledMeetings(user));
    }
  }

  getScheduledMeetings(user: VendorConfirmationResponse) {
    this.zoomService
      .getConferenceByBidPmProjectProcessId(
        user.bidPmProjectProcessId.toString(),
        user.vendorUserId,
        this.userService.getUserInfo().id
      )
      .subscribe(
        res => {
          if (res) {
            this.meetingInfo[(user.vendorUserId || '').toString()] = res;
          } else {
            this.meetingInfo[(user.vendorUserId || '').toString()] = { startTime: '' };
          }
        },
        err => {
          console.log('Error while fetching meeting information');
          console.log({ err });
        }
      );
  }
}
