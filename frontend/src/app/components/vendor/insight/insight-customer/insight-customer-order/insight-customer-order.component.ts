import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-customer-order',
  templateUrl: './insight-customer-order.component.html',
  styleUrls: ['./insight-customer-order.component.css']
})
export class InsightCustomerOrderComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'order_id',
      field: 'order_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'order_id',
      headerTooltip: 'order_id'
    },
    {
      headerName: 'order_status',
      field: 'order_status',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'order_status',
      headerTooltip: 'order_status'
    },
    {
      headerName: 'order_price',
      field: 'order_price',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'order_price',
      headerTooltip: 'order_price'
    },
    {
      headerName: 'vendor_price',
      field: 'vendor_price',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_price',
      headerTooltip: 'vendor_price'
    },
    {
      headerName: 'part_ids',
      field: 'part_ids',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_ids',
      headerTooltip: 'part_ids',
      valueFormatter: v => v.value && v.value.join(', ')
    },
    {
      headerName: 'margin_percent',
      field: 'margin_percent',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'margin_percent',
      headerTooltip: 'margin_percent'
    },
    {
      headerName: 'number_of_parts',
      field: 'number_of_parts',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'number_of_parts',
      headerTooltip: 'number_of_parts'
    },
    {
      headerName: 'total_no_of_qty',
      field: 'total_no_of_qty',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'total_no_of_qty',
      headerTooltip: 'total_no_of_qty'
    },
    {
      headerName: 'customer_name',
      field: 'customer_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_name',
      headerTooltip: 'customer_name'
    },
    {
      headerName: 'customer_email',
      field: 'customer_email',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_email',
      headerTooltip: 'customer_email'
    },
    {
      headerName: 'vendor_name',
      field: 'vendor_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_name',
      headerTooltip: 'vendor_name'
    },
    {
      headerName: 'vendor_email',
      field: 'vendor_email',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_email',
      headerTooltip: 'vendor_email'
    },
    {
      headerName: 'created_date',
      field: 'created_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'created_date'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
