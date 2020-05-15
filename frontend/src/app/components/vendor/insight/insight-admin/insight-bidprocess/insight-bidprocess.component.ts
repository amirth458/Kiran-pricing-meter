import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-bidprocess',
  templateUrl: './insight-bidprocess.component.html',
  styleUrls: ['./insight-bidprocess.component.css']
})
export class InsightBidprocessComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'bid_order_id',
      field: 'bid_order_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'bid_order_id',
      headerTooltip: 'bid_order_id'
    },
    {
      headerName: 'bid_order_item_id',
      field: 'bid_order_item_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'bid_order_item_id',
      headerTooltip: 'bid_order_item_id'
    },
    {
      headerName: 'bid_order_status',
      field: 'bid_order_status',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'bid_order_status',
      headerTooltip: 'bid_order_status'
    },
    {
      headerName: 'bid_process_id',
      field: 'bid_process_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'bid_process_id',
      headerTooltip: 'bid_process_id'
    },
    {
      headerName: 'bid_process_name',
      field: 'bid_process_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'bid_process_name',
      headerTooltip: 'bid_process_name'
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
      headerName: 'counter_price',
      field: 'counter_price',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'counter_price',
      headerTooltip: 'counter_price'
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
      headerName: 'equipment_id',
      field: 'equipment_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_id',
      headerTooltip: 'equipment_id'
    },
    {
      headerName: 'equipment_name',
      field: 'equipment_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_name',
      headerTooltip: 'equipment_name'
    },
    {
      headerName: 'last_modified_by',
      field: 'last_modified_by',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'last_modified_by',
      headerTooltip: 'last_modified_by'
    },
    {
      headerName: 'last_modified_date',
      field: 'last_modified_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'last_modified_date',
      headerTooltip: 'last_modified_date'
    },
    {
      headerName: 'materialName',
      field: 'materialName',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'materialName',
      headerTooltip: 'materialName',
      valueFormatter: v => v && v.value && v.value.join(',')
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
      headerName: 'part_id',
      field: 'part_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_id',
      headerTooltip: 'part_id'
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
      headerName: 'rfq_id',
      field: 'rfq_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_id',
      headerTooltip: 'rfq_id'
    },
    {
      headerName: 'total_row_count',
      field: 'total_row_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'total_row_count',
      headerTooltip: 'total_row_count'
    },
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
      headerName: 'vendor_price',
      field: 'vendor_price',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_price',
      headerTooltip: 'vendor_price'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
