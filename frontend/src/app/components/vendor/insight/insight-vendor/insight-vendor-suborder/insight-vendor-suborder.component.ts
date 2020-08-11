import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-vendor-sub-order',
  templateUrl: './insight-vendor-suborder.component.html',
  styleUrls: ['./insight-vendor-suborder.component.css']
})
export class InsightVendorSuborderComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Vendor Suborder No',
      field: 'vendor_sub_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_sub_order_id',
      headerTooltip: 'vendor_sub_order_id'
    },
    {
      headerName: 'Vendor Suborder Name',
      field: 'vendor_sub_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_sub_order_id',
      headerTooltip: 'vendor_sub_order_id'
    },
    {
      headerName: 'Vendor Suborder Display Name',
      field: 'vendor_sub_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_sub_order_id',
      headerTooltip: 'vendor_sub_order_id',
      valueFormatter: v => v.value && v.data.vendor_order_id && v.data.vendor_order_id + '.' + v.value
    },
    {
      headerName: 'Vendor Job ID',
      field: 'vendor_job_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_job_id',
      headerTooltip: 'vendor_job_id'
    },
    {
      headerName: 'Job Status',
      field: 'job_status',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'job_status',
      headerTooltip: 'job_status'
    },
    {
      headerName: 'Last Completed Task',
      field: 'last_completed_task',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_completed_task',
      headerTooltip: 'last_completed_task'
    },
    {
      headerName: 'Last Completed Task Description',
      field: 'last_completed_task_description',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_completed_task_description',
      headerTooltip: 'last_completed_task_description'
    },
    {
      headerName: 'Vendor Order ID',
      field: 'vendor_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_order_id',
      headerTooltip: 'vendor_order_id'
    },
    {
      headerName: 'Vendor Order Status',
      field: 'vendor_order_status',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_order_status',
      headerTooltip: 'vendor_order_status'
    },
    {
      headerName: 'Vendor Number',
      field: 'vendor_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_id',
      headerTooltip: 'vendor_id'
    },
    {
      headerName: 'Vendor Email',
      field: 'vendor_email',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_email',
      headerTooltip: 'vendor_email'
    },
    {
      headerName: 'Vendor Phone No',
      field: 'vendor_phone_no',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_phone_no',
      headerTooltip: 'vendor_phone_no'
    },
    {
      headerName: 'Customer Email',
      field: 'customer_email',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_email',
      headerTooltip: 'customer_email'
    },
    {
      headerName: 'Bid Order Item',
      field: 'bid_order_item',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_item',
      headerTooltip: 'bid_order_item'
    },
    {
      headerName: 'Part ID',
      field: 'part_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_id',
      headerTooltip: 'part_id'
    },
    {
      headerName: 'Customer Order ID',
      field: 'customer_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_order_id',
      headerTooltip: 'customer_order_id'
    },
    {
      headerName: 'Total Row Count',
      field: 'total_row_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'total_row_count',
      headerTooltip: 'total_row_count'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
