import { OrdersService } from "./../../../../../service/orders.service";
import { FileViewRendererComponent } from "./../../../../../common/file-view-renderer/file-view-renderer.component";
import { Component, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRoute, Router } from "@angular/router";
import { GridOptions } from "ag-grid-community";

@Component({
  selector: "app-vendor-details",
  templateUrl: "./vendor-details.component.html",
  styleUrls: ["./vendor-details.component.css"]
})
export class VendorDetailsComponent implements OnInit {
  type;
  vendorId;

  changePriority = false;

  columnDefs = [];

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  gridOptions: GridOptions[];

  rowData = [
    [
      {
        id: 1,
        customerOrder: 234,
        subOrder: "234.1",
        fileName: "Roter_No_Logo.stl",
        priceAccepted: "$ 334",
        customer: "CompCo",
        quantity: "30",
        material: "ABS M30",
        process: "3D Printing",
        postProcess: "Sanding",
        previouslyOrdered: "Yes",
        firstShipment: "Yes",
        deliveryDate: "09/12/2019"
      },
      {
        id: 2,
        customerOrder: 234,
        subOrder: "234.2",
        fileName: "Roter_No_Logo.stl",
        priceAccepted: "$ 334",
        customer: "CompCo",
        quantity: "30",
        material: "ABS M30",
        process: "3D Printing",
        postProcess: "Sanding",
        previouslyOrdered: "Yes",
        firstShipment: "Yes",
        deliveryDate: "09/12/2019"
      }
    ],
    [
      {
        id: 1,
        pricingProfileRank: 1,
        vendorName: "VensCo",
        processProfileName: "Fortus 900-ABS",
        processProfile: "$ 544",
        postProcessProfileName: "Standard Sanding",
        postProcessPrice: 45,
        postProcessProfileName2: "Standard Sanding",
        postProcessPrice2: 0,
        subtotal: "$ 571.00",
        shippingEstimate: 18.0,
        totalCost: "$ 589.99",
        estimatedDelivery: 5,
        supplierScore: 4.8
      },
      {
        id: 1,
        pricingProfileRank: 1,
        vendorName: "VensCo",
        processProfileName: "Fortus 900-ABS",
        processProfile: "$ 544",
        postProcessProfileName: "Standard Sanding",
        postProcessPrice: 45,
        postProcessProfileName2: "Standard Sanding",
        postProcessPrice2: 0,
        subtotal: "$ 571.00",
        shippingEstimate: 18.0,
        totalCost: "$ 589.99",
        estimatedDelivery: 5,
        supplierScore: 4.8
      },
      {
        id: 2,
        pricingProfileRank: 2,
        vendorName: "VensCo",
        processProfileName: "Fortus 900-ABS",
        processProfile: "$ 544",
        postProcessProfileName: "Standard Sanding",
        postProcessPrice: 45,
        postProcessProfileName2: "Standard Sanding",
        postProcessPrice2: 0,
        subtotal: "$ 571.00",
        shippingEstimate: 18.0,
        totalCost: "$ 589.99",
        estimatedDelivery: 5,
        supplierScore: 4.8
      },
      {
        id: 3,
        pricingProfileRank: 3,
        vendorName: "VensCo",
        processProfileName: "Fortus 900-ABS",
        processProfile: "$ 544",
        postProcessProfileName: "Standard Sanding",
        postProcessPrice: 45,
        postProcessProfileName2: "Standard Sanding",
        postProcessPrice2: 0,
        subtotal: "$ 571.00",
        shippingEstimate: 18.0,
        totalCost: "$ 589.99",
        estimatedDelivery: 5,
        supplierScore: 4.8
      },
      {
        id: 4,
        pricingProfileRank: 4,
        vendorName: "VensCo",
        processProfileName: "Fortus 900-ABS",
        processProfile: "$ 544",
        postProcessProfileName: "Standard Sanding",
        postProcessPrice: 45,
        postProcessProfileName2: "Standard Sanding",
        postProcessPrice2: 0,
        subtotal: "$ 571.00",
        shippingEstimate: 18.0,
        totalCost: "$ 589.99",
        estimatedDelivery: 5,
        supplierScore: 4.8
      },
      {
        id: 5,
        pricingProfileRank: 5,
        vendorName: "VensCo",
        processProfileName: "Fortus 900-ABS",
        processProfile: "$ 544",
        postProcessProfileName: "Standard Sanding",
        postProcessPrice: 45,
        postProcessProfileName2: "Standard Sanding",
        postProcessPrice2: 0,
        subtotal: "$ 571.00",
        shippingEstimate: 18.0,
        totalCost: "$ 589.99",
        estimatedDelivery: 5,
        supplierScore: 4.8
      }
    ]
  ];

  constructor(
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private ordersService: OrdersService
  ) {
    if (this.router.url.includes("order-confirmation-queue")) {
      this.type = "confirmation";
    } else if (this.router.url.includes("released-orders")) {
      this.type = "released";
    } else {
      this.type = "release";
    }

    this.initTable();

    this.route.params.subscribe(v => {
      this.vendorId = v.vendorId;
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
          field: "customer",
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
          field: "material",
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
          headerName: "Post-Process",
          field: "postProcess",
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: "Previously Ordered",
          field: "previouslyOrdered",
          hide: false,
          sortable: true,
          filter: false
        },
        {
          headerName: "First Shipment",
          field: "firstShipment",
          hide: false,
          sortable: true,
          filter: false
        },
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
          headerName: "Pricing Profile Rank",
          field: "pricingProfileRank",
          hide: false,
          sortable: false,
          filter: false,
          rowDrag: true,
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
        },
        {
          headerName: "Process Profile",
          field: "processProfile",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Post-Process Profile Name",
          field: "postProcessProfileName",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Post-Process Price",
          field: "postProcessPrice",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Post-Process Profile Name 2",
          field: "postProcessProfileName2",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Post-Process Price 2",
          field: "postProcessPrice2",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Subtotal",
          field: "subtotal",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Shipping Estimate",
          field: "shippingEstimate",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Total Cost",
          field: "totalCost",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Estimated Deliver by Date",
          field: "estimatedDelivery",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Supplier Score",
          field: "supplierScore",
          hide: false,
          sortable: false,
          filter: false
        },
        {
          headerName: "Status",
          field: "status",
          hide: this.type === 'release',
          sortable: false,
          filter: false
        }
      ]
    ];

    this.gridOptions  = [
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

  ngOnInit() {}

  onGridReady(idx, ev) {
    this.gridOptions[idx].api = ev.api;
    this.gridOptions[idx].api.sizeColumnsToFit();
    if (idx === 1) {
      this.gridOptions[1].api.setSuppressRowDrag(true);
    }
  }

  showModal(content) {
    this.modalService.open(content, {
      centered: true,
      windowClass: "confirm-release-modal"
    });
  }

  confirmSubOrderRelease() {
    this.modalService.dismissAll();
    this.router.navigateByUrl('/pricing/orders/order-confirmation-queue/' + this.vendorId);
  }

  toggleChangePriority() {
    this.changePriority = !this.changePriority;
    if (this.changePriority) {
      this.gridOptions[1].api.setSuppressRowDrag(false);
    } else {
      this.gridOptions[1].api.setSuppressRowDrag(true);
    }
  }
}
