import { environment } from './../../../../../../environments/environment';
import { NgxSpinnerService } from "ngx-spinner";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ConsultantService } from "./../../../../../service/consultant.service";
import { Component, OnInit } from "@angular/core";
import { GridOptions, GridApi } from "ag-grid-community";
import { catchError, take } from "rxjs/operators";
import { throwError } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastrService } from "ngx-toastr";
declare var require: any
const dayjs = require('dayjs');

@Component({
  selector: "app-referral-details",
  templateUrl: "./referral-details.component.html",
  styleUrls: ["./referral-details.component.css"]
})
export class ReferralDetailsComponent implements OnInit {
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
      filter: false
    },
    {
      headerName: "Status",
      field: "status",
      hide: false,
      sortable: true,
      filter: false
    }
  ];
  gridOptions: GridOptions;
  gridApi: GridApi;
  rowData;
  data;
  featureData;
  selectedId;

  constructor(
    private consultantService: ConsultantService,
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private route: Router
  ) {
    this.router.params.subscribe(params => {
      this.selectedId = params.id;
      this.getData(this.selectedId);
    });
  }

  detailForm: FormGroup = this.fb.group({
    comment: [null, [Validators.required]]
  });

  showRequired(field: string): boolean {
    return (
      this.detailForm.value[field] === "" ||
      this.detailForm.value[field] === null
    );
  }

  async save(event) {
    if (this.detailForm.valid) {
      this.spinner.show();

      this.consultantService
        .createComment(this.selectedId, this.detailForm.value["comment"])
        .pipe(catchError(e => this.handleResponseError(e)))
        .subscribe(() => {
          this.spinner.hide();
          this.toastr
            .success(
              "Comment added Successfully."
            )
            .onTap.pipe(take(1))
            .subscribe(() => {
              location.href = location.href;
            });
          location.href = location.href;
        });
    }
  }

  handleResponseError(error: HttpErrorResponse) {
    this.spinner.hide();
    this.toastr.error(`Fail to add comment. Please contact your admin`);
    return throwError("Error");
  }

  viewMarketplace() {
    window.open(`${environment.MARKETPLACE_URL}${this.featureData.type}/${this.featureData.name}`);
  }

  ngOnInit() {
    this.gridOptions = {
      columnDefs: this.columnDefs,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35
    };
  }

  async getData(id: number) {
    this.data = await this.consultantService
      .getConsultationById(id)
      .toPromise();
    const responseTime = this.data["firstResponseTime"]
      ? dayjs(this.data["firstResponseTime"])
      : dayjs();
    this.data["timer"] = dayjs(
      responseTime.diff(this.data["requestTime"])
    ).format("HH:mm:ss");
    this.data["requestTime"] = dayjs(this.data["requestTime"]).format(
      "MM/D/YYYY h:mm a"
    );

    this.rowData = [this.data];
    if (this.data["materialMasterView"]) {
      this.featureData = {
        image: this.data["materialMasterView"]["Raw Image"],
        name: this.data["materialMasterView"]["Material"],
        price: this.data["materialMasterView"]["materialPrice"],
        description: this.data["materialMasterView"]["OEM Description"],
        type: 'material'
      };
    } else {
      this.featureData = {
        image: this.data["equipmentMasterView"]["Raw Image"],
        name: this.data["equipmentMasterView"]["Equipment"],
        price: this.data["equipmentMasterView"]["equipmentPrice"],
        description: this.data["equipmentMasterView"]["OEM Description"],
        type: 'equipment'
      };
    }
  }

  onGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  dateFormat(str: any) {
    return dayjs(str).format('MM/D/YYYY h:mm a');
  }
}
