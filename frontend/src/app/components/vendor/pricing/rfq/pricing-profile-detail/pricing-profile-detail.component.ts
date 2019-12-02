import { NgxSpinnerService } from "ngx-spinner";
import { RfqPricingService } from "./../../../../../service/rfq-pricing.service";
import { FileViewRendererComponent } from "./../../../../../common/file-view-renderer/file-view-renderer.component";
import { Component, OnInit } from "@angular/core";
import { GridOptions } from "ag-grid-community";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-pricing-profile-detail",
  templateUrl: "./pricing-profile-detail.component.html",
  styleUrls: ["./pricing-profile-detail.component.css"]
})
export class PricingProfileDetailComponent implements OnInit {
  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };
  columnDefs = [
    [
      {
        headerName: "Customer",
        field: "customer",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "RFQ",
        field: "rfq",
        hide: false,
        sortable: true,
        filter: false,
        cellClass: "text-center"
      },
      {
        headerName: "Part",
        field: "part",
        hide: false,
        sortable: true,
        filter: false,
        cellClass: "text-center"
      },
      {
        headerName: "File Name",
        field: "filename",
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer: "fileViewRenderer"
      },
      {
        headerName: "Quantity",
        field: "quantity",
        hide: false,
        sortable: true,
        filter: false,
        cellClass: "text-center"
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
        headerName: "Roughness",
        field: "roughness",
        hide: false,
        sortable: true,
        filter: false,
        cellClass: "text-center"
      },
      {
        headerName: "Post-Process",
        field: "postProcess",
        hide: false,
        sortable: true,
        filter: true,
        cellClass: "text-center"
      },
      {
        headerName: "Price",
        field: "price",
        hide: false,
        sortable: true,
        cellClass: "text-center"
      }
    ],
    [
      {
        headerName: "Vendor Name",
        field: "vendorName",
        hide: false,
        sortable: true,
        filter: false,
        width: 80
      },
      {
        headerName: "Pricing Profile",
        field: "pricingProfile",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Process Profile",
        field: "processProfile",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Post-Process1",
        field: "postProcess1",
        hide: false,
        sortable: true,
        filter: false
      },{
        headerName: "Post-Process2",
        field: "postProcess2",
        hide: false,
        sortable: true,
        filter: false
      },{
        headerName: "Post-Process3",
        field: "postProcess3",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Machines Matched",
        field: "machinesMatched",
        hide: false,
        sortable: true,
        filter: false,
      },
      {
        headerName: "Total Cost",
        field: "totalCost",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Estimated Delivery",
        field: "esitmatedDelivery",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Match Score",
        field: "matchScore",
        hide: false,
        sortable: false,
        filter: false
      }
    ]
  ];
  gridOptions: GridOptions[] = [
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
  rowData = [
    [
      {
        id: 1,
        customer: "DetailCo",
        rfq: "58200",
        part: "58200.1",
        filename: "Rotor_No_Logo.stl",
        quantity: 25,
        material: "ABS M30",
        process: "3D Printing",
        roughness: 1,
        postProcess: "Sand",
        price: "$ 1200"
      }
    ],
    [
      {
        vendorName: "PrintCo",
        pricingProfile: "Standard",
        processProfile: "Fortus 450 ABS M30 30 Micron",
        postProcess1: "Sanding",
        postProcess2: "",
        postProcess3: "",
        machinesMatched: "2",
        totalCost: "$ 1200",
        esitmatedDelivery: "10/12/2019",
        matchScore: 4.9
      }
    ]
  ];
  pricingDetail: any;
  pricingId: any;
  profileId: any;
  type: string;

  priceProfileDetail = {
    processProfileName: 'Fortus 400 - ABS M 30 - Detailed',
    pricingParameterSetNickname: 'Standard 3 cm Test',
    conditions: ['Part Volumn > 3 cubic centimeter (cu cm)', 'Part Quantity> 25 count'],
    items: [{
      invoiceItem: 'Part Cost',
      lineItem: 'Setup Cost',
      value: '$ 3',
      per: '1',
      partValue: 'Setup',
      measurementUnit: 'cubic centimeters(cc)',
      subOrderValue: '130 cc',
      subTotal: 400
    }, {
      invoiceItem: 'Part Cost',
      lineItem: 'Setup Cost',
      value: '$ 3',
      per: '1',
      partValue: 'Setup',
      measurementUnit: 'cubic centimeters(cc)',
      subOrderValue: '130 cc',
      subTotal: 400
    }, {
      invoiceItem: 'Part Cost',
      lineItem: 'Setup Cost',
      value: '$ 3',
      per: '1',
      partValue: 'Setup',
      measurementUnit: 'cubic centimeters(cc)',
      subOrderValue: '130 cc',
      subTotal: 400
    }, ]
  };

  constructor(
    private pricingService: RfqPricingService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      this.pricingId = params.pricingId;
      this.profileId = params.profileId;
      this.type = params.type;
      this.getPricingDetail(this.pricingId);
    });
  }

  ngOnInit() {}

  onGridReady(id, ev) {
    this.gridOptions[id].api = ev.api;
    this.gridOptions[id].api.sizeColumnsToFit();
  }

  async getPricingDetail(id: number) {
    this.pricingDetail = await this.pricingService
      .getPricingDetail(id)
      .toPromise();
  }

  backButton() {
    this.router.navigateByUrl(this.router.url.substr(0, this.router.url.indexOf('/pricing-profile')));
  }
}
