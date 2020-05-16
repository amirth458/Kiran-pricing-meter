import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-bidorderitem',
  templateUrl: './insight-bidorderitem.component.html',
  styleUrls: ['./insight-bidorderitem.component.css']
})
export class InsightBidorderitemComponent implements OnInit {
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
      headerName: 'part_id',
      field: 'part_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_id',
      headerTooltip: 'part_id'
    },
    {
      headerName: 'part_quote_id',
      field: 'part_quote_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_quote_id',
      headerTooltip: 'part_quote_id'
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
