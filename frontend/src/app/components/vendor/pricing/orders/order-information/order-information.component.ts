import { FileViewRendererComponent } from './../../../../../common/file-view-renderer/file-view-renderer.component';
import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-order-information',
  templateUrl: './order-information.component.html',
  styleUrls: ['./order-information.component.css']
})
export class OrderInformationComponent implements OnInit {

  stage = 'unset';

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };
  columnDefs = [];
  gridOptions: GridOptions;
  rowData = [
    {
      id: 1,
      customerOrder: "234",
      subOrder: '234.1',
      fileName: 'Rotor_No_ Logo.stl',
      priceAccepted: '$ 334',
      customer: 'CompCo',
      quantity: 30,
      material: 'ABS M30',
      process: '3D Printing',
      postProcess: 'Sanding',
      previouslyOrdered: 'Yes',
      firstShipment: 'Yes',
      deliveryDate: '09/12/2019'
    }
  ];

  pricingDetail = {
    toolingUnitCount: 1,
    toolingUnitPrice: 0,
    toolingExtended: 0,
    partsUnitCount: 30,
    partsUnitPrice: 50,
    partsExtended: 1500,
  }

  constructor(
  ) {}

  ngOnInit() {
    this.columnDefs = [
      {
        headerName: "Customer Order",
        field: "customerOrder",
        hide: false,
        sortable: true,
        filter: false,
      },
      {
        headerName: "Sub-Order",
        field: "subOrder",
        hide: false,
        sortable: true,
        filter: false,
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
        filter: false,
      },
      {
        headerName: "Customer",
        field: "customer",
        hide: false,
        sortable: true,
        filter: false,
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
      },
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
}
