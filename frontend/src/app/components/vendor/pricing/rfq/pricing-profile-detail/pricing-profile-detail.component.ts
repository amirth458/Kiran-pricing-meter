import { UserService } from "src/app/service/user.service";
import { CustomerData } from "src/app/model/user.model";
import {
  Part,
  RfqData,
  PartQuote,
  PricingProfileDetailedView
} from "./../../../../../model/part.model";
import { NgxSpinnerService } from "ngx-spinner";
import { RfqPricingService } from "./../../../../../service/rfq-pricing.service";
import { FileViewRendererComponent } from "./../../../../../common/file-view-renderer/file-view-renderer.component";
import { Component, OnInit } from "@angular/core";
import { GridOptions } from "ag-grid-community";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest } from "rxjs";
import { MetadataService } from "src/app/service/metadata.service";
import { CurrencyPipe } from "@angular/common";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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
      // {
      //   headerName: "Roughness",
      //   field: "roughness",
      //   hide: false,
      //   sortable: true,
      //   filter: false,
      //   cellClass: "text-center"
      // },
      // {
      //   headerName: "Post-Process",
      //   field: "postProcess",
      //   hide: false,
      //   sortable: true,
      //   filter: true,
      //   cellClass: "text-center"
      // },
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
        headerName: "Invoice Item",
        field: "invoiceItem",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Line Item",
        field: "lineItem",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Value ($)",
        field: "value",
        hide: false,
        sortable: true,
        filter: false
      }
    ],
    [
      {
        headerName: "Invoice Item",
        field: "invoiceItem",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Line Item",
        field: "lineItem",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Value ($)",
        field: "value",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Per",
        field: "per",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Part Value",
        field: "partValue",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Units",
        field: "units",
        hide: false,
        sortable: true,
        filter: false
      }
    ],
    [
      {
        headerName: "Invoice Item",
        field: "invoiceItem",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Line Item",
        field: "lineItem",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Multiplier",
        field: "multiplier",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Multiplier Value",
        field: "multiplierValue",
        hide: false,
        sortable: true,
        filter: false
      }
    ]
  ];
  gridOptions = {
    partDetail: {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[0],
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    },
    flatCharge: {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[1],
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    },
    variableCharge: {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[2],
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    },
    multiplierCharge: {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[3],
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    }
  };
  rowData = [];
  flatRowData = [];
  variableRowData = [];
  multiplierRowData = [];
  postProcesses;

  part: Part;
  partQuote: PartQuote;
  rfq: RfqData;
  pricingProfile: PricingProfileDetailedView;
  customer: CustomerData;
  partId: any;
  profileId: any;

  constructor(
    private pricingService: RfqPricingService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private currencyPipe: CurrencyPipe,
    private modalService: NgbModal
  ) {
    this.route.params.subscribe(params => {
      this.partId = params.partId;
      this.profileId = params.profileId;

      this.spinner.show();

      combineLatest(
        this.pricingService.getPartDetail(this.partId),
        this.pricingService.getPartQuote(this.partId)
      ).subscribe(([part, partQuote]) => {
        this.part = part;
        this.partQuote = partQuote;

        combineLatest(
          this.userService.getCustomer(this.part.rfqMedia.media.customerId),
          this.pricingService.getPricingProfileDetail([this.profileId])
        ).subscribe(([customer, pricingProfiles]) => {
          this.pricingProfile = pricingProfiles[0];
          this.customer = customer;
          this.updateData();
          this.spinner.hide();
        });
      });
    });
  }

  ngOnInit() {}

  onGridReady(ev, type) {
    this.gridOptions[type].api = ev.api;
    this.gridOptions[type].api.sizeColumnsToFit();
  }

  backButton() {
    this.router.navigateByUrl(
      this.router.url.substr(0, this.router.url.indexOf("/pricing-profile"))
    );
  }

  updateData() {
    if (!this.pricingProfile) {
      return;
    }
    this.rowData = [
      {
        id: this.part.id,
        customer: this.customer.name,
        rfq: this.part.rfqMedia.projectRfqId,
        part: this.part.rfqMedia.projectRfqId + "." + this.part.id,
        filename: this.part.rfqMedia.media.name,
        quantity: this.part.quantity,
        material: this.part.materialName,
        process: this.part.processTypeName,
        roughness: "",
        postProcess: "",
        price: this.partQuote
          ? this.currencyPipe.transform(
              this.partQuote.totalCost,
              "USD",
              "symbol",
              "0.0-3"
            )
          : this.part.partStatusType.displayName
      }
    ];

    this.pricingProfile.processPricingParameterList.forEach(param => {
      switch (param.invoiceLineItem.processPricingParameterGroup.name) {
        case "flat_charges":
          this.flatRowData.push({
            invoiceItem: param.invoiceLineItem.invoiceItem.name,
            lineItem: param.invoiceLineItem.name,
            value: param.price
          });
          break;
        case "multipliers":
          this.multiplierRowData.push({
            invoiceItem: param.invoiceLineItem.invoiceItem.name,
            lineItem: param.invoiceLineItem.name,
            multiplier: param.multiplier,
            multiplierValue:
              param.multiplierProcessPricingParameter.invoiceLineItem.name
          });
          break;
        case "variable_charges":
          this.variableRowData.push({
            invoiceItem: param.invoiceLineItem.invoiceItem.name,
            lineItem: param.invoiceLineItem.name,
            value: param.price,
            per: param.quantity,
            partValue: param.processPricingConditionType.name,
            units: param.quantityUnitType.name
          });
          break;
      }
    });
    this.flatRowData = [...this.flatRowData];
    this.multiplierRowData = [...this.multiplierRowData];
    this.variableRowData = [...this.variableRowData];
  }

  getPostProcess(id) {
    const found =
      this.part.postProcessTypeIds &&
      this.postProcesses.find(
        postProcess => postProcess.id == this.part.postProcessTypeIds[id]
      );
    return found && found.name;
  }

  showModal(content) {
    this.modalService.open(content, {
      centered: true,
      windowClass: "pricing-view-modal"
    });
  }
}
