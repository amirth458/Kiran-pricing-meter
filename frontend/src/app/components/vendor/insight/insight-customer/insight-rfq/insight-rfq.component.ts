import { Component, OnInit } from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

import { PartService } from 'src/app/service/part.service';
import { Util } from '../../../../../util/Util';

@Component({
  selector: 'app-insight-rfq',
  templateUrl: './insight-rfq.component.html',
  styleUrls: ['./insight-rfq.component.css']
})
export class InsightRfqComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'rfq_id',
      field: 'rfq_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_id',
      headerTooltip: 'rfq_id',
      cellRenderer: 'linkCellRenderer',
      cellRendererParams: {
        action: param => {
          this.onRowClick(param);
        }
      }
    },
    {
      headerName: 'rfq_profile_name',
      field: 'rfq_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_name',
      headerTooltip: 'rfq_profile_name'
    },
    {
      headerName: 'project_type',
      field: 'project_type',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'project_type',
      headerTooltip: 'project_type'
    },
    {
      headerName: 'rfq_status',
      field: 'rfq_status',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_status',
      headerTooltip: 'rfq_status'
    },
    {
      headerName: 'account_name',
      field: 'account_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'account_name',
      headerTooltip: 'account_name'
    },
    {
      headerName: 'customer_first',
      field: 'customer_first',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_first',
      headerTooltip: 'customer_first'
    },
    {
      headerName: 'customer_last',
      field: 'customer_last',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_last',
      headerTooltip: 'customer_last'
    },
    {
      headerName: 'customer_phone',
      field: 'customer_phone',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_phone',
      headerTooltip: 'customer_phone'
    },
    {
      headerName: 'email',
      field: 'email',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'email',
      headerTooltip: 'email'
    },
    {
      headerName: 'created_date',
      field: 'created_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'created_date'
    },
    {
      headerName: 'nda',
      field: 'nda',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'nda',
      headerTooltip: 'nda'
    },
    {
      headerName: 'regions',
      field: 'regions',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'regions',
      headerTooltip: 'regions'
    },
    {
      headerName: 'part_certs',
      field: 'part_certs',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_certs',
      headerTooltip: 'part_certs'
    },
    {
      headerName: 'cad_file_count',
      field: 'cad_file_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'cad_file_count',
      headerTooltip: 'cad_file_count'
    },
    {
      headerName: 'part_count',
      field: 'part_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_count',
      headerTooltip: 'part_count'
    }
  ];
  parts = null;

  constructor(protected spinner: NgxSpinnerService, public partService: PartService, public toastr: ToastrService) {}

  ngOnInit() {}

  onRowClick(ev) {
    this.spinner.show();
    this.partService.getPartsByRfqId(ev.data.rfq_id).subscribe(
      res => {
        this.parts = res;
        if (this.parts.length === 0) {
          this.parts = null;
          this.toastr.warning('No Parts are created');
        }
        this.spinner.hide();
      },
      (err: any) => {
        this.spinner.hide();
        let message = 'Unable to read RFQ';
        const isJson: any = Util.hasJson(err.error.message);
        if (isJson) {
          const errObj: any = JSON.parse(err.error.message);
          message = errObj.message || message;
        }
        this.toastr.error(message);
      }
    );
  }

  onClose() {
    this.parts = null;
  }
}
