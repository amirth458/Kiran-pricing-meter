import { UserService } from "src/app/service/user.service";
import { CustomerData } from "src/app/model/user.model";
import {
  PricingProfile,
  Part,
  RfqData
} from "./../../../../../model/part.model";
import { NgxSpinnerService } from "ngx-spinner";
import { RfqPricingService } from "./../../../../../service/rfq-pricing.service";
import { FileViewRendererComponent } from "./../../../../../common/file-view-renderer/file-view-renderer.component";
import { Component, OnInit } from "@angular/core";
import { GridOptions } from "ag-grid-community";
import { ActivatedRoute, Router } from "@angular/router";
import { combineLatest } from "rxjs";
import { MetadataService } from "src/app/service/metadata.service";

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
        headerName: "Material",
        field: "material",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Equipment",
        field: "equipment",
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
      // {
      //   headerName: "Post-Process",
      //   field: "postProcess",
      //   hide: false,
      //   sortable: true,
      //   filter: false
      // },
      // {
      //   headerName: "Machines Matched",
      //   field: "machinesMatched",
      //   hide: false,
      //   sortable: true,
      //   filter: false
      // },
      {
        headerName: "Total Cost",
        field: "totalCost",
        hide: false,
        sortable: true,
        filter: false
      }
      // {
      //   headerName: "Estimated Delivery",
      //   field: "esitmatedDelivery",
      //   hide: false,
      //   sortable: true,
      //   filter: false
      // },
      // {
      //   headerName: "Match Score",
      //   field: "matchScore",
      //   hide: false,
      //   sortable: false,
      //   filter: false
      // }
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
  rowData = [];
  pricingProfile: PricingProfile;
  customer: CustomerData;
  postProcesses;
  part: Part;
  rfq: RfqData;
  partId: any;
  profileId: any;

  priceProfileDetail = {
    processProfileName: "Fortus 400 - ABS M 30 - Detailed",
    pricingParameterSetNickname: "Standard 3 cm Test",
    conditions: [
      "Part Volumn > 3 cubic centimeter (cu cm)",
      "Part Quantity> 25 count"
    ],
    items: [
      {
        invoiceItem: "Part Cost",
        lineItem: "Setup Cost",
        value: "$ 3",
        per: "1",
        partValue: "Setup",
        measurementUnit: "cubic centimeters(cc)",
        subOrderValue: "130 cc",
        subTotal: 400
      },
      {
        invoiceItem: "Part Cost",
        lineItem: "Setup Cost",
        value: "$ 3",
        per: "1",
        partValue: "Setup",
        measurementUnit: "cubic centimeters(cc)",
        subOrderValue: "130 cc",
        subTotal: 400
      },
      {
        invoiceItem: "Part Cost",
        lineItem: "Setup Cost",
        value: "$ 3",
        per: "1",
        partValue: "Setup",
        measurementUnit: "cubic centimeters(cc)",
        subOrderValue: "130 cc",
        subTotal: 400
      }
    ]
  };

  constructor(
    private pricingService: RfqPricingService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private metadataService: MetadataService
  ) {
    this.route.params.subscribe(params => {
      this.partId = params.partId;
      this.profileId = params.profileId;

      this.spinner.show();
      this.pricingService.getPartDetail(this.partId).subscribe(part => {
        this.part = part;
        combineLatest(
          this.pricingService.getPricingProfileDetail(
            this.profileId,
            this.partId,
            this.part.rfqMedia.media.customerId
          ),
          this.userService.getCustomer(this.part.rfqMedia.media.customerId),
          this.pricingService.getRfqDetail(this.part.rfqMedia.projectRfqId),
          this.metadataService.getMetaData("post_process_action")
        ).subscribe(([pricingProfile, customer, rfq, postProcesses]) => {
          this.spinner.hide();
          this.pricingProfile = pricingProfile;
          this.customer = customer;
          this.rfq = rfq;
          this.postProcesses = postProcesses;
          this.updateData();
        });
      });
    });
  }

  ngOnInit() {}

  onGridReady(id, ev) {
    this.gridOptions[id].api = ev.api;
    this.gridOptions[id].api.sizeColumnsToFit();
  }

  backButton() {
    this.router.navigateByUrl(
      this.router.url.substr(0, this.router.url.indexOf("/pricing-profile"))
    );
  }

  updateData() {
    console.log(this.part, this.pricingProfile, this.customer, this.rfq);
    this.rowData = [
      [
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
          price: this.part.shippingCost ? `$ ${this.part.shippingCost}` : ""
        }
      ],
      [
        {
          vendorName:
            this.pricingProfile.pricingProfileDetailedView.vendorProfile &&
            this.pricingProfile.pricingProfileDetailedView.vendorProfile.name,
          pricingProfile: this.pricingProfile.pricingProfileDetailedView.name,
          material: this.pricingProfile.pricingProfileDetailedView.processProfile.processMachineServingMaterialList
            .map(item => item.machineServingMaterial.material.name)
            .join(", "),
          equipment: this.pricingProfile.pricingProfileDetailedView.processProfile.processMachineServingMaterialList
            .map(
              item => item.machineServingMaterial.vendorMachinery.equipment.name
            )
            .join(", "),
          processProfile: this.pricingProfile.pricingProfileDetailedView
            .processProfile.name,
          // postProcess: "Electropolishing",
          // machinesMatched: 2,
          totalCost: `$ ${this.pricingProfile.partCostInvoiceItemSummary
            .extendedCost +
            this.pricingProfile.toolCostInvoiceItemSummary.extendedCost}`
          // esitmatedDelivery: "10/12/2019",
          // matchScore: 4.9
        }
      ]
    ];
  }
  getPostProcess(id) {
    const found =
      this.part.postProcessTypeIds &&
      this.postProcesses.find(
        postProcess => postProcess.id == this.part.postProcessTypeIds[id]
      );
    return found && found.name;
  }
}
