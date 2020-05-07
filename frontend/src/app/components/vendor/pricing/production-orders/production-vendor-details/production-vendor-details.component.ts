import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions, ColDef } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { catchError, switchMap } from 'rxjs/operators';
import { BehaviorSubject, empty, forkJoin, Observable } from 'rxjs';

import { BiddingService } from '../../../../../service/bidding.service';
import { BiddingOrderStatus, BiddingStatus } from '../../../../../model/bidding.order';
import { Conference, ConferenceRequest } from '../../../../../model/conference.model';
import {
  BidOrderItem,
  ConfirmSubOrderRelease,
  BidProcessStatusType,
  MatchedProfile
} from '../../../../../model/confirm.sub-order.release';
import { FileViewRendererComponent } from '../../../../../common/file-view-renderer/file-view-renderer.component';
import { OrdersService } from '../../../../../service/orders.service';
import { TemplateRendererComponent } from '../../../../../common/template-renderer/template-renderer.component';
import { UserService } from '../../../../../service/user.service';
import { VendorOrderDetail } from '../../../../../model/bidding.order.detail';
import { Util } from '../../../../../util/Util';

import { DefaultEmails } from '../../../../../../assets/constants';
import { ZoomService } from 'src/app/service/zoom.service';
import { Chat, ChatTypeEnum } from '../../../../../model/chat.model';
import { MetaData } from '../../../../../model/metadata.model';
import { RfqPricingService } from 'src/app/service/rfq-pricing.service';
import { ProcessProfile } from 'src/app/model/part.model';
import { Confidentiality } from 'src/app/model/basicDetails.model';

@Component({
  selector: 'app-production-vendor-details',
  templateUrl: './production-vendor-details.component.html',
  styleUrls: ['./production-vendor-details.component.css']
})
export class ProductionVendorDetailsComponent implements OnInit {
  biddingStatus = BiddingStatus;
  biddingOrderStatus = BiddingOrderStatus;

  customerOrderId: number;
  @ViewChild('statusCell') statusCell: TemplateRef<any>;
  @ViewChild('sendEmailCell') sendEmailCell: TemplateRef<any>;

  @ViewChild('sendMailModal') sendMailModal;
  @ViewChild('dateTimeSelector') dateTimeSelector;
  @ViewChild('orderStatusTemplate') orderStatusTemplate;

