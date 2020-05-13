import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-part',
  templateUrl: './insight-part.component.html',
  styleUrls: ['./insight-part.component.css']
})
export class InsightPartComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Part ID',
      field: 'part_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_id',
      headerTooltip: 'Part ID'
    },
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
      headerName: 'Customer Order ID',
      field: 'customer_order_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_order_id',
      headerTooltip: 'Customer Order ID'
    },
    {
      headerName: 'File Name',
      field: 'file_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'file_name',
      headerTooltip: 'File Name'
    },
    {
      headerName: 'Part Status',
      field: 'part_status',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_status',
      headerTooltip: 'Part Status'
    },
    {
      headerName: 'Part Quote Price',
      field: 'part_quote_price',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_quote_price',
      headerTooltip: 'Part Quote Price'
    },
    {
      headerName: 'Customer Account Name',
      field: 'customer_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_name',
      headerTooltip: 'Customer Account Name'
    },
    {
      headerName: 'Customer Email',
      field: 'customer_email',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_email',
      headerTooltip: 'Customer Email'
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'quantity',
      headerTooltip: 'Quantity'
    },
    {
      headerName: 'Material Count',
      field: 'material_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'material_count',
      headerTooltip: 'Material Count'
    },
    {
      headerName: 'Material',
      field: 'material',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'material',
      headerTooltip: 'Material',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Tech Count',
      field: 'equipment_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_count',
      headerTooltip: 'Tech Count'
    },
    {
      headerName: 'Technology',
      field: 'technology',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'technology',
      headerTooltip: 'Technology',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Post Process',
      field: 'post_process',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'post_process',
      headerTooltip: 'Post Process'
    },
    {
      headerName: 'Target Delivery Date',
      field: 'target_delivery_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'target_delivery_date',
      headerTooltip: 'Target Delivery Date'
    },
    {
      headerName: 'Shipping Address',
      field: 'shipping_address',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'shipping_address',
      headerTooltip: 'Shipping Address'
    },
    {
      headerName: 'Created Date',
      field: 'created_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'Created Date'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
