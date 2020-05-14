import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-bidprocess',
  templateUrl: './insight-bidprocess.component.html',
  styleUrls: ['./insight-bidprocess.component.css']
})
export class InsightBidprocessComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'vendor_id',
      field: 'vendor_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_id',
      headerTooltip: 'vendor_id'
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
      headerName: 'bid_winner',
      field: 'bid_winner',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'bid_winner',
      headerTooltip: 'bid_winner'
    },
    {
      headerName: 'bid_id',
      field: 'bid_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'bid_id',
      headerTooltip: 'bid_id'
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
      headerName: 'customer_price',
      field: 'customer_price',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_price',
      headerTooltip: 'customer_price'
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
      headerName: 'counter_price',
      field: 'counter_price',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'counter_price',
      headerTooltip: 'counter_price'
    },
    {
      headerName: 'bid_accepted',
      field: 'bid_accepted',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'bid_accepted',
      headerTooltip: 'bid_accepted'
    },
    {
      headerName: 'counter_accepted',
      field: 'counter_accepted',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'counter_accepted',
      headerTooltip: 'counter_accepted'
    },
    {
      headerName: 'material_id',
      field: 'material_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'material_id',
      headerTooltip: 'material_id',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'material_name',
      field: 'material_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'material_name',
      headerTooltip: 'material_name',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'equipment_id',
      field: 'equipment_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_id',
      headerTooltip: 'equipment_id',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'equipment_name',
      field: 'equipment_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_name',
      headerTooltip: 'equipment_name',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'created_by',
      field: 'created_by',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'created_by',
      headerTooltip: 'created_by'
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
      headerName: 'quote_price',
      field: 'quote_price',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'quote_price',
      headerTooltip: 'quote_price'
    },
    {
      headerName: 'bid_order_status',
      field: 'bid_order_status',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'bid_order_status',
      headerTooltip: 'bid_order_status'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
