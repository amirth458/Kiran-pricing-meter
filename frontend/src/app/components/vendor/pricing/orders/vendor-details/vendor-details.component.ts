import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { catchError, switchMap } from 'rxjs/operators';
import { BehaviorSubject, empty, forkJoin, Observable } from 'rxjs';

import { BiddingService } from '../../../../../service/bidding.service';
import { BiddingOrderStatus, BiddingStatus } from '../../../../../model/bidding.order';
import { Conference, ConferenceRequest } from '../../../../../model/conference.model';
import { BidOrderItem, ConfirmSubOrderRelease } from '../../../../../model/confirm.sub-order.release';
import { FileViewRendererComponent } from '../../../../../common/file-view-renderer/file-view-renderer.component';
import { OrdersService } from '../../../../../service/orders.service';
import { TemplateRendererComponent } from '../../../../../common/template-renderer/template-renderer.component';
import { UserService } from '../../../../../service/user.service';
import { VendorOrderDetail } from '../../../../../model/bidding.order.detail';
import { Util } from '../../../../../util/Util';

import { DefaultEmails } from '../../../../../../assets/constants.js';
import { ZoomService } from 'src/app/service/zoom.service';
import { Chat, ChatTypeEnum } from '../../../../../model/chat.model';
import { MetaData } from '../../../../../model/metadata.model';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent implements OnInit {
  biddingStatus = BiddingStatus;
  biddingOrderStatus = BiddingOrderStatus;

  type;
  orderId;
  bidOrderId: number;
  @ViewChild('pricingProfileModal') pricingProfileModal;
  @ViewChild('statusCell') statusCell: TemplateRef<any>;
  @ViewChild('sendEmailCell') sendEmailCell: TemplateRef<any>;
  @ViewChild('confirmBidding') confirmBidding: TemplateRef<any>;
  @ViewChild('supplierStatusCell') supplierStatusCell: TemplateRef<any>;

  @ViewChild('sendMailModal') sendMailModal;
  @ViewChild('dateTimeSelector') dateTimeSelector;
  @ViewChild('orderStatusTemplate') orderStatusTemplate;

  timeToExpire = null;
  changePriority = false;
  toggleVendorList = false;
  loadingProfiles = false;
  columnDefs = [];
  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent,
    templateRenderer: TemplateRendererComponent
  };

  gridOptions: GridOptions[];
  subOrderRelease;
  matchedProfiles = [];
  priorityRows = [];
  pricingProfile: any;
  initialPrice: number;
  orderDetails = [];
  bidding: Array<VendorOrderDetail>;
  selectedBidding: any;
  vendorOrderId: number;
  bidOrderStatus: MetaData;

  blockedSuppliers$: BehaviorSubject<Array<number>> = new BehaviorSubject<Array<number>>(null);
  suppliers$: Observable<Array<number>>;
  selectedBidProcessId: number;

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
    public zoomService: ZoomService
  ) {
    if (this.router.url.includes('order-confirmation-queue')) {
      this.type = 'confirmation';
    } else if (this.router.url.includes('released-orders')) {
      this.type = 'released';
    } else {
      this.type = 'release';
    }
    this.initialPrice = 0;
    this.route.params.subscribe(v => {
      this.orderId = v.orderId || null;
      this.bidOrderId = v.bidOrderId || null;
      if (!this.bidOrderId) {
        this.orderDetails = JSON.parse(localStorage.getItem('admin-selectedSubOrders'));
        (this.orderDetails || []).map(order => (this.initialPrice += order.priceAccepted));
        this.spinner.show('spooler');
        this.loadingProfiles = true;
        this.ordersService
          .getMatchedProfiles(
            this.userService.getUserInfo().id,
            this.orderDetails.map(orderDetail => orderDetail.rfqMediaId)
          )
          .subscribe(v => {
            this.matchedProfiles = [];
            let count = 0;
            v.map(item => {
              const processProfileView = item.processProfileView;
              const processPricingView: any =
                item.processPricingViews && (item.processPricingViews || []).length > 0
                  ? item.processPricingViews[0]
                  : {};
              const found = this.matchedProfiles.some(match => {
                return match.vendorId === processProfileView.vendorId;
              });
              if (!found) {
                count++;
              }
              let id = !found ? count.toString() : '';
              let priority = !found ? count : '';
              this.matchedProfiles.push({
                id,
                vendorId: processProfileView.vendorId,
                profileId: item.processProfileId,
                vendorName: item.vendorProfile ? item.vendorProfile.name : '',
                processProfileName: processProfileView.name || '',
                facilityName:
                  processProfileView.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery
                    .vendorFacility.name || '',
                pricingProfile: (processPricingView && processPricingView.name) || '',
                releasePriority: priority,
                pricing: item.processPricingViews || [],
                vendorProfile: item.vendorProfile,
                active: true
              });
            });
            this.priorityRows = this.matchedProfiles.filter(item => item.id !== '');
            this.spinner.hide('spooler');
            this.loadingProfiles = false;
          });
      } else {
        this.prepareBidOrderInfo();
      }
    });
    this.suppliers$ = this.blockedSuppliers$.asObservable();
  }

  ngOnInit() {
    this.user = this.userService.getUserInfo();

    this.initTable();
    // view bidding status
    this.columnDefs.push([
      {
        headerName: 'No',
        field: 'id',
        tooltipField: 'id',
        width: 100,
        maxWidth: 100,
        hide: false,
        sortable: false,
        filter: false
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
        field: 'bidOfferPrice',
        tooltipField: 'bidOfferPrice',
        hide: false,
        sortable: false,
        filter: false,
        minWidth: 200,
        maxWidth: 200,
        width: 200,
        valueFormatter: dt => {
          let value = '';
          switch (dt.data.bidProcessStatus.name) {
            case BiddingStatus.COUNTER_OFFER:
              value = `$ ${dt.data.counterOfferPrice || 0}`;
              break;
            case BiddingStatus.ACCEPTED:
              value = `$ ${dt.data.bidOfferPrice || 0}`;
              break;
          }
          return value;
        }
      },
      {
        headerName: 'Status',
        field: 'bidProcessStatus.description',
        tooltipField: 'bidProcessStatus.description',
        cellClass: 'p-0 text-center',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.statusCell
        }
      },
      (this.type === 'confirmation' || this.type === 'released') && {
        headerName: '',
        cellClass: 'p-0 chat-column',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.sendEmailCell
        }
      }
    ]);
    // View vendor profile matching
    this.columnDefs.push([
      {
        headerName: 'No',
        field: 'id',
        tooltipField: 'id',
        width: 100,
        maxWidth: 100,
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        tooltipField: 'vendorName',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Facility Name',
        field: 'facilityName',
        tooltipField: 'facilityName',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Process Profile Name',
        field: 'processProfileName',
        tooltipField: 'processProfileName',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Pricing Profile',
        field: 'pricingProfile',
        tooltipField: 'pricingProfile',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'status',
        field: 'bidProcessStatus.description',
        tooltipField: 'bidProcessStatus.description',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.statusCell
        }
      }
    ]);
    // view bidding status grid
    this.gridOptions.push({
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[4],
      enableColResize: true,
      suppressCellSelection: true,
      rowHeight: 50,
      headerHeight: 35
    });
    // View vendor profile matching grid
    this.gridOptions.push({
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[5],
      enableColResize: true,
      rowHeight: 36,
      headerHeight: 35
    });
  }

  prepareBidOrderInfo() {
    this.ordersService.getBidOrderDetailsById(this.bidOrderId, this.type === 'released').subscribe(v => {
      // this.orderDetails = v.acceptedOrderDetails || [];
      let count = 0;
      this.timeToExpire = v.bidProcessTimeLeft;
      this.bidding = (v.matchingSuppliersProfilesView || []).map(user => {
        return { ...user };
      });
      this.bidOrderStatus = (v ? v.bidOrderStatus || {} : {}) as MetaData;
      this.bidding.map(match => (match.id = ++count));
      const vendors = [];
      this.bidding.map(match => {
        (match.processProfileViews || []).map(p => {
          let counterValue = match.id.toString();
          let status = match.bidProcessStatus;
          if (!(vendors.indexOf(match.vendorName) > -1)) {
            vendors.push(match.vendorName);
          } else {
            counterValue = '';
            status = null;
          }
          this.matchedProfiles.push({
            id: counterValue,
            vendorId: p.vendorId,
            profileId: p.id,
            vendorName: match.vendorName,
            processProfileName: p.name,
            facilityName:
              p.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.vendorFacility.name,
            pricingProfile: (p.processPricingList || []).length,
            bidProcessStatus: status,
            counterOfferPrice: match.counterOfferPrice,
            bidOfferPrice: match.bidOfferPrice
          });
        });
      });
      this.ordersService
        .getPartQuotesByPartIds((v.acceptedOrderDetails || []).map(p => p.partId))
        .pipe(switchMap(parts => this.ordersService.mergePartQuoteInfo(v.acceptedOrderDetails)))
        .subscribe(resultData => {
          this.orderDetails = resultData || [];
          console.log(v, resultData);
        });
      // TODO remove below code after vendor order details api start return vendor order id
      if (this.type === 'released') {
        const bidProcessIds = this.bidding.filter(bid => !!bid.bidProcessId).map(bid => bid.bidProcessId);
        this.getVendorOrders(bidProcessIds);
      } else {
        this.getFindAllScheduledMeeting();
      }
    });
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
        {
          headerName: 'Post-Process',
          field: 'postProcessTypeNames',
          tooltipField: 'postProcessTypeNames',
          hide: false,
          sortable: true,
          filter: false
        },
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
          valueFormatter: dt => (dt.value ? `${this.datePipe.transform(dt.value, Util.dateFormat)}` : '')
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
          rowDrag: true
        },
        {
          headerName: 'Vendor Name',
          field: 'vendorName',
          tooltipField: 'vendorName',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Process Profile Name',
          field: 'processProfileName',
          tooltipField: 'processProfileName',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Release Priority',
          field: 'releasePriority',
          tooltipField: 'releasePriority',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: '',
          field: 'active',
          cellClass: 'p-0 status-column',
          hide: false,
          sortable: false,
          filter: false,
          width: 150,
          maxWidth: 150,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.supplierStatusCell
          }
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
          filter: false
        },
        {
          headerName: 'Corporate Name',
          field: 'vendorName',
          tooltipField: 'vendorName',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Facility Name',
          field: 'facilityName',
          tooltipField: 'facilityName',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Process Profile Name',
          field: 'processProfileName',
          tooltipField: 'processProfileName',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Vendor Address',
          valueGetter: params => {
            return params.data.id
              ? `${params.data.vendorProfile.street1 || ''}, ${params.data.vendorProfile.city || ''} ${params.data
                  .vendorProfile.state || ''}, ${params.data.vendorProfile.country.name || ''}`
              : '';
          }
        },
        {
          headerName: 'Pricing Profile',
          field: 'pricingProfile',
          tooltipField: 'pricingProfile',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Release Priority',
          field: 'releasePriority',
          tooltipField: 'releasePriority',
          hide: false,
          sortable: false,
          filter: false
        }
      ],
      [
        {
          headerName: 'Pricing No',
          field: 'id',
          tooltipField: 'id',
          width: 100,
          maxWidth: 100,
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Pricing Profile Name',
          field: 'name',
          tooltipField: 'name',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Pricing Condition 1',
          field: 'processPricingConditionList',
          tooltipField: 'processPricingConditionList',
          hide: false,
          sortable: false,
          filter: false,
          valueFormatter: dt => {
            const arr = [];
            (dt.value || []).map(condition => {
              arr.push(
                `${condition.processPricingConditionType.name || ''} ${condition.operatorType.symbol ||
                  ''} ${condition.value || ''} ${condition.unitType.symbol || ''}`
              );
            });
            return arr.length !== 0 ? arr.join(' , ') : '';
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
      },
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.columnDefs[2],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35,
        onRowClicked: ev => {
          this.pricingProfile = ev.data;
          this.modalService.open(this.pricingProfileModal, {
            centered: true,
            windowClass: 'confirm-release-modal'
          });
        }
      },
      {
        frameworkComponents: this.frameworkComponents,
        columnDefs: this.columnDefs[3],
        enableColResize: true,
        rowHeight: 35,
        headerHeight: 35
      }
    ];
  }

  onGridReady(idx, ev) {
    this.gridOptions[idx].api = ev.api;
    this.gridOptions[idx].api.sizeColumnsToFit();
    if (idx === 0) {
      this.gridOptions[idx].api.setSortModel([
        {
          colId: 'partId',
          sort: 'desc'
        }
      ]);
    } else if (idx === 2) {
      this.gridOptions[2].api.setSuppressRowDrag(true);
    }
  }

  onRowDragEnd(ev) {
    const overNode = ev.overNode;
    const popIndex = this.priorityRows.findIndex(item => item.id === overNode.data.id);
    const pushIndex = ev.overIndex;
    this.priorityRows.splice(popIndex, 1);
    this.priorityRows.splice(pushIndex, 0, overNode.data);
    this.arrangeSuppliers();
  }

  arrangeSuppliers() {
    let priority = 0;
    this.priorityRows = (this.priorityRows || []).map((row, idx) => {
      if (row.active) {
        priority++;
        row.releasePriority = priority;
      } else {
        row.releasePriority = null;
      }
      return row;
    });
    const groupedSuppliers = this.groupSupplierInfo(this.matchedProfiles, 'vendorId');
    let arr = [];
    (this.priorityRows || []).map(m => {
      arr = arr.concat(groupedSuppliers[m.vendorId] || []);
    });
    this.matchedProfiles = arr;
  }

  groupSupplierInfo(xs: any, key: string) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  showModal(content) {
    this.ordersService.getSubOrderReleaseConfirmation().subscribe(v => {
      this.subOrderRelease = v;
      this.modalService.open(content, {
        centered: true,
        windowClass: 'confirm-release-modal'
      });
    });
  }

  valueChange(row: any) {
    row.active = !row.active;
    const arr = Object.assign([], this.blockedSuppliers$.getValue() || []);
    const idx = arr.indexOf(row.vendorId);
    if (idx === -1) {
      arr.push(row.vendorId);
    } else {
      arr.splice(idx, 1);
    }
    this.blockedSuppliers$.next(Object.assign([], arr));
    this.arrangeSuppliers();
  }

  confirmSubOrderRelease() {
    this.spinner.show('spinner1');
    const customerOrders = this.orderDetails.map(order => {
      return { partId: order.partId, priceAccepted: order.priceAccepted };
    });
    const vendorData = {};
    this.matchedProfiles
      .filter(row => !((this.blockedSuppliers$.getValue() || []).indexOf(row.vendorId) > -1))
      .map(pricing => {
        if (!vendorData[pricing.vendorId]) {
          vendorData[pricing.vendorId] = {
            id: pricing.vendorId,
            postProcessProfileIds: [],
            processProfileIds: [pricing.profileId],
            releasePriority: pricing.releasePriority
          };
        } else {
          vendorData[pricing.vendorId].processProfileIds.push(pricing.profileId);
        }
      });
    const vendors = [];
    for (let key in vendorData) {
      vendors.push(vendorData[key]);
    }
    this.biddingService
      .biddingConfirmation({
        customerOrders,
        bidOfferPrice: this.initialPrice * (this.subOrderRelease.initialBidSoldPricePercent / 100),
        bidDuration: this.subOrderRelease.maxBidUnresponsiveTimeMinutes,
        maxSupplierViewOpportunity: this.subOrderRelease.maxSupplierViewOpportunity,
        originalPrice: this.initialPrice,
        startingReleasePricePercentile: this.subOrderRelease.initialBidSoldPricePercent,
        priceIncrementPercentile: this.subOrderRelease.incrementBidAmountPercent,
        thresholdBidPricePercentile: this.subOrderRelease.maxPercentWithoutFulfillment,
        timeIncrement: this.subOrderRelease.minBidIncreaseTimeMinutes,
        vendors
      } as ConfirmSubOrderRelease)
      .subscribe(v => {
        this.spinner.hide('spinner1');
        this.modalService.dismissAll();
        if (v != null) {
          const bidOrder: BidOrderItem = (v.bidOrderItemList || []).length > 0 ? v.bidOrderItemList[0] : null;
          this.toaster.success('Order Released Successfully');
          this.router.navigateByUrl(`/pricing/orders/order-confirmation-queue/${bidOrder.bidOrder.id}`);
        }
      });
  }

  toggleChangePriority() {
    this.changePriority = !this.changePriority;
  }

  openConfirmBidding(row) {
    this.selectedBidding = row;
    this.modalService.open(this.confirmBidding, {
      centered: true,
      windowClass: 'bidding-confirm'
    });
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

  onConfirmBidding() {
    const processProfileView =
      (this.selectedBidding.processProfileViews || []).length > 0 ? this.selectedBidding.processProfileViews[0] : null;
    if (processProfileView) {
      this.spinner.show();
      this.biddingService
        .confirmBidOrder(this.bidOrderId, this.selectedBidding.bidProcessId, processProfileView.vendorId)
        .pipe(
          catchError((err: any) => {
            this.toaster.error(err.error.message);
            this.spinner.hide();
            this.modalService.dismissAll();
            return empty();
          })
        )
        .subscribe(v => {
          this.toaster.success('Successfully bidding confirmed');
          this.spinner.hide();
          this.modalService.dismissAll();
          this.router.navigateByUrl(`/pricing/orders/released-orders/${this.bidOrderId}`);
        });
    } else {
      this.toaster.error('There is no process profile associated wit this bidding!');
    }
  }

  sendMail(ev = null) {
    this.from = DefaultEmails.from;
    this.to = DefaultEmails.to;
    this.cc = [];
    this.bcc = ev
      ? [ev.processProfileViews[0].vendorEmailAddress]
      : this.gridOptions[4].api.getSelectedRows().map(item => item.processProfileViews[0].vendorEmailAddress);
    this.modalService.open(this.sendMailModal, {
      centered: true,
      size: 'lg'
    });
  }

  openDateTimeSelector(row) {
    this.schdulingForUserId = row.userId;
    this.schdulingForVendorOrderId = row.vendorOrderId;
    this.dateTimeSelector.nativeElement.click();
  }

  onTimeChanged(event) {
    this.spinner.show();
    const meetingTime = new Date(event).toISOString();
    const conference: ConferenceRequest = {
      hostUserId: this.userService.getUserInfo().id,
      participantUserId: this.schdulingForUserId,
      // participantUserId: 388, //"krtest-c1@test.com"

      // partId: 1769,
      partId: 0,
      // bidOrderId: 0,
      bidOrderId: this.type === 'confirmation' ? this.bidOrderId : 0,
      customerOrderId: 0,
      vendorOrderId: this.type === 'released' ? this.schdulingForVendorOrderId : 0,

      conferenceTopic:
        'Meeting for Part ' + this.type === 'released'
          ? this.schdulingForVendorOrderId.toString()
          : this.bidOrderId.toString(),
      conferencePassword:
        this.type === 'released' ? this.schdulingForVendorOrderId.toString() : this.bidOrderId.toString(),
      startTimeInUTC: meetingTime.substr(0, meetingTime.length - 5) + 'Z',
      duration: 1
    };
    this.zoomService.createConference(conference).subscribe(
      (res: Conference) => {
        if (res) {
          this.meetingInfo[this.schdulingForUserId] = res;
          this.meetingInfo[this.schdulingForUserId].startTime = new Date(res.startTime).toISOString();
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
    // console.log(this.meetingTime);
  }

  getScheduledMeetings(user) {
    if (this.type === 'released') {
      // this.zoomService.getConferenceByPartId('1769')
      // this.meetingInfo[(user.userId || '').toString()] = { startTime: '' };
      // return;
      this.zoomService
        .getConferenceByVendorOrderId(user.vendorOrderId.toString(), this.userService.getUserInfo().id, user.userId)
        // 388)
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
    } else {
      this.zoomService
        .getConferenceByBidOrderId(this.bidOrderId.toString(), this.userService.getUserInfo().id, user.userId)
        // 388)
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
  }

  // TODO remove this method after vendor order details api start return vendor order id
  getVendorOrders(bidProcessIds: Array<number>) {
    if ((bidProcessIds || []).length > 0) {
      const arr = bidProcessIds.map(id => this.ordersService.getVendorOrderInfo(id));
      forkJoin(arr).subscribe(orders => {
        const items = (orders || []).reduce((acc: any, value: any) => {
          acc[value.bidProcessId] = value;
          return acc;
        }, {});
        this.bidding = (this.bidding || []).map((bid: any) => {
          const order = items[bid.bidProcessId];
          bid.vendorOrderId = order ? order.id : null;
          return bid;
        });
        this.getFindAllScheduledMeeting();
      });
    }
  }

  getFindAllScheduledMeeting() {
    if (this.bidding.length) {
      this.bidding.forEach(user => {
        this.getScheduledMeetings(user);
      });
    }
  }
}
