import { RfqPricingService } from "./../../../../../service/rfq-pricing.service";
import { TemplateRendererComponent } from "./../../../../../common/template-renderer/template-renderer.component";
import { NgxSpinnerService } from "ngx-spinner";
import { Router, ActivatedRoute } from "@angular/router";
import {
  Component,
  OnInit,
  ViewChild,
  TemplateRef,
  Input
} from "@angular/core";
import { GridOptions } from "ag-grid-community";
import { Part } from "src/app/model/part.model";

@Component({
  selector: "app-pricing-profile",
  templateUrl: "./pricing-profile.component.html",
  styleUrls: ["./pricing-profile.component.css"]
})
export class PricingProfileComponent implements OnInit {
  @Input() part: Part;
  @ViewChild("dateCell") dateCell: TemplateRef<any>;
  type = ["search", "filter"];

  searchColumns = [
    {
      name: "Vendor Name",
      field: "vendorName",
      tooltipField: "vendorName",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    },
    {
      name: "Pricing Profile",
      field: "pricingProfile",
      tooltipField: "pricingProfile",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    },
    {
      name: "Material",
      field: "material",
      tooltipField: "material",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    },
    {
      name: "Equipment",
      field: "equipment",
      tooltipField: "equipment",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    },
    {
      name: "Process Profile",
      field: "processProfile",
      tooltipField: "processProfile",
      checked: false,
      query: {
        type: "",
        filter: ""
      }
    }
    // {
    //   name: "Post-Process",
    //   field: "postProcess",
    //   tooltipField: "postProcess",
    //   checked: false,
    //   query: {
    //     type: "",
    //     filter: ""
    //   }
    // },
    // {
    //   name: "Machines Matched",
    //   field: "machinesMatched",
    //   tooltipField: "machinesMatched",
    //   checked: false,
    //   query: {
    //     type: "",
    //     filter: ""
    //   }
    // },
    // {
    //   name: "Total Cost",
    //   field: "totalCost",
    //   tooltipField: "totalCost",
    //   checked: false,
    //   query: {
    //     type: "",
    //     filter: ""
    //   }
    // },
    // {
    //   name: "Estimated Delivery",
    //   field: "estimatedDelivery",
    //   tooltipField: "estimatedDelivery",
    //   checked: false,
    //   query: {
    //     type: "",
    //     filter: ""
    //   }
    // },
    // {
    //   name: "Match Score",
    //   field: "matchScore",
    //   tooltipField: "matchScore",
    //   checked: false,
    //   query: {
    //     type: "",
    //     filter: ""
    //   }
    // }
  ];

  filterColumns = [
    {
      name: "Vendor Name",
      field: "vendorName",
      tooltipField: "vendorName",
      checked: true
    },
    {
      name: "Pricing Profile",
      field: "pricingProfile",
      tooltipField: "pricingProfile",
      checked: true
    },
    {
      name: "Material",
      field: "material",
      tooltipField: "material",
      checked: true
    },
    {
      name: "Equipment",
      field: "equipment",
      tooltipField: "equipment",
      checked: true
    },
    {
      name: "Process Profile",
      field: "processProfile",
      tooltipField: "processProfile",
      checked: true
    }
    // {
    //   name: "Post-Process",
    //   field: "postProcess",
    //   tooltipField: "postProcess",
    //   checked: true
    // },
    // {
    //   name: "Machines Matched",
    //   field: "machinesMatched",
    //   tooltipField: "machinesMatched",
    //   checked: true
    // },
    // {
    //   name: "Total Cost",
    //   field: "totalCost",
    //   tooltipField: "totalCost",
    //   checked: true
    // },
    // {
    //   name: "Estimated Delivery",
    //   field: "estimatedDelivery",
    //   tooltipField: "estimatedDelivery",
    //   checked: true
    // },
    // {
    //   name: "Match Score",
    //   field: "matchScore",
    //   tooltipField: "matchScore",
    //   checked: true
    // }
  ];

