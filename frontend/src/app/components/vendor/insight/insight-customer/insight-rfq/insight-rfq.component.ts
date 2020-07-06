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
      headerName: 'PE RFQ No.',
      field: 'rfq_id',
      hide: false,
      sortable: false,
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
      headerName: 'RFQ Profile',
      field: 'rfq_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'rfq_name',
      headerTooltip: 'rfq_profile_name'
    },
    {
      headerName: 'RFQ Type',
      field: 'project_type',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'project_type',
      headerTooltip: 'project_type'
    },
    {
      headerName: 'Stage',
      field: 'rfq_status',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'rfq_status',
      headerTooltip: 'rfq_status'
    },
    {
      headerName: 'Account Name',
      field: 'account_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'account_name',
      headerTooltip: 'account_name'
    },
    {
      headerName: 'Customer First',
      field: 'customer_first',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_first',
      headerTooltip: 'customer_first'
    },
    {
      headerName: 'Customer Last',
      field: 'customer_last',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_last',
      headerTooltip: 'customer_last'
    },
    {
      headerName: 'Customer Phone',
      field: 'customer_phone',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_phone',
      headerTooltip: 'customer_phone'
    },
    {
      headerName: 'Email',
      field: 'email',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'email',
      headerTooltip: 'email'
    },
    {
      headerName: 'RFQ Created',
      field: 'created_date',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'created_date'
    },
    {
      headerName: 'NDA',
      field: 'nda',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'nda',
      headerTooltip: 'nda'
    },
    {
      headerName: 'Regions',
      field: 'regions',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'regions',
      headerTooltip: 'regions'
    },
    {
      headerName: 'Part Certs',
      field: 'part_certs',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_certs',
      headerTooltip: 'part_certs'
    },
    {
      headerName: 'CAD File Count',
      field: 'cad_file_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'cad_file_count',
      headerTooltip: 'cad_file_count'
    },
    {
      headerName: 'Part Count',
      field: 'part_count',
      hide: false,
      sortable: false,
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
