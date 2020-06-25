import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-vendor-order',
  templateUrl: './insight-vendor-order.component.html',
  styleUrls: ['./insight-vendor-order.component.css']
})
export class InsightVendorOrderComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'vendor_order_id',
      field: 'vendor_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_order_id',
      headerTooltip: 'vendor_order_id'
    },
    {
      headerName: 'vendor_order_status',
      field: 'vendor_order_status',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_order_status',
      headerTooltip: 'vendor_order_status'
    },
    {
      headerName: 'vendor_sub_order_ids',
      field: 'vendor_sub_order_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_sub_order_ids',
      headerTooltip: 'vendor_sub_order_ids',
      valueFormatter: v => v.value && v.value.join(', ')
    },
    {
      headerName: 'part_ids',
      field: 'part_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_ids',
      headerTooltip: 'part_ids'
    },
    {
      headerName: 'bid_order_id',
      field: 'bid_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_id',
      headerTooltip: 'bid_order_id'
    },
    {
      headerName: 'bid_order_item_ids',
      field: 'bid_order_item_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_item_ids',
      headerTooltip: 'bid_order_item_ids',
      valueFormatter: v => v.value && v.value.join(', ')
    },
    {
      headerName: 'bid_process_id',
      field: 'bid_process_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_process_id',
      headerTooltip: 'bid_process_id'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
