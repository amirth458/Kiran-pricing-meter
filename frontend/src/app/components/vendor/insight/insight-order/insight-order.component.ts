import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-order',
  templateUrl: './insight-order.component.html',
  styleUrls: ['./insight-order.component.css']
})
export class InsightOrderComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Order ID',
      field: 'order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'order_id',
      headerTooltip: 'Order ID'
    },
    {
      headerName: 'Order Status',
      field: 'order_status',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'order_status',
      headerTooltip: 'Order Status'
    },
    {
      headerName: 'Order Price',
      field: 'order_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'order_price',
      headerTooltip: 'Order Price'
    },
    {
      headerName: 'Vendor Price',
      field: 'vendor_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_price',
      headerTooltip: 'Vendor Price'
    },
    {
      headerName: 'Margin, %',
      field: 'margin_percent',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'margin_percent',
      headerTooltip: 'Margin, %'
    },
    {
      headerName: 'Number of Parts',
      field: 'number_of_parts',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'number_of_parts',
      headerTooltip: 'Number of Parts'
    },
    {
      headerName: 'Total No of Quantity',
      field: 'total_no_of_qty',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'total_no_of_qty',
      headerTooltip: 'Total No of Quantity'
    },
    {
      headerName: 'Customer Name',
      field: 'customer_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_name',
      headerTooltip: 'Customer Name'
    },
    {
      headerName: 'Customer Email',
      field: 'customer_email',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_email',
      headerTooltip: 'Customer Email'
    },
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_name',
      headerTooltip: 'Vendor Name'
    },
    {
      headerName: 'Vendor Email',
      field: 'vendor_email',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_email',
      headerTooltip: 'Vendor Email'
    },
    {
      headerName: 'Created Date',
      field: 'created_date',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'Created Date'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
