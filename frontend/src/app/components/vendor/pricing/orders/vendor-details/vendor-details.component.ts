import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions, ColDef } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { catchError, filter, map, share, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, empty, forkJoin, Observable } from 'rxjs';

import { BiddingService } from '../../../../../service/bidding.service';
import { BiddingOrderStatus, BiddingStatus } from '../../../../../model/bidding.order';
import { Conference, ConferenceRequest } from '../../../../../model/conference.model';
import { BidOrderItem, ConfirmSubOrderRelease, MatchedProfile } from '../../../../../model/confirm.sub-order.release';
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
  @ViewChild('viewPricingProfile') viewPricingProfile;
  @ViewChild('statusCell') statusCell: TemplateRef<any>;
  @ViewChild('sendEmailCell') sendEmailCell: TemplateRef<any>;
  @ViewChild('confirmBidding') confirmBidding: TemplateRef<any>;
  @ViewChild('supplierStatusCell') supplierStatusCell: TemplateRef<any>;

  @ViewChild('sendMailModal') sendMailModal;
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
  subOrderRelease;
  matchedProfiles: Array<MatchedProfile> | any = [];
  priorityRows = [];
  nonPriorityRows = [];
  processProfile: ProcessProfile;
  initialPrice: number;
  orderDetails = [];
  bidding: Array<VendorOrderDetail>;
  selectedBidding: any;
  vendorOrderId: number;
  bidOrderStatus: MetaData;

  blockedSuppliers$: BehaviorSubject<Array<number>> = new BehaviorSubject<Array<number>>(null);
  suppliers$: Observable<Array<number>>;
  selectedBidProcessId: number;

  vendorIds$: BehaviorSubject<Array<number>> = new BehaviorSubject<Array<number>>(null);
  matches$: Observable<Array<MatchedProfile> | any>;

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
    public zoomService: ZoomService,
    public pricingService: RfqPricingService
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
        const selectedSubOrders = localStorage.getItem('admin-selectedSubOrders');
        if (!selectedSubOrders) {
          this.router.navigateByUrl('/pricing/orders/suborder-release-queue');
          return;
        }
        this.orderDetails = JSON.parse(selectedSubOrders);
        (this.orderDetails || []).map(order => (this.initialPrice += order.priceAccepted));
        this.spinner.show('spooler');
        this.loadingProfiles = true;
        this.ordersService
          .getMatchingProcessProfiles(
            this.orderDetails.map(orderDetail => orderDetail.rfqMediaId),
            false
          )
          .subscribe(suppliers => {
            this.matchedProfiles = [];
            let count = 0;
            suppliers.map(supplier => {
              const found = this.matchedProfiles.some(match => {
                return match.vendorId === supplier.vendorId;
              });
              if (!found && supplier.confidentialityId === Confidentiality.YES) {
                // Filter out Vendors with NDA(ProdEx Orders) turned ON
                count++;
              }
              if (!supplier.confidentialityId || supplier.confidentialityId === Confidentiality.NO) {
                // Vendors with NDA(ProdEx Orders) turned OFF
                this.nonPriorityRows.push({
                  id: !this.nonPriorityRows.some(match => {
                    return match.vendorId === supplier.vendorId;
                  })
                    ? supplier.vendorId.toString()
                    : '',
                  vendorId: supplier.vendorId,
                  profileId: supplier.processProfileId,
                  vendorName: supplier.corporateName,
                  processProfileName: supplier.processProfileName || '',
                  facilityName: supplier.facilityName,
                  releasePriority: '-',
                  vendorProfile: {
                    street1: supplier.street1,
                    street2: supplier.street2,
                    state: supplier.state,
                    city: supplier.city,
                    country: '',
                    zipCode: supplier.zipCode,
                    subscriptionId: supplier.subscriptionId,
                    subscriptionType: supplier.subscriptionType
                  },
                  active: false,
                  confidentialityId: supplier.confidentialityId
                });
              } else {
                this.matchedProfiles.push({
                  id: !found ? supplier.vendorId.toString() : '',
                  vendorId: supplier.vendorId,
                  profileId: supplier.processProfileId,
                  vendorName: supplier.corporateName,
                  processProfileName: supplier.processProfileName || '',
                  facilityName: supplier.facilityName || '',
                  releasePriority: !found ? count : '',
                  vendorProfile: {
                    street1: supplier.street1 || '',
                    street2: supplier.street2 || '',
                    state: supplier.state || '',
                    city: supplier.city || '',
                    country: '',
                    zipCode: supplier.zipCode || '',
                    subscriptionId: supplier.subscriptionId || '',
                    subscriptionType: supplier.subscriptionType || ''
                  },
                  active: true,
                  confidentialityId: supplier.confidentialityId
                });
              }
            });
            this.matchedProfiles = this.matchedProfiles.concat(this.nonPriorityRows);
            this.priorityRows = this.matchedProfiles.filter(
              item => item.id !== '' && item.confidentialityId === Confidentiality.YES
            );
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
        filter: false,
        checkboxSelection: this.type !== 'released' // Released
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
        valueFormatter: dt => `$ ${dt.data.bidOfferPrice || 0}`
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
    this.matches$ = this.vendorIds$.pipe(
      filter(value => !!value),
      tap(() => this.spinner.show('spooler')),
      switchMap(values => this.ordersService.getMatchedProcessProfiles(this.bidOrderId, values)),
      map(items => {
        const arr = [];
        const vendors = [];
        let count = 0;
        (items || []).map((match: any) => {
          (match.processProfieBidViews || []).map(view => {
            let counterValue = '';
            let status = match.bidProcessStatusType || {};
            let itemInfo: any = null;
            if (!(vendors.indexOf(view.vendorName) > -1)) {
              vendors.push(view.vendorName);
              counterValue = (++count).toString();
              if (this.type === 'released') {
                const prices = this.bidding.filter((bidding: any) => bidding.vendorId === match.vendorId);
                itemInfo = prices.length > 0 ? prices[0] : null;
              }
            } else {
              status = null;
            }
            arr.push({
              id: counterValue,
              vendorId: match.vendorId,
              profileId: view.processProfileId,
              vendorName: view.vendorName,
              processProfileName: view.processProfileName,
              facilityName: (view.facilityNames || []).join(','),
              pricingProfile: view.pricingProfileCount || 0,
              bidProcessStatus: status,
              counterOfferPrice: itemInfo ? itemInfo.counterOfferPrice : null,
              bidOfferPrice: itemInfo ? itemInfo.bidOfferPrice : null,
              bidProcessId: itemInfo ? itemInfo.bidProcessId : null
            });
          });
        });
        return {
          items: arr,
          length: (arr || []).length
        };
      }),
      tap(() => this.spinner.hide('spooler')),
      share()
    );
  }

  prepareBidOrderInfo() {
    this.ordersService.getBidOrderDetailsById(this.bidOrderId, this.type === 'released').subscribe(v => {
      let count = 0;
      this.timeToExpire = v.bidProcessTimeLeft;
      this.bidding = (v.matchingSuppliersProfilesView || []).map(user => {
        return { ...user };
      });
      const users = [];
      (this.bidding || []).map((bidding: any) => {
        if (users.indexOf(bidding.vendorId) === -1) {
          users.push(bidding.vendorId);
        }
      });
      this.vendorIds$.next(users);
      this.bidOrderStatus = (v ? v.bidOrderStatus || {} : {}) as MetaData;
      this.bidding.map(match => (match.id = ++count));
      this.ordersService
        .getPartQuotesByPartIds((v.acceptedOrderDetails || []).map(p => p.partId))
        .pipe(switchMap(parts => this.ordersService.mergePartQuoteInfo(v.acceptedOrderDetails)))
        .subscribe(resultData => {
          this.orderDetails = resultData || [];
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
          headerName: 'Vendor ID',
          field: 'vendorId',
          hide: true,
          sortable: true,
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
          headerName: 'Signed ProdEx Agreement',
          field: 'confidentialityId',
          tooltipField: 'confidentialityId',
          hide: false,
          sortable: false,
          filter: false,
          cellClass: params =>
            params.value && params.value === Confidentiality.YES ? 'text-theme-green' : 'text-orange',
          valueFormatter: params => {
            return params.value && params.value === Confidentiality.YES ? 'Yes' : 'No';
          }
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
          field: 'vendorProfile',
          tooltipField: 'vendorProfile',
          hide: false,
          sortable: false,
          filter: false,
          valueGetter: params => {
            return params.data.id
              ? `${params.data.vendorProfile.street1}, ${params.data.vendorProfile.city} ${params.data.vendorProfile.state}`
              : '';
          }
        },
        {
          headerName: 'Pricing Profile',
          field: 'pricingProfile',
          tooltipField: 'pricingProfile',
          hide: false,
          sortable: false,
          filter: false,
          cellRenderer: 'templateRenderer',
          cellRendererParams: {
            ngTemplate: this.viewPricingProfile
          }
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
          field: 'processPricingConditions',
          tooltipField: 'processPricingConditions',
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
        headerHeight: 35
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
      const sort = [
        {
          colId: 'vendorId',
          sort: 'asc'
        }
      ];
      this.gridOptions[2].api.setSortModel(sort);
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
    this.matchedProfiles = arr.concat(this.nonPriorityRows);
  }

  groupSupplierInfo(xs: any, key: string) {
    return xs.reduce((rv, x) => {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  openPricingView(row) {
    this.processProfile = null;
    this.spinner.show();
    this.pricingService.getProcessProfileDetail([row.profileId]).subscribe(
      res => {
        if (res.length) {
          this.processProfile = res[0];
        }
        this.spinner.hide();
        this.modalService.open(this.pricingProfileModal, {
          centered: true,
          windowClass: 'confirm-release-modal'
        });
      },
      err => {
        this.spinner.hide();
        console.log({ err });
      }
    );
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
      .filter(
        row => row.releasePriority !== '-' && !((this.blockedSuppliers$.getValue() || []).indexOf(row.vendorId) > -1)
      )
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
    // tslint:disable-next-line:forin
    for (const key in vendorData) {
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
    if (this.selectedBidding && this.selectedBidding.bidProcessId && this.selectedBidding.vendorId) {
      this.spinner.show();
      this.biddingService
        .confirmBidOrder(this.bidOrderId, this.selectedBidding.bidProcessId, this.selectedBidding.vendorId)
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
      this.toaster.error('Invalid bid process!');
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
  }

  onTimeChanged(event) {
    this.spinner.show();
    const meetingTime = new Date(event).toISOString();
    const conference: ConferenceRequest = {
      hostUserId: this.userService.getUserInfo().id,
      participantUserId: this.schdulingForUserId,
      partId: 0,
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

  getScheduledMeetings(user) {
    if (this.type === 'released') {
      this.zoomService
        .getConferenceByVendorOrderId(user.vendorOrderId.toString(), this.userService.getUserInfo().id, user.userId)
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

  clickMeetingTime(ev) {
    ev.stopPropagation();
  }
}
