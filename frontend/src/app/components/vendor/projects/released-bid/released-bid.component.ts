import { Component, Input, OnInit } from '@angular/core';

import { ColDef, GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';

import { BiddingService } from '../../../../service/bidding.service';
import { VendorConfirmationResponse } from '../../../../model/bidding.order';

@Component({
  selector: 'app-released-bid',
  templateUrl: './released-bid.component.html',
  styleUrls: ['./released-bid.component.css']
})
export class ReleasedBidComponent implements OnInit {
  bidProjectId: number;
  @Input()
  set value(value: number) {
    this.bidProjectId = value;
    this.getReleasedPmProjectBids();
  }
  get value(): number {
    return this.bidProjectId;
  }

  columnDefs: ColDef[] = [];
  gridOptions: GridOptions;
  rowData: VendorConfirmationResponse[];

  constructor(public biddingService: BiddingService, public spinner: NgxSpinnerService) {}

  ngOnInit() {
    this.initGrid();
    this.gridOptions = {
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    };
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: 'No',
        field: 'id',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'id'
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'vendorName'
      },
      {
        headerName: 'Quantity of Process profiles',
        field: 'numberOfProcessProfile',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'numberOfProcessProfile'
      },
      {
        headerName: 'Total Proposed Amount',
        field: 'totalProposalAmount',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'totalProposalAmount'
      },
      {
        headerName: 'Proposal Delivery Date',
        field: 'proposalDeliveryDate',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'proposalDeliveryDate'
      },
      {
        headerName: 'Proposal Expiry Date',
        field: 'proposalExpiryDate',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'proposalExpiryDate'
      },
      {
        headerName: 'Status',
        field: 'bidPmProjectProcessStatus',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'bidPmProjectProcessStatus'
      },
      {
        headerName: 'Communication with Vendor',
        field: 'vendorId',
        hide: false,
        sortable: true,
        filter: false
      }
    ];
  }

  getReleasedPmProjectBids() {
    this.spinner.show('releaseLoadingPanel');
    this.biddingService.getReleasedPmProjectBids(this.bidProjectId).subscribe(v => {
      this.rowData = v || [];
      this.spinner.hide('releaseLoadingPanel');
    });
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }
}
