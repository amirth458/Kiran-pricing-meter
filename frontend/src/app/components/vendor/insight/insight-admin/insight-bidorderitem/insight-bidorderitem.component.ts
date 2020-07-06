import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-bidorderitem',
  templateUrl: './insight-bidorderitem.component.html',
  styleUrls: ['./insight-bidorderitem.component.css']
})
export class InsightBidorderitemComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Bid Order Lookup',
      field: 'bid_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_id',
      headerTooltip: 'bid_order_id'
    },
    {
      headerName: 'Bid Order Item No',
      field: 'bid_order_item_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_item_id',
      headerTooltip: 'bid_order_item_id'
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
      headerName: 'Customer Order Lookup',
      field: 'customer_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_order_id',
      headerTooltip: 'customer_order_id'
    },
    {
      headerName: 'Customer Price',
      field: 'customer_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_price',
      headerTooltip: 'customer_price'
    },
    {
      headerName: 'Part Lookup',
      field: 'part_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_id',
      headerTooltip: 'part_id'
    },
    {
      headerName: 'Part Quote Lookup',
      field: 'part_quote_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_quote_id',
      headerTooltip: 'part_quote_id'
    },
    {
      headerName: 'RFQ Lookup',
      field: 'rfq_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'rfq_id',
      headerTooltip: 'rfq_id'
    },
    {
      headerName: 'Vendor Price',
      field: 'vendor_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_price',
      headerTooltip: 'vendor_price'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
