import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/service/orders.service';
import { MetadataConfig } from 'src/app/model/metadata.model';
import { MetadataService } from 'src/app/service/metadata.service';
import { combineLatest } from 'rxjs';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  measurementUnits: any;
  postProcessAction: any;

  gridOptions: GridOptions;
  columnDefs = [
    [
      {
        headerName: 'No',
        field: 'id',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Process Profile Name',
        field: 'processProfileName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Released Priority',
        field: 'releasedPriority',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: '',
        hide: false,
        sortable: true,
        filter: false
      }
    ],
    [
      {
        headerName: 'No',
        field: 'id',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Process Profile Name',
        field: 'processProfileName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: '',
        hide: false,
        sortable: true,
        filter: false
      }
    ],
    [
      {
        headerName: 'No',
        field: 'id',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Process Profile Name',
        field: 'processProfileName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Meeting Time',
        field: 'meetingTime',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Status',
        field: 'status',
        hide: false,
        sortable: true,
        filter: false
      }
    ]
  ];
  frameworkComponents = {};

  matchingSuppliersProfile = [];
  removedMatchingSuppliersProfile = [];
  suppliersProfile = [];
  rowData = [];
  order: any;

  constructor(public orderService: OrdersService, public metadataService: MetadataService) {}

  ngOnInit() {
    combineLatest(
      this.orderService.getAllMeasurementUnitType(),
      this.metadataService.getAdminMetaData(MetadataConfig.POST_PROCESS_ACTION)
    ).subscribe(([measurementUnits, postProcessAction]) => {
      this.measurementUnits = measurementUnits;
      this.postProcessAction = postProcessAction;
    });

    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[0],
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 50,
      headerHeight: 35,
      rowSelection: 'multiple'
    };
  }

  onGridReady(ev) {
    this.gridOptions.api = ev.api;
  }
}
