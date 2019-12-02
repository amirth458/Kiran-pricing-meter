import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { GridOptions } from "ag-grid-community";

@Component({
  selector: "app-recommended-pricing",
  templateUrl: "./recommended-pricing.component.html",
  styleUrls: ["./recommended-pricing.component.css"]
})
export class RecommendedPricingComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();

  rowData = [
    [
      {
        vendorName: "PrintCo",
        pricingProfile: "Standard",
        processProfile: "Fortus 450 ABS M30 30 Micron",
        postProcess1: "Sanding",
        postProcess2: "",
        postProcess3: "",
        machinesMatched: 2,
        totalCost: "$ 1456",
        estimatedDelivery: "10/12/2019",
        matchScore: 4.9
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
        machinesMatched: 2,
        totalCost: "$ 1560",
        estimatedDelivery: "10/12/2019",
        matchScore: 4.9
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
        machinesMatched: 2,
        totalCost: "$ 1500",
        estimatedDelivery: "10/12/2019",
        matchScore: 4.9
      }
    ]
  ];

  columnDefs = [
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
  ];


  gridOptions: GridOptions = {
    columnDefs: this.columnDefs,
    enableColResize: true,
    rowHeight: 35,
    headerHeight: 35
  };

  constructor() {}

  ngOnInit() {}

  onGridReady(ev) {
    ev.api.sizeColumnsToFit();
  }

  onApply(idx) {
    this.close.emit(this.rowData[idx]);
  }
  onClose() {
    this.close.emit();
  }
}
