import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-vendor-order',
  templateUrl: './insight-vendor-order.component.html',
  styleUrls: ['./insight-vendor-order.component.css']
})
export class InsightVendorOrderComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Vendor Order Number',
      field: 'vendor_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_order_id',
      headerTooltip: 'vendor_order_id'
    },
    {
      headerName: 'Vendor Order Name',
      field: 'vendor_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_order_id',
      headerTooltip: 'vendor_order_id'
    },
    {
      headerName: 'Vendor Order Display Name',
      field: 'vendor_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_order_id',
      headerTooltip: 'vendor_order_id'
    },
    {
      headerName: 'Vendor Order Status',
      field: 'vendor_order_status',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_order_status',
      headerTooltip: 'vendor_order_status'
    },
    {
      headerName: 'Vendor Suborder Numbers',
      field: 'vendor_sub_order_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_sub_order_ids',
      headerTooltip: 'vendor_sub_order_ids',
      valueFormatter: v => this.getActualId(v.value)
    },
    {
      headerName: 'Vendor Suborder Display Names',
      field: 'vendor_sub_order_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_sub_order_ids',
      headerTooltip: 'vendor_sub_order_ids',
      valueFormatter: v => v.value && v.value.join(', ')
    },
    {
      headerName: 'Part Numbers',
      field: 'part_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_ids',
      headerTooltip: 'part_ids',
      valueFormatter: v => this.getActualId(v.value)
    },
    {
      headerName: 'Part Display Names',
      field: 'part_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_ids',
      headerTooltip: 'part_ids'
    },
    {
      headerName: 'Bid Order ID',
      field: 'bid_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_id',
      headerTooltip: 'bid_order_id'
    },
    {
      headerName: 'Bid Order Item Numbers',
      field: 'bid_order_item_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_item_ids',
      headerTooltip: 'bid_order_item_ids',
      valueFormatter: v => this.getActualId(v.value)
    },
    {
      headerName: 'Bid Order Item Display Names',
      field: 'bid_order_item_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_item_ids',
      headerTooltip: 'bid_order_item_ids',
      valueFormatter: v => v.value && v.value.join(', ')
    },
    {
      headerName: 'Bid Process ID',
      field: 'bid_process_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_process_id',
      headerTooltip: 'bid_process_id'
    }
  ];
  constructor() {}

  getActualId(ids) {
    return (ids || [])
      .reduce((arr, value) => {
        const split = (value || '').split('.');
        if (split.length > 1) {
          arr.push(split[1]);
        }
        return arr;
      }, [])
      .join(', ');
  }

  ngOnInit() {}
}
