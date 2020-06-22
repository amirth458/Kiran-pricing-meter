import { FileViewRendererComponent } from './../../../../../common/file-view-renderer/file-view-renderer.component';
import { EventEmitter } from '@angular/core';
import { Component, OnInit, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-past-order-details',
  templateUrl: './past-order-details.component.html',
  styleUrls: ['./past-order-details.component.css']
})
export class PastOrderDetailsComponent implements OnInit {
  @Output() close: EventEmitter<any> = new EventEmitter();

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  rowData = [
    [
      {
        id: 1,
        customerOrder: 234,
        subOrder: '234.1',
        fileName: 'Roter_No_Logo.stl',
        priceAccepted: '$ 334',
        customer: 'CompCo',
        quantity: '30',
        material: 'ABS M30',
        process: '3D Printing',
        postProcess: 'Sanding',
        previouslyOrdered: 'Yes',
        firstShipment: 'Yes',
        deliveryDate: '09/12/2019'
      }
    ],
    [
      {
        vendorName: 'VensCo',
        processProfileNo: '6578',
        processProfile: '$ 544',
        postProcessProfile1No: 743,
        postProcessPrice1: 45,
        postProcessProfile2No: 645,
        postProcessPrice2: 0,
        shippingEstimate: 18.0,
        totalCost: '$ 589.99',
        esitmatedProductionDate: 5,
        supplierScore: 4.8
      }
    ]
  ];

  columnDefs = [
    [
      {
        headerName: 'Customer Order',
        field: 'customerOrder',
        tooltipField: 'customerOrder',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Sub-Order',
        field: 'subOrder',
        tooltipField: 'subOrder',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'File Name',
        field: 'fileName',
        tooltipField: 'fileName',
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer: 'fileViewRenderer'
      },
      {
        headerName: 'Price Accepted',
        field: 'priceAccepted',
        tooltipField: 'priceAccepted',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Customer',
        field: 'customer',
        tooltipField: 'customer',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        tooltipField: 'quantity',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Material',
        field: 'material',
        tooltipField: 'material',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Process',
        field: 'process',
        tooltipField: 'process',
        hide: false,
        sortable: true,
        filter: false
      },
      // {
      //   headerName: 'Post-Process',
      //   field: 'postProcess',
      //   tooltipField: 'postProcess',
      //   hide: false,
      //   sortable: true,
      //   filter: false
      // },
      {
        headerName: 'Previously Ordered',
        field: 'previouslyOrdered',
        tooltipField: 'previouslyOrdered',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'First Shipment',
        field: 'firstShipment',
        tooltipField: 'firstShipment',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Delivery Date',
        field: 'deliveryDate',
        tooltipField: 'deliveryDate',
        hide: false,
        sortable: true,
        filter: false
      }
    ],
    [
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        tooltipField: 'vendorName',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Process Profile No',
        field: 'processProfileNo',
        tooltipField: 'processProfileNo',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Process Profile',
        field: 'processProfile',
        tooltipField: 'processProfile',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Post-Process Profile 1 No',
        field: 'postProcessProfile1No',
        tooltipField: 'postProcessProfile1No',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Post-Process Price 1',
        field: 'postProcessPrice1',
        tooltipField: 'postProcessPrice1',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Post-Process Profile 2 No',
        field: 'postProcessProfile2No',
        tooltipField: 'postProcessProfile2No',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Post-Process Price 2',
        field: 'postProcessPrice2',
        tooltipField: 'postProcessPrice2',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Shipping Estimate',
        field: 'shippingEstimate',
        tooltipField: 'shippingEstimate',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Total Cost',
        field: 'totalCost',
        tooltipField: 'totalCost',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Estimated Production Date',
        field: 'estimatedProductionDate',
        tooltipField: 'estimatedProductionDate',
        hide: false,
        sortable: false,
        filter: false
      },
      {
        headerName: 'Supplier Sccore',
        field: 'supplierScore',
        tooltipField: 'supplierScore',
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
      columnDefs: this.columnDefs[1],
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    }
  ];

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
