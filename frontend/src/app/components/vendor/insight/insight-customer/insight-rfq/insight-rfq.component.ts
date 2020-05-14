import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-rfq',
  templateUrl: './insight-rfq.component.html',
  styleUrls: ['./insight-rfq.component.css']
})
export class InsightRfqComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'RFQ ID',
      field: 'rfq_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_id',
      headerTooltip: 'RFQ ID'
    },
    {
      headerName: 'RFQ Name',
      field: 'rfq_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_name',
      headerTooltip: 'RFQ Name'
    },
    {
      headerName: 'RFQ Status',
      field: 'rfq_status',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_status',
      headerTooltip: 'RFQ Status'
    },
    {
      headerName: 'Account Name',
      field: 'account_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'account_name',
      headerTooltip: 'Account Name'
    },
    {
      headerName: 'Customer First Name',
      field: 'customer_first',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_first',
      headerTooltip: 'Customer First Name'
    },
    {
      headerName: 'Customer Last Name',
      field: 'customer_last',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_last',
      headerTooltip: 'Customer Last Name'
    },
    {
      headerName: 'Customer Phone',
      field: 'customer_phone',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_phone',
      headerTooltip: 'Customer Phone'
    },
    {
      headerName: 'Customer Email',
      field: 'email',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'email',
      headerTooltip: 'Customer Email'
    },
    {
      headerName: 'Created Date',
      field: 'created_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'Created Date'
    },
    {
      headerName: 'NDA',
      field: 'nda',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'nda',
      headerTooltip: 'NDA'
    },
    {
      headerName: 'Region',
      field: 'regions',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'regions',
      headerTooltip: 'Region'
    },
    {
      headerName: 'Part Certs',
      field: 'part_certs',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_certs',
      headerTooltip: 'Part Certs'
    },
    {
      headerName: 'CAD File Count',
      field: 'cad_file_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'cad_file_count',
      headerTooltip: 'CAD File Count'
    },
    {
      headerName: 'Part Count',
      field: 'part_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_count',
      headerTooltip: 'Part Count'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
