import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

import { catchError, switchMap } from 'rxjs/operators';
import { empty } from 'rxjs';

import { BiddingService } from '../../../../../service/bidding.service';
import { BiddingStatus } from '../../../../../model/bidding.order';
import {
  BidOrderItem,
  ConfirmSubOrderRelease
} from '../../../../../model/confirm.sub-order.release';
import { FileViewRendererComponent } from '../../../../../common/file-view-renderer/file-view-renderer.component';
import { OrdersService } from '../../../../../service/orders.service';
import { TemplateRendererComponent } from '../../../../../common/template-renderer/template-renderer.component';
import { UserService } from '../../../../../service/user.service';
import { VendorOrderDetail } from '../../../../../model/bidding.order.detail';
import { Util } from '../../../../../util/Util';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent implements OnInit {
  biddingStatus = BiddingStatus;
  type;
  orderId;
  bidOrderId: number;
  @ViewChild('pricingProfileModal') pricingProfileModal;
  @ViewChild('statusCell') statusCell: TemplateRef<any>;
  @ViewChild('confirmBidding') confirmBidding: TemplateRef<any>;

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
    public currencyPipe: CurrencyPipe
  ) {
    if (this.router.url.includes('order-confirmation-queue')) {
      this.type = 'confirmation';
    } else if (this.router.url.includes('released-orders')) {
      this.type = 'released';
    } else {
      this.type = 'release';
    }
    this.initialPrice = 0;
    this.initTable();
    this.route.params.subscribe(v => {
      this.orderId = v.orderId || null;
      this.bidOrderId = v.bidOrderId || null;
      if (!this.bidOrderId) {
        this.orderDetails = JSON.parse(
          localStorage.getItem('admin-selectedSubOrders')
        );
        (this.orderDetails || []).map(
          order => (this.initialPrice += order.priceAccepted)
        );
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
                item.processPricingViews &&
                (item.processPricingViews || []).length > 0
                  ? item.processPricingViews[0]
                  : {};
              const found = this.matchedProfiles.some(match => {
                return match.vendorId === processProfileView.vendorId;
              });
              if (!found) {
                count++;
              }
              let id = !found ? count.toString() : '';
              let priority = !found ? count.toString() : '';
              this.matchedProfiles.push({
                id,
                vendorId: processProfileView.vendorId,
                profileId: item.processProfileId,
                vendorName: item.vendorProfile ? item.vendorProfile.name : '',
                processProfileName: processProfileView.name || '',
                facilityName:
                  processProfileView.processMachineServingMaterialList[0]
                    .machineServingMaterial.vendorMachinery.vendorFacility
                    .name || '',
                pricingProfile:
                  (processPricingView && processPricingView.name) || '',
                releasePriority: priority,
                pricing: item.processPricingViews || [],
                vendorProfile: item.vendorProfile
              });
            });
            this.priorityRows = this.matchedProfiles.filter(
              item => item.id !== ''
            );
            this.spinner.hide('spooler');
            this.loadingProfiles = false;
          });
      } else {
        this.prepareBidOrderInfo();
      }
    });
  }

  prepareBidOrderInfo() {
    this.ordersService.getBidOrderDetailsById(this.bidOrderId).subscribe(v => {
      // this.orderDetails = v.acceptedOrderDetails || [];
      let count = 0;
      this.timeToExpire = v.bidProcessTimeLeft;
      this.bidding = v.matchingSuppliersProfilesView || [];
      this.bidding.map(match => (match.id = ++count));
      const vendors = [];
      this.bidding.map(match => {
        (match.processProfileViews || []).map(p => {
          let count = match.id.toString();
          let status = match.bidProcessStatus;
          if (!(vendors.indexOf(match.vendorName) > -1)) {
            vendors.push(match.vendorName);
          } else {
            count = '';
            status = null;
          }
          this.matchedProfiles.push({
            id: count,
            vendorId: p.vendorId,
            profileId: p.id,
            vendorName: match.vendorName,
            processProfileName: p.name,
            facilityName:
              p.processMachineServingMaterialList[0].machineServingMaterial
                .vendorMachinery.vendorFacility.name,
            pricingProfile: (p.processPricingList || []).length,
            bidProcessStatus: status,
            counterOfferPrice: match.counterOfferPrice,
            bidOfferPrice: match.bidOfferPrice
          });
        });
      });
      this.ordersService
        .getPartQuotesByPartIds(
          (v.acceptedOrderDetails || []).map(p => p.partId)
        )
        .pipe(
          switchMap(parts =>
            this.ordersService.mergePartQuoteInfo(v.acceptedOrderDetails)
          )
        )
        .subscribe(v => {
          this.orderDetails = v || [];
        });
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
            return this.currencyPipe.transform(
              dt.value || 0,
              'USD',
              'symbol',
              '0.0-3'
            );
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
          valueFormatter: dt =>
            dt.value
              ? `${this.datePipe.transform(dt.value, Util.dateFormat)}`
              : ''
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
                `${condition.processPricingConditionType.name || ''} ${condition
                  .operatorType.symbol || ''} ${condition.value ||
                  ''} ${condition.unitType.symbol || ''}`
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

  ngOnInit() {
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
        filter: false
      },
      {
        headerName: 'Vendor Bid Price',
        field: 'bidOfferPrice',
        tooltipField: 'bidOfferPrice',
        hide: false,
        sortable: false,
        filter: false,
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
        cellClass: 'p-0',
        hide: false,
        sortable: false,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.statusCell
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
      rowHeight: 36,
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
    const popIndex = this.priorityRows.findIndex(
      item => item.id === overNode.data.id
    );
    const pushIndex = ev.overIndex;
    this.priorityRows.splice(popIndex, 1);
    this.priorityRows.splice(pushIndex, 0, overNode.data);
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

  confirmSubOrderRelease() {
    const customerOrders = this.orderDetails.map(order => {
      return { partId: order.partId, priceAccepted: order.priceAccepted };
    });
    const vendorData = {};
    this.matchedProfiles.map(pricing => {
      if (!vendorData[pricing.vendorId]) {
        vendorData[pricing.vendorId] = {
          id: pricing.vendorId,
          postProcessProfileIds: [pricing.profileId],
          processProfileIds: [],
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
        bidOfferPrice:
          this.initialPrice *
          (this.subOrderRelease.initialBidSoldPricePercent / 100),
        bidDuration: this.subOrderRelease.maxBidUnresponsiveTimeMinutes,
        maxSupplierViewOpportunity: this.subOrderRelease
          .maxSupplierViewOpportunity,
        vendors
      } as ConfirmSubOrderRelease)
      .subscribe(v => {
        this.modalService.dismissAll();
        if (v != null) {
          const bidOrder: BidOrderItem =
            (v.bidOrderItemList || []).length > 0
              ? v.bidOrderItemList[0]
              : null;
          this.router.navigateByUrl(
            `/pricing/orders/order-confirmation-queue/${bidOrder.bidOrder.id}`
          );
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

  onConfirmBidding() {
    const processProfileView =
      (this.selectedBidding.processProfileViews || []).length > 0
        ? this.selectedBidding.processProfileViews[0]
        : null;
    if (processProfileView) {
      this.spinner.show();
      this.biddingService
        .confirmBidOrder(
          this.bidOrderId,
          this.selectedBidding.bidProcessId,
          processProfileView.vendorId
        )
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
          this.router.navigateByUrl(
            `/pricing/orders/released-orders/${this.bidOrderId}`
          );
        });
    } else {
      this.toaster.error(
        'There is no process profile associated wit this bidding!'
      );
    }
  }
}
