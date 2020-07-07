import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-bidorder',
  templateUrl: './insight-bidorder.component.html',
  styleUrls: ['./insight-bidorder.component.css']
})
export class InsightBidorderComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Bid Order No',
      field: 'bid_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_id',
      headerTooltip: 'bid_order_id'
    },
    {
      headerName: 'Bid Offer Price',
      field: 'bid_offer_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_offer_price',
      headerTooltip: 'bid_offer_price'
    },
    {
      headerName: 'Bid Order Item Count',
      field: 'bid_order_item_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_item_count',
      headerTooltip: 'bid_order_item_count'
    },
    {
      headerName: 'Bid Order Item(s)',
      field: 'bid_order_item_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_item_ids',
      headerTooltip: 'bid_order_item_ids'
    },
    {
      headerName: 'Bid Order Status',
      field: 'bid_order_status',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_status',
      headerTooltip: 'bid_order_status'
    },
    {
      headerName: 'Combined Bid Price',
      field: 'combined_bid_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'combined_bid_price',
      headerTooltip: 'combined_bid_price'
    },
    {
      headerName: 'Customer Order IDs',
      field: 'customer_order_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_order_ids',
      headerTooltip: 'customer_order_ids',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Related Customer Parts',
      field: 'part_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_ids',
      headerTooltip: 'part_ids',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Part Quote IDs',
      field: 'part_quote_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_quote_ids',
      headerTooltip: 'part_quote_ids',
      valueFormatter: v => v && v.value && v.value.join(',')
    }
  ];

  constructor() {}

  ngOnInit() {}
}