  columnDefs: Array<any> = [];
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  gridOptions: GridOptions;
  rowData;
  pageSize = 10;
  navigation;
  pricingSettings;

  constructor(
    public router: Router,
    public spinner: NgxSpinnerService,
    private pricingService: RfqPricingService
  ) {
    this.navigation = this.router.getCurrentNavigation();
  }

  ngOnInit() {
    this.initColumns();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        // this.onRowClick(event);
        //console.log('row click', event.data.id);
        this.router.navigateByUrl(
          this.router.url + "/pricing-profile/" + event.data.id
        );
      }
    };
    this.getPricingProfiles();
  }

  initColumns() {
    this.columnDefs = [
      {
        headerName: "Vendor Name",
        field: "vendorName",
        tooltipField: "vendorName",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Pricing Profile",
        field: "pricingProfile",
        tooltipField: "pricingProfile",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Material",
        field: "material",
        tooltipField: "material",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Equipment",
        field: "equipment",
        tooltipField: "equipment",
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: "Process Profile",
        field: "processProfile",
        tooltipField: "processProfile",
        hide: false,
        sortable: true,
        filter: false
      }
      // {
      //   headerName: "Post-Process",
      //   field: "postProcess",
      //   tooltipField: "postProcess",
      //   hide: false,
      //   sortable: true,
      //   filter: false
      // },
      // {
      //   headerName: "Machines Matched",
      //   field: "machinesMatched",
      //   tooltipField: "machinesMatched",
      //   hide: false,
      //   sortable: true,
      //   filter: false
      // },
      // {
      //   headerName: "Total Cost",
      //   field: "totalCost",
      //   tooltipField: "totalCost",
      //   hide: false,
      //   sortable: true,
      //   filter: false
      // },
      // {
      //   headerName: "Estimated Delivery",
      //   field: "esitmatedDelivery",
      //   tooltipField: "esitmatedDelivery",
      //   hide: false,
      //   sortable: true,
      //   filter: false
      // },
      // {
      //   headerName: "Match Score",
      //   field: "matchScore",
      //   tooltipField: "matchScore",
      //   hide: false,
      //   sortable: false,
      //   filter: false
      // }
    ];
  }

  async getPricingProfiles(q = null) {
    this.spinner.show();
    const res = await this.pricingService
      .getPricingProfiles(this.part.id)
      .toPromise();

    this.rowData = res.map(item => ({
      id: item.id,
      vendorName: item.vendorProfile.name,
      pricingProfile: item.name,
      material: item.processProfile.processMachineServingMaterialList
        .map(item => item.machineServingMaterial.material.name)
        .join(", "),
      equipment: item.processProfile.processMachineServingMaterialList
        .map(item => item.machineServingMaterial.vendorMachinery.equipment.name)
        .join(", "),
      processProfile: item.processProfile.name
      // postProcess: "Electropolishing",
      // machinesMatched: 2,
      // totalCost: 1238,
      // esitmatedDelivery: "10/12/2019",
      // matchScore: 4.9
    }));

    this.pricingSettings = await this.pricingService
      .getPricingSettings()
      .toPromise();

    this.spinner.hide();
  }

  configureColumnDefs() {
    this.filterColumns.map(column => {
      this.columnDefs.map(col => {
        if (col.headerName === column.name) {
          col.hide = !column.checked;
        }
      });
    });
  }

  filterColumnsChange(event) {
    this.configureColumnDefs();
    this.gridOptions.api.setColumnDefs([]);
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.gridOptions.api.sizeColumnsToFit();
  }

  searchColumnsChange(columns) {
    columns.map(column => {
      const columnInstance = this.gridOptions.api.getFilterInstance(
        column.field
      );
      if (columnInstance) {
        if (column.checked) {
          columnInstance.setModel(column.query);
        } else {
          columnInstance.setModel({ type: "", filter: "" });
        }
      }
      this.gridOptions.api.onFilterChanged();
    });
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }
}
