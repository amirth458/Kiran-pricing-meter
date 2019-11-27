import { RfqPricingService } from './../../../../../service/rfq-pricing.service';
import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { GridOptions, GridApi } from "ag-grid-community";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-recent-auto-prices',
  templateUrl: './recent-auto-prices.component.html',
  styleUrls: ['./recent-auto-prices.component.css']
})
export class RecentAutoPricesComponent implements OnInit {
  columnDefs = [
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
      cellClass: 'text-center'
    },
    {
      headerName: "Part",
      field: "part",
      hide: false,
      sortable: true,
      filter: false,
      cellClass: 'text-center'
    },
    {
      headerName: "File Name",
      field: "filename",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Quantity",
      field: "quantity",
      hide: false,
      sortable: true,
      filter: false,
      cellClass: 'text-center'
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
      cellClass: 'text-center'
    },
    {
      headerName: "Post-Process",
      field: "postProcess",
      hide: false,
      sortable: true,
      filter: true,
      cellClass: 'text-center'
    },
    {
      headerName: "Price",
      field: "price",
      hide: false,
      sortable: true,
      cellClass: 'text-center'
    }
  ];
  gridOptions: GridOptions;
  gridApi: GridApi;
  rowData = [];
  pageSize = 10;
  navigation;

  constructor(
    private spinner: NgxSpinnerService,
    private pricingService: RfqPricingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.gridOptions = {
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        // this.onRowClick(event);
        this.router.navigateByUrl(this.router.url + "/" + event.data.id);
      },
    };
    this.getRows();
  }

  async getRows(q = null) {
    this.spinner.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const res = await this.pricingService
          .getRecentAutoPrices({ page, size: 1000, sort: "id,ASC", q })
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
      this.rowData = rows;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }
  onGridReady(ev) {
    this.gridOptions = ev;
    this.gridOptions.api.sizeColumnsToFit();
  }

  onPageSizeChange(ev) {
    this.pageSize = ev.target.value;
    this.gridOptions.api.paginationSetPageSize(this.pageSize);
  }
}
