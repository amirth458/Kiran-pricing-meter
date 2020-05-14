import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-part',
  templateUrl: './insight-part.component.html',
  styleUrls: ['./insight-part.component.css']
})
export class InsightPartComponent implements OnInit {
  columnDefs = [
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
      headerName: 'rfq_id',
      field: 'rfq_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_id',
      headerTooltip: 'rfq_id'
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
      headerName: 'file_name',
      field: 'file_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'file_name',
      headerTooltip: 'file_name'
    },
    {
      headerName: 'part_status',
      field: 'part_status',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_status',
      headerTooltip: 'part_status'
    },
    {
      headerName: 'part_quote_price',
      field: 'part_quote_price',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_quote_price',
      headerTooltip: 'part_quote_price'
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
      headerName: 'quantity',
      field: 'quantity',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'quantity',
      headerTooltip: 'quantity'
    },
    {
      headerName: 'material_count',
      field: 'material_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'material_count',
      headerTooltip: 'material_count'
    },
    {
      headerName: 'material',
      field: 'material',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'material',
      headerTooltip: 'material',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'equipment_count',
      field: 'equipment_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_count',
      headerTooltip: 'equipment_count'
    },
    {
      headerName: 'technology',
      field: 'technology',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'technology',
      headerTooltip: 'technology',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'post_process',
      field: 'post_process',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'post_process',
      headerTooltip: 'post_process'
    },
    {
      headerName: 'target_delivery_date',
      field: 'target_delivery_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'target_delivery_date',
      headerTooltip: 'target_delivery_date'
    },
    {
      headerName: 'shipping_address',
      field: 'shipping_address',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'shipping_address',
      headerTooltip: 'shipping_address'
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
