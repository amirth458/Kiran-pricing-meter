import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-customer-order',
  templateUrl: './insight-customer-order.component.html',
  styleUrls: ['./insight-customer-order.component.css']
})
export class InsightCustomerOrderComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Customer Name',
      field: 'customer_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_name',
      headerTooltip: 'customer_name'
    },
    {
      headerName: 'Order No.',
      field: 'order_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'order_id',
      headerTooltip: 'order_id'
    },
    {
      headerName: 'RFQ ID',
      field: 'rfq_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_id',
      headerTooltip: 'rfq_id'
    },
    {
      headerName: 'Order Type',
      field: 'order_type',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'order_type',
      headerTooltip: 'order_type'
    },
    {
      headerName: 'Order Status',
      field: 'order_status',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'order_status',
      headerTooltip: 'order_status'
    },
    {
      headerName: 'Price',
      field: 'order_price',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'order_price',
      headerTooltip: 'order_price'
    },
    {
      headerName: 'Vendor Receives Amount',
      field: 'vendor_price',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_price',
      headerTooltip: 'vendor_price'
    },
    {
      headerName: 'Part Ids',
      field: 'part_ids',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_ids',
      headerTooltip: 'part_ids',
      valueFormatter: v => v.value && v.value.join(', ')
    },
    {
      headerName: 'Margin $',
      field: 'margin',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'margin',
      headerTooltip: 'margin'
    },
    {
      headerName: 'Margin %',
      field: 'margin_percent',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'margin_percent',
      headerTooltip: 'margin_percent'
    },
    {
      headerName: 'No. of Parts',
      field: 'number_of_parts',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'number_of_parts',
      headerTooltip: 'number_of_parts'
    },
    {
      headerName: 'Proposed Quantity',
      field: 'total_no_of_qty',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'total_no_of_qty',
      headerTooltip: 'total_no_of_qty'
    },
    {
      headerName: 'Customer Phone No',
      field: 'customer_phone_no',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_phone_no',
      headerTooltip: 'customer_phone_no'
    },
    {
      headerName: 'Customer Email',
      field: 'customer_email',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_email',
      headerTooltip: 'customer_email'
    },
    {
      headerName: 'Vendor Contact Name',
      field: 'vendor_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_name',
      headerTooltip: 'vendor_name'
    },
    {
      headerName: 'Vendor Email',
      field: 'vendor_email',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_email',
      headerTooltip: 'vendor_email'
    },
    {
      headerName: 'Order Created Date/Time',
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