  timeToExpire = null;
  changePriority = false;
  toggleVendorList = false;
  loadingProfiles = false;
  columnDefs: Array<ColDef[]> = [];
  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent,
    templateRenderer: TemplateRendererComponent
  };

  gridOptions: GridOptions[];
  orderDetails = [];
  releasedVendors = [];
  productionOrderInfo;

  chatTypeEnum = ChatTypeEnum;
  chat: Chat;

  from = '';
  to = '';
  cc = [];
  bcc = [];

  meetingInfo = {};
  user;
  schdulingForUserId;
  schdulingForVendorOrderId;
  selectedBidProcessId;

  constructor(
    public biddingService: BiddingService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private userService: UserService,
    public toaster: ToastrService,
    public spinner: NgxSpinnerService,
    public datePipe: DatePipe,
    public currencyPipe: CurrencyPipe,
    public zoomService: ZoomService,
    public pricingService: RfqPricingService
  ) {
    this.route.params.subscribe(v => {
      this.customerOrderId = v.customerOrderId || null;

      this.productionOrderInfo = JSON.parse(localStorage.getItem('selectedProductionOrder'));

      this.spinner.show('spooler');
      this.ordersService.getProductionOrderDetails(this.productionOrderInfo).subscribe(orderInfo => {
        this.orderDetails = orderInfo.acceptedOrderDetails;
        this.releasedVendors = orderInfo.matchingSuppliersProfilesView;
        this.getFindAllScheduledMeeting();
        this.spinner.hide('spooler');
      });
    });
  }

  ngOnInit() {
    this.user = this.userService.getUserInfo();

    this.initTable();
  }
  get timeLeft() {
    return this.timeToExpire;
  }

  initTable() {
    this.columnDefs = [
      [
        {
          headerName: 'Customer Order',
          field: 'customerOrder',
          tooltipField: 'customerOrder',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Sub-Order',
          field: 'partId',
          tooltipField: 'partId',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'File Name',
          field: 'fileName',
          tooltipField: 'fileName',
          hide: false,
          sortable: true,
          filter: false,
          cellRenderer: 'fileViewRenderer',
          cellRendererParams: {
            prop: 'partId'
          }
        },
        {
          headerName: 'Price Accepted',
          field: 'priceAccepted',
          tooltipField: 'priceAccepted',
          hide: false,
          sortable: true,
          filter: false,
          valueFormatter: dt => {
            return this.currencyPipe.transform(dt.value || 0, 'USD', 'symbol', '0.0-3');
          }
        },
        {
          headerName: 'Customer',
          field: 'customerName',
          tooltipField: 'customerName',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Quantity',
          field: 'quantity',
          tooltipField: 'quantity',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Material',
          field: 'materialPropertyValues',
          tooltipField: 'materialPropertyValues',
          hide: false,
          sortable: true,
          filter: false,
          valueFormatter: dt => (dt.value || []).join(' , ')
        },
        {
          headerName: 'Technology',
          field: 'equipmentPropertyValues',
          tooltipField: 'equipmentPropertyValues',
          hide: false,
          sortable: true,
          filter: false,
          valueFormatter: dt => (dt.value || []).join(' , ')
        },
        {
          headerName: 'NDA',
          field: 'nda',
          tooltipField: 'nda',
          hide: true,
          sortable: true,
          filter: false
        },
        // {
        //   headerName: 'Post-Process',
        //   field: 'postProcessTypeNames',
        //   tooltipField: 'postProcessTypeNames',
        //   hide: false,
        //   sortable: true,
        //   filter: false
        // },
        // {
        //   headerName: 'Previously Ordered',
        //   field: 'previouslyOrdered',
        //   tooltipField: 'previouslyOrdered',
        //   hide: false,
        //   sortable: true,
        //   filter: false
        // },
        // {
        //   headerName: 'First Shipment',
        //   field: 'firstShipment',
        //   tooltipField: 'firstShipment',
        //   hide: false,
        //   sortable: true,
        //   filter: false
        // },
        {
          headerName: 'Delivery Date',
          field: 'deliveryDate',
          tooltipField: 'deliveryDate',
          hide: false,
          sortable: true,
          filter: false,
          valueFormatter: dt => (dt.value ? `${this.datePipe.transform(dt.value, Util.dateFormat, 'UTC')}` : '')
        },
        {
          headerName: 'Shipping Address',
          field: 'shippingAddress',
          tooltipField: 'shippingAddress',
          hide: false,
          sortable: true,
          filter: false
        }
      ],
      [
        {
          headerName: 'No',
          field: 'id',
          tooltipField: 'id',
          width: 100,
          maxWidth: 100,
          hide: false,
          sortable: false,
          filter: false,
          valueGetter: 'node.rowIndex + 1'
        },
        {
          headerName: 'Vendor Name',
          field: 'vendorName',
          tooltipField: 'vendorName',
          hide: false,
          sortable: false,
          filter: false,
          minWidth: 200,
          maxWidth: 200,
          width: 200
        },
        {
          headerName: 'Vendor Bid Price',
          field: 'vendorOrderAmount',
          tooltipField: 'vendorOrderAmount',
          hide: false,
          sortable: false,
          filter: false,
          minWidth: 200,
          maxWidth: 200,
          width: 200,
          valueFormatter: dt => dt.value && this.currencyPipe.transform(dt.value || 0, 'USD', 'symbol', '0.0-3')
        },
        {
          headerName: 'Status',
          field: 'vendorOrderStatus',
          tooltipField: 'vendorOrderStatus',
          cellClass: 'p-0 text-center',
          hide: false,
          sortable: false,
          filter: false,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.statusCell
          }
        },
        {
          headerName: 'Communication with Vendor',
          cellClass: 'p-0 chat-column',
          hide: false,
          sortable: false,
          filter: false,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.sendEmailCell
          }
        }
      ]
    ];
    this.gridOptions = [
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.columnDefs[0],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35
      },
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.columnDefs[1],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35
      }
    ];
  }

  onGridReady(idx, ev) {
    this.gridOptions[idx].api = ev.api;
    this.gridOptions[idx].api.sizeColumnsToFit();
  }

  showModal(content) {
    this.ordersService.getSubOrderReleaseConfirmation().subscribe(v => {
      this.modalService.open(content, {
        centered: true,
        windowClass: 'confirm-release-modal'
      });
    });
  }

  sendMail(ev = null) {
    this.from = DefaultEmails.from;
    this.to = DefaultEmails.to;
    this.cc = [ev.vendorEmail];
    this.bcc = [];
    this.modalService.open(this.sendMailModal, {
      centered: true,
      size: 'lg'
    });
  }

  openDateTimeSelector(row) {
    this.schdulingForUserId = row.userId;
    this.schdulingForVendorOrderId = this.productionOrderInfo.vendorOrderId;
    this.dateTimeSelector.nativeElement.click();
  }

  onTimeChanged(event) {
    this.spinner.show();
    const meetingTime = new Date(event).toISOString();
    const conference: ConferenceRequest = {
      hostUserId: this.userService.getUserInfo().id,
      participantUserId: this.schdulingForUserId,
      partId: 0,
      bidOrderId: 0,
      customerOrderId: 0,
      vendorOrderId: this.schdulingForVendorOrderId,

      conferenceTopic: this.schdulingForVendorOrderId.toString(),
      conferencePassword: this.schdulingForVendorOrderId.toString(),
      startTimeInUTC: meetingTime.substr(0, meetingTime.length - 5) + 'Z',
      duration: 1
    };
    this.zoomService.createConference(conference).subscribe(
      (res: Conference) => {
        if (res) {
          this.getFindAllScheduledMeeting();
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

  viewOrderInfo(id: number) {
    this.selectedBidProcessId = id;
    const modalOptions: any = {
      centered: true,
      windowClass: 'order-status-modal',
      scrollable: true
    };
    this.modalService.open(this.orderStatusTemplate, modalOptions);
  }

  getScheduledMeetings(user) {
    this.zoomService
      .getConferenceByVendorOrderId(
        this.productionOrderInfo.vendorOrderId.toString(),
        this.userService.getUserInfo().id,
        user.userId
      )
      .subscribe(
        res => {
          if (res) {
            this.meetingInfo[(user.userId || '').toString()] = res;
          } else {
            this.meetingInfo[(user.userId || '').toString()] = { startTime: '' };
          }
        },
        err => {
          console.log('Error while fetching meeting information');
          console.log({ err });
        }
      );
  }

  getFindAllScheduledMeeting() {
    if (this.releasedVendors.length) {
      this.releasedVendors.forEach(user => {
        this.getScheduledMeetings(user);
      });
    }
  }

  clickMeetingTime(ev) {
    ev.stopPropagation();
  }
}
