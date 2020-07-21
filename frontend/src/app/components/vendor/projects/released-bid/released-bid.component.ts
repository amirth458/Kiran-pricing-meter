import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { ColDef, GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { BiddingService } from '../../../../service/bidding.service';
import { DefaultEmails } from '../../../../../assets/constants';
import { VendorConfirmationResponse } from '../../../../model/bidding.order';
import { TemplateRendererComponent } from '../../../../common/template-renderer/template-renderer.component';

@Component({
  selector: 'app-released-bid',
  templateUrl: './released-bid.component.html',
  styleUrls: ['./released-bid.component.css']
})
export class ReleasedBidComponent implements OnInit {
  @ViewChild('sendMailModal') sendMailModal: TemplateRef<any>;
  @ViewChild('additionalColDefRef') additionalColDefRef: TemplateRef<any>;

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
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  rowData: VendorConfirmationResponse[];

  from = '';
  to = '';
  cc = [];
  bcc = [];

  constructor(
    public biddingService: BiddingService,
    public spinner: NgxSpinnerService,
    public modalService: NgbModal
  ) {}

  ngOnInit() {
    this.initGrid();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      rowSelection: 'multiple',
      rowMultiSelectWithClick: true
    };
  }

  initGrid() {
    this.columnDefs = [
      {
        headerName: 'No',
        valueGetter: 'node.rowIndex + 1',
        width: 80,
        hide: false,
        sortable: false,
        filter: false,
        checkboxSelection: true
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
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.additionalColDefRef
        }
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

  sendMail(row: any = null) {
    this.from = DefaultEmails.from;
    this.to = DefaultEmails.to;
    this.cc = [];
    this.bcc = row && row.VendorEmail ? [row.VendorEmail] : null;
    if (!this.bcc) {
      this.bcc = this.gridOptions.api.getSelectedRows().map(dataRow => dataRow.VendorEmail);
    }
    if (this.bcc && this.bcc.length > 0) {
      this.modalService.open(this.sendMailModal, {
        centered: true,
        size: 'lg'
      });
    }
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }
}
