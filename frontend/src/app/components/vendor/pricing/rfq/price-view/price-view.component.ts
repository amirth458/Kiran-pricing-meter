import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { FileViewRendererComponent } from "../../../../../common/file-view-renderer/file-view-renderer.component";
import { Component, OnInit, Input } from "@angular/core";
import { GridOptions } from "ag-grid-community";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-price-view",
  templateUrl: "./price-view.component.html",
  styleUrls: ["./price-view.component.css"]
})
export class PriceViewComponent implements OnInit {

  @Input() type: string;
  @Input() pricingData: any;

  stage = 'unset';

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };
  columnDefs = [];
  gridOptions: GridOptions;
  rowData = [
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
  ];

  pricingForm: FormGroup = this.fb.group({
    toolingUnitCount: [1],
    toolingUnitPrice: [0],
    toolingExtended: [0],
    partsUnitCount: [30],
    partsUnitPrice: [50],
    partsExtended: [1500],
  });

  pricingDetail = {
    toolingUnitCount: 1,
    toolingUnitPrice: 0,
    toolingExtended: 0,
    partsUnitCount: 30,
    partsUnitPrice: 50,
    partsExtended: 1500,
  }

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.columnDefs = [
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
    ];

    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    };
  }

  onGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  changeStage(newStage) {
    this.stage = newStage;
  }

  openModal(content, css) {
    this.modalService.open(content, { centered: true, windowClass: `${css}-modal` });
  }

  onSave() {
    this.modalService.dismissAll();
    this.stage = 'set';
    this.pricingDetail = {...this.pricingForm.value};
  }

  onRecommendModalClose(ev) {
    if (ev) {
      console.log(ev);
    }
    this.modalService.dismissAll();
  }
}
