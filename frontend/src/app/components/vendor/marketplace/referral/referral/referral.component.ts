import { StatusDropdownFilterComponent } from './../../../../../common/status-dropdown-filter/status-dropdown-filter.component';
import { Router } from "@angular/router";
import { DropdownHeaderRendererComponent } from "./../../../../../common/dropdown-header-renderer/dropdown-header-renderer.component";
import { ConsultantService } from "./../../../../../service/consultant.service";
import { Component, OnInit } from "@angular/core";
import { GridOptions, GridApi } from "ag-grid-community";
import { NgxSpinnerService } from "ngx-spinner";
declare var require: any;
const dayjs = require("dayjs");

@Component({
  selector: "app-referral",
  templateUrl: "./referral.component.html",
  styleUrls: ["./referral.component.css"]
})
export class ReferralComponent implements OnInit {
  columnDefs = [
    {
      headerName: "First Name",
      field: "firstName",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Last Name",
      field: "lastName",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Company",
      field: "company",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Phone",
      field: "phone",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Email",
      field: "email",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Questions",
      field: "questions",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Material/Equipment Name",
      field: "featureName",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Request Time",
      field: "requestTime",
      hide: false,
      sortable: true,
      filter: false
    },
    {
      headerName: "Timer",
      field: "timer",
      hide: false,
      sortable: true,
      filter: true
    },
    {
      headerName: "Status",
      field: "status",
      hide: false,
      sortable: true,
      filter: "statusFilter",
    }
  ];
  gridOptions: GridOptions;
  gridApi: GridApi;
  rowData = [];
  pageSize = 10;
  navigation;
  frameworkComponents = {
    statusFilter: StatusDropdownFilterComponent
  };

  constructor(
    private spinner: NgxSpinnerService,
    private consultantService: ConsultantService,
    private router: Router
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
        this.router.navigateByUrl(this.router.url + "/" + event.data.id);
      },
    };
    this.getConsultants();
  }

  async getConsultants(q = null) {
    this.spinner.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const res = await this.consultantService
          .getConsultations({ page, size: 1000, sort: "id,ASC", q })
          .toPromise();

        if (!res.content) {
          break;
        }
        rows.push(...res.content);
        rows.forEach(item => {
          const responseTime = item["firstResponseTime"]
            ? dayjs(item["firstResponseTime"])
            : dayjs();
          item["timer"] = dayjs(responseTime.diff(item["requestTime"])).format(
            "HH:mm:ss"
          );
          item["requestTime"] = dayjs(item["requestTime"]).format(
            "MM/D/YYYY h:mm a"
          );
        });
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
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  onPageSizeChange(ev) {
    this.pageSize = ev.target.value;
    this.gridOptions.api.paginationSetPageSize(this.pageSize);
  }
}
