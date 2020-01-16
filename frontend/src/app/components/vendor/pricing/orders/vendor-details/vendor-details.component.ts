import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions} from 'ag-grid-community';

import { BiddingService } from '../../../../../service/bidding.service';
import { ConfirmSubOrderRelease } from '../../../../../model/confirm.sub-order.release';
import { FileViewRendererComponent } from './../../../../../common/file-view-renderer/file-view-renderer.component';
import { OrdersService } from './../../../../../service/orders.service';
import { UserService } from './../../../../../service/user.service';

@Component({
  selector: 'app-vendor-details',
  templateUrl: './vendor-details.component.html',
  styleUrls: ['./vendor-details.component.css']
})
export class VendorDetailsComponent implements OnInit {
  type;
  orderId;

  @ViewChild('pricingProfileModal') pricingProfileModal;

  changePriority = false;

  columnDefs = [];

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  gridOptions: GridOptions[];
  subOrderRelease;
  matchedProfiles = [];
  priorityRows = [];
  pricingProfile: any;
  initialPrice: number;

  orderDetails = [];

  constructor(
    public biddingService: BiddingService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private userService: UserService
  ) {
    if (this.router.url.includes('order-confirmation-queue')) {
      this.type = 'confirmation';
    } else if (this.router.url.includes('released-orders')) {
      this.type = 'released';
    } else {
      this.type = 'release';
    }
    this.initialPrice = 0;
    this.orderDetails = JSON.parse(localStorage.getItem('selectedSubOrders'));
    (this.orderDetails).map(order => (this.initialPrice+= order.priceAccepted));

    this.initTable();

    this.route.params.subscribe(v => {
      this.orderId = v.orderId || null;
      this.ordersService
        .getMatchedProfiles(
          this.userService.getUserInfo().id,
          this.orderDetails.map(orderDetail => orderDetail.rfqMediaId)
        )
        .subscribe(v => {
          this.matchedProfiles = [];
          v.map(item => {
            const processProfileView = item.processProfileView;
            const processPricingView = (item.processPricingViews || []).length > 0 ? item.processPricingViews[0] : {};
            const found = this.matchedProfiles.some(match => {
              return (match.id === processProfileView.vendorId &&
                match.profileId === item.processProfileId);
            });
            let id = found ? '' : processProfileView.vendorId;
            let priority = found ? '' : this.matchedProfiles.length + 1;
            if (!found) {
              const title = [];
              (item.processPricingViews || []).map(p => title.push(p.name));
              this.matchedProfiles.push({
                id: this.matchedProfiles.length + 1,
                vendorId: id,
                title : title.join(' , '),
                profileId: item.processProfileId,
                vendorName: item.vendorProfile.name,
                processProfileName: processProfileView.name,
                facilityName: processProfileView.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.vendorFacility.name,
                pricingProfile: processPricingView.name || '',
                releasePriority: priority,
                pricing: item.processPricingViews,
                vendorProfile: item.vendorProfile
              });
            }
          });
          this.priorityRows = this.matchedProfiles.filter(
            item => item.id !== ''
          );
        });
    });
  }

  initTable() {
    this.columnDefs = [
      [
        {
          headerName: 'Customer Order',
          field: 'customerOrder',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Sub-Order',
          field: 'subOrder',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'File Name',
          field: 'fileName',
          hide: false,
          sortable: true,
          filter: false,
          cellRenderer: 'fileViewRenderer'
        },
        {
          headerName: 'Price Accepted',
          field: 'priceAccepted',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Customer',
          field: 'customerName',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Quantity',
          field: 'quantity',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Material',
          field: 'materialName',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Process',
          field: 'process',
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: 'NDA',
          field: 'nda',
          hide: true,
          sortable: true,
          filter: false
        },
        {
          headerName: 'Post-Process',
          field: 'postProcessTypeNames',
          hide: false,
          sortable: true,
          filter: false
        },
        // {
        //   headerName: 'Previously Ordered',
        //   field: 'previouslyOrdered',
        //   hide: false,
        //   sortable: true,
        //   filter: false
        // },
        // {
        //   headerName: 'First Shipment',
        //   field: 'firstShipment',
        //   hide: false,
        //   sortable: true,
        //   filter: false
        // },
        {
          headerName: 'Delivery Date',
          field: 'deliveryDate',
          hide: false,
          sortable: true,
          filter: false
        }
      ],
      [
        {
          headerName: 'No',
          field: 'id',
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
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Process Profile Name',
          field: 'processProfileName',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Release Priority',
          field: 'releasePriority',
          hide: false,
          sortable: false,
          filter: false
        }
      ],
      [
        {
          headerName: 'No',
          field: 'id',
          width: 100,
          maxWidth: 100,
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Corporate Name',
          field: 'vendorName',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Facility Name',
          field: 'facilityName',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Process Profile Name',
          field: 'processProfileName',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Pricing Profile',
          field: 'pricingProfile',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Release Priority',
          field: 'releasePriority',
          hide: false,
          sortable: false,
          filter: false
        }
      ],
      [
        {
          headerName: 'Pricing No',
          field: 'id',
          width: 100,
          maxWidth: 100,
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Pricing Profile Name',
          field: 'name',
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: 'Pricing Condition 1',
          field: 'processPricingConditionList',
          hide: false,
          sortable: false,
          filter: false,
          valueFormatter: dt => {
            const arr = [];
            (dt.value || []).map(condition => {
              arr.push(`${condition.processPricingConditionType.name || ''} ${condition.operatorType.symbol || ''} ${condition.value || ''} ${condition.unitType.symbol || ''}`);
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
  }

  onGridReady(idx, ev) {
    this.gridOptions[idx].api = ev.api;
    this.gridOptions[idx].api.sizeColumnsToFit();
    if (idx === 2) {
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
      return { partId: order.subOrder, priceAccepted: order.priceAccepted };
    });
    const vendorData = {};
    this.matchedProfiles.map(pricing => {
      if(!vendorData[pricing.vendorId]) {
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
    this.biddingService.biddingConfirmation({
      customerOrders,
      bidOfferPrice: (this.initialPrice * (this.subOrderRelease.initialBidSoldPricePercent / 100)),
      bidDuration: this.subOrderRelease.maxBidUnresponsiveTimeMinutes,
      maxSupplierViewOpportunity: this.subOrderRelease.maxSupplierViewOpportunity,
      vendors
    } as ConfirmSubOrderRelease).subscribe(v => {
      this.modalService.dismissAll();
      this.router.navigateByUrl(`/pricing/orders/order-confirmation-queue/${this.orderId}`);
    });
  }

  toggleChangePriority() {
    this.changePriority = !this.changePriority;
  }
}
