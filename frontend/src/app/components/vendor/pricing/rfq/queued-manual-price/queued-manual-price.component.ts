import { Router } from '@angular/router';
import { RfqPricingService } from "./../../../../../service/rfq-pricing.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { GridOptions } from "ag-grid-community";
import { BehaviorSubject } from "rxjs";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { FileViewRendererComponent } from './../../../../../common/file-view-renderer/file-view-renderer.component';

@Component({
  selector: "app-queued-manual-price",
  templateUrl: "./queued-manual-price.component.html",
  styleUrls: ["./queued-manual-price.component.css"]
})
export class QueuedManualPriceComponent implements OnInit {
  tabs = [
    {
      id: 0,
      title: "Queued for Manual Pricing"
    },
    {
      id: 1,
      title: "Manually Priced"
    }
  ];
  selectedTabId$: BehaviorSubject<number> = new BehaviorSubject(0);
  selectedTabId: number;

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  columnDefs = [[],[]];
  gridOptions: GridOptions;
  rowData = [[], []];
  pageSize = 10;
  navigation;

  constructor(
    private spinner: NgxSpinnerService,
    private pricingService: RfqPricingService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.columnDefs = [
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
          cellRenderer: "fileViewRenderer",
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
          headerName: "Wait",
          field: "wait",
          hide: false,
          sortable: true,
          cellClass: "text-center"
        }
      ],
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
          cellRenderer: "fileViewRenderer",
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
          headerName: "NDA",
          field: "nda",
          hide: false,
          sortable: true,
          filter: false,
          cellClass: "text-center"
        },
        {
          headerName: "Manual Price",
          field: "manualPrice",
          hide: false,
          sortable: true,
          cellClass: "text-center"
        }
      ]
    ];
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[0],
      pagination: true,
      paginationPageSize: this.pageSize,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        // this.onRowClick(event);
        const type = this.selectedTabId === 0 ? 'queued' : 'priced';
        this.router.navigateByUrl(this.router.url + '/'+ type +'/' + event.data.id);
      }
    };
    this.selectedTabId$.subscribe(value => {
      this.selectedTabId = value;
      if (this.gridOptions.api) {
        this.gridOptions.api.setColumnDefs(this.columnDefs[value]);
        this.gridOptions.api.setRowData(this.rowData[value]);
        this.gridOptions.api.sizeColumnsToFit();
      }
    });
    this.getQueuedManualPricing();
    this.getManuallyPriced();
  }

  onGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  async getQueuedManualPricing(q = null) {
    this.spinner.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const res = await this.pricingService
          .getQueuedManualPricing({ page, size: 1000, sort: "id,ASC", q })
          .toPromise();

        if (!res.content) {
          break;
        }
        rows.push(...res.content);
        if (res.content.length === 0 || res.content.length < 1000) {
          break;
        }
        page++;
      }
      this.rowData[0] = rows;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  async getManuallyPriced(q = null) {
    this.spinner.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const res = await this.pricingService
          .getManuallyPriced({ page, size: 1000, sort: "id,ASC", q })
          .toPromise();

        if (!res.content) {
          break;
        }
        rows.push(...res.content);
        if (res.content.length === 0 || res.content.length < 1000) {
          break;
        }
        page++;
      }
      this.rowData[1] = rows;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  onPageSizeChange(ev) {
    this.pageSize = ev.target.value;
    this.gridOptions.api.paginationSetPageSize(this.pageSize);
  }

  onFileClicked(event, row, content) {
    event.stopPropagation();
    console.log(row);
    this.modalService.open(content, { centered: true, windowClass: 'file-viewer-modal' });
  }
}
