import { DropdownHeaderRendererComponent } from './../../../../../common/dropdown-header-renderer/dropdown-header-renderer.component';
import { ConsultantService } from "./../../../../../service/consultant.service";
import { Component, OnInit } from "@angular/core";
import { GridOptions, GridApi } from "ag-grid-community";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-referral",
  templateUrl: "./referral.component.html",
  styleUrls: ["./referral.component.css"]
})
export class ReferralComponent implements OnInit {
  columnDefs = [
    {
      headerName: "First",
      field: "accountId",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Last",
      field: "accountId",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Company",
      field: "accountId",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Phone",
      field: "accountId",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Email",
      field: "accountId",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Questions",
      field: "accountId",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Request Time",
      field: "accountId",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Timer",
      field: "accountId",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Status",
      field: "accountId",
      hide: false,
      sortable: true,
      filter: true,
      headerRenderer: 'dropdownHeaderRenderer'
    }
  ];
  gridOptions: GridOptions;
  gridApi: GridApi;
  rowData = [];
  pageSize = 10;
  navigation;
  frameworkComponents = {
    dropdownHeaderRenderer: DropdownHeaderRendererComponent
  };

  constructor(
    private spinner: NgxSpinnerService,
    private consultantService: ConsultantService
  ) {}

  ngOnInit() {
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        // this.onRowClick(event);
      }
    };
  }

  async getVendorShippings() {
    this.spinner.show();
    let page = 0;
    const rows = [];
    try {
      // while (true) {
      //   const res = await this.consultantService.getReferrals(
      //     this.userService.getVendorInfo().id,
      //     { page, size: 1000, sort: 'id,ASC', q: '' }
      //   ).toPromise();
      //   rows.push(...res.content);
      //   if (!res.content) { break; }
      //   if (res.content.length === 0 || res.content.length < 1000) {
      //     break;
      //   }
      //   page++;
      // }
      // this.rowData = rows;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }
  onGridReady(ev) {
    this.gridOptions = ev;
  }
}
