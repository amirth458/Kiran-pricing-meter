import {UserService} from "./../../../../../service/user.service";
import {OrdersService} from "./../../../../../service/orders.service";
import {FileViewRendererComponent} from "./../../../../../common/file-view-renderer/file-view-renderer.component";
import {Component, OnInit, ViewChild} from "@angular/core";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRoute, Router} from "@angular/router";
import {GridOptions} from "ag-grid-community";

@Component({
  selector: "app-vendor-details",
  templateUrl: "./vendor-details.component.html",
  styleUrls: ["./vendor-details.component.css"]
})
export class VendorDetailsComponent implements OnInit {
  type;
  orderId;

  @ViewChild("pricingProfileModal") pricingProfileModal;

  changePriority = false;

  columnDefs = [];
  vendorIds = [];

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  gridOptions: GridOptions[];
  subOrderRelease;
  matchedProfiles = [];
  priorityRows = [];
  pricingProfile = [];

  orderDetails = [];

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService,
    private userService: UserService
  ) {
    if (this.router.url.includes("order-confirmation-queue")) {
      this.type = "confirmation";
    } else if (this.router.url.includes("released-orders")) {
      this.type = "released";
    } else {
      this.type = "release";
    }

    this.orderDetails = JSON.parse(localStorage.getItem("selectedSubOrders"));

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
            const processPricingView = (item.processPricingViews || []).length > 0 ? item.processPricingViews[0] : null;
            const found = this.matchedProfiles.some(match => {
              return (match.id === processProfileView.vendorId &&
                match.profileId === item.processProfileId);
            });
            let id = found ? '' : processProfileView.vendorId;
            let priority = found ? '' : this.matchedProfiles.length + 1;
            if (!found) {
              this.matchedProfiles.push({
                id,
                profileId: item.processProfileId,
                vendorName: item.vendorProfile.name,
                processProfileName: processProfileView.name,
                facilityName: processProfileView.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.vendorFacility.name,
                pricingProfile: processPricingView ? processPricingView.name : '',
                releasePriority: priority,
                pricing: item.processPricingViews
              });
            }
          });
          this.priorityRows = this.matchedProfiles.filter(
            item => item.id !== ""
          );
        });
    });
  }

  initTable() {
    this.columnDefs = [
      [
        {
          headerName: "Customer Order",
          field: "customerOrder",
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: "Sub-Order",
          field: "subOrder",
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: "File Name",
          field: "fileName",
          hide: false,
          sortable: true,
          filter: false,
          cellRenderer: "fileViewRenderer"
        },
        {
          headerName: "Price Accepted",
          field: "priceAccepted",
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: "Customer",
          field: "customerName",
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: "Quantity",
          field: "quantity",
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: "Material",
          field: "materialName",
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: "Process",
          field: "process",
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: "NDA",
          field: "nda",
          hide: true,
          sortable: true,
          filter: false
        },
        {
          headerName: "Post-Process",
          field: "postProcessTypeNames",
          hide: false,
          sortable: true,
          filter: false
        },
        // {
        //   headerName: "Previously Ordered",
        //   field: "previouslyOrdered",
        //   hide: false,
        //   sortable: true,
        //   filter: false
        // },
        // {
        //   headerName: "First Shipment",
        //   field: "firstShipment",
        //   hide: false,
        //   sortable: true,
        //   filter: false
        // },
        {
          headerName: "Delivery Date",
          field: "deliveryDate",
          hide: false,
          sortable: true,
          filter: false
        }
      ],
      [
        {
          headerName: "No",
          field: "id",
          hide: false,
          sortable: false,
          filter: false,
          rowDrag: true
        },
        {
          headerName: "Vendor Name",
          field: "vendorName",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Process Profile Name",
          field: "processProfileName",
          hide: false,
          sortable: false,
          filter: false
        }
      ],
      [
        {
          headerName: "No",
          field: "id",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Corporate Name",
          field: "vendorName",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Facility Name",
          field: "facilityName",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Process Profile Name",
          field: "processProfileName",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Pricing Profile",
          field: "pricingProfile",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Release Priority",
          field: "releasePriority",
          hide: false,
          sortable: false,
          filter: false
        }
      ],
      [
        {
          headerName: "Pricing No",
          field: "id",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Pricing Profile Name",
          field: "name",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Pricing Condition 1",
          field: "pricingCondition",
          hide: false,
          sortable: false,
          filter: false
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
          console.log(ev.data);
          this.pricingProfile = ev.data.pricing;
          this.modalService.open(this.pricingProfileModal, {
            centered: true,
            windowClass: "confirm-release-modal"
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
        windowClass: "confirm-release-modal"
      });
    });
  }

  confirmSubOrderRelease() {
    this.modalService.dismissAll();
    this.router.navigateByUrl(
      "/pricing/orders/order-confirmation-queue/" + this.orderId
    );
  }

  toggleChangePriority() {
    this.changePriority = !this.changePriority;
  }
}
