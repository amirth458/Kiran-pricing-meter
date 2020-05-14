import { Component, OnInit } from '@angular/core';

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
      headerTooltip: 'rfq_id'
    },
    {
      headerName: 'rfq_name',
      field: 'rfq_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_name',
      headerTooltip: 'rfq_name'
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
  constructor() {}

  ngOnInit() {}
}
