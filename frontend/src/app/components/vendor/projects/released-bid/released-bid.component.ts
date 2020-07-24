import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';

import { ColDef, GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { combineLatest } from 'rxjs';

import { BidPart, Part } from '../../../../model/part.model';
import { BiddingService } from '../../../../service/bidding.service';
import { DefaultEmails } from '../../../../../assets/constants';
import { MinimumProposalInfo, VendorConfirmationResponse } from '../../../../model/bidding.order';
import { ProposalService } from '../../../../service/proposal.service';
import { TemplateRendererComponent } from '../../../../common/template-renderer/template-renderer.component';
import { Util } from '../../../../util/Util';

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

  partInfo: BidPart[];
  @Input()
  set bidParts(value: BidPart[]) {
    this.partInfo = value;
    if (value) {
      this.getAdminProposal(value.map(p => p.partId));
    }
  }
  get bidParts(): BidPart[] {
    return this.partInfo;
  }

  columnDefs: ColDef[] = [];
  gridOptions: GridOptions;
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  rowData: VendorConfirmationResponse[];
  proposalInfo: any;
  adminProposalInfo: Part[];

  from = '';
  to = '';
  cc = [];
  bcc = [];

  constructor(
    public biddingService: BiddingService,
    public spinner: NgxSpinnerService,
    public modalService: NgbModal,
    public router: Router,
    public currencyPipe: CurrencyPipe,
    public datePipe: DatePipe,
    public proposalService: ProposalService
  ) {
    this.proposalInfo = {};
  }

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
        tooltipField: 'totalProposalAmount',
        valueFormatter: dt => {
          return this.currencyPipe.transform(dt.value || '', 'USD', 'symbol', '0.0-3');
        }
      },
      {
        headerName: 'Proposal Delivery Date',
        field: 'proposalDeliveryDates',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'proposalDeliveryDates',
        valueFormatter: dt => {
          const arr = (dt.value || []).map(value => {
            return this.datePipe.transform(value || '', Util.dateFormat);
          });
          return arr.join(', ');
        }
      },
      {
        headerName: 'Proposal Expiry Date',
        field: 'proposalExpiryDates',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'proposalExpiryDates',
        valueFormatter: dt => {
          const arr = (dt.value || []).map(value => {
            return this.datePipe.transform(value || '', Util.dateFormat);
          });
          return arr.join(', ');
        }
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
      if (this.rowData.length > 0) {
        this.fetchProposalInfo(this.rowData.map(item => item.vendorId));
      }
      this.spinner.hide('releaseLoadingPanel');
    });
  }

  getAdminProposal(ids: Array<number>) {
    this.proposalService.getProposalPartByParentPartIds(ids).subscribe(v => {
      this.adminProposalInfo = v || [];
    });
  }

  fetchProposalInfo(vendorIds: Array<number>) {
    const arr = [];
    vendorIds.map(vendorId => {
      arr.push(this.biddingService.getDetailedPartInfo(this.bidProjectId, vendorId));
    });
    this.spinner.show('releaseLoadingPanel');
    combineLatest(arr).subscribe(v => {
      this.spinner.hide('releaseLoadingPanel');
      const bidParts = (v || []).reduce((acc, value) => {
        acc = acc.concat(value || []);
        return acc;
      }, []);
      (bidParts || []).map((part: BidPart) => {
        if (part.partQuoteCustomerView) {
          const quote = part.partQuoteCustomerView;
          console.log(quote);
          if (this.proposalInfo[quote.vendorId]) {
            this.proposalInfo[quote.vendorId].proposalPartIds.push(quote.proposalPartId);
          } else {
            this.proposalInfo[quote.vendorId] = {
              vendorId: quote.vendorId,
              offerId: this.bidProjectId,
              proposalPartIds: [quote.proposalPartId]
            } as MinimumProposalInfo;
          }
        }
      });
    });
  }

  viewVendorOffer($event: any, vendorId: number) {
    this.router.navigateByUrl(`${this.router.url}/vendor-proposal/${vendorId}`);
  }

  viewAdminProposal() {
    const ids = (this.adminProposalInfo || []).map(p => p.parentPartId);
    this.router.navigateByUrl(`${this.router.url}/admin-proposal/${ids.join(',')}`);
  }

  sendMail(row: any = null) {
    this.from = DefaultEmails.from;
    this.to = DefaultEmails.to;
    this.cc = [];
    this.bcc = row && row.vendorEmail ? [row.vendorEmail] : null;
    if (!this.bcc) {
      this.bcc = this.gridOptions.api.getSelectedRows().map(dataRow => dataRow.vendorEmail);
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
