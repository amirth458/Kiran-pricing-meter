import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-vendor-sub-order',
  templateUrl: './insight-vendor-suborder.component.html',
  styleUrls: ['./insight-vendor-suborder.component.css']
})
export class InsightVendorSuborderComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'vendor_sub_order_id',
      field: 'vendor_sub_order_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_sub_order_id',
      headerTooltip: 'vendor_sub_order_id'
    },
    {
      headerName: 'vendor_job_id',
      field: 'vendor_job_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_job_id',
      headerTooltip: 'vendor_job_id'
    },
    {
      headerName: 'job_status',
      field: 'job_status',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'job_status',
      headerTooltip: 'job_status'
    },
    {
      headerName: 'last_completed_task',
      field: 'last_completed_task',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'last_completed_task',
      headerTooltip: 'last_completed_task'
    },
    {
      headerName: 'last_completed_task_description',
      field: 'last_completed_task_description',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'last_completed_task_description',
      headerTooltip: 'last_completed_task_description'
    },
    {
      headerName: 'vendor_order_id',
      field: 'vendor_order_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_order_id',
      headerTooltip: 'vendor_order_id'
    },
    {
      headerName: 'vendor_order_status',
      field: 'vendor_order_status',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_order_status',
      headerTooltip: 'vendor_order_status'
    },
    {
      headerName: 'bid_order_item',
      field: 'bid_order_item',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'bid_order_item',
      headerTooltip: 'bid_order_item'
    },
    {
      headerName: 'part_id',
      field: 'part_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_id',
      headerTooltip: 'part_id'
    },
    {
      headerName: 'customer_order_id',
      field: 'customer_order_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_order_id',
      headerTooltip: 'customer_order_id'
    },
    {
      headerName: 'total_row_count',
      field: 'total_row_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'total_row_count',
      headerTooltip: 'total_row_count'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
