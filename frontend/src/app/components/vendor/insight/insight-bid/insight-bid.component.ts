import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-bid',
  templateUrl: './insight-bid.component.html',
  styleUrls: ['./insight-bid.component.css']
})
export class InsightBidComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Vendor ID',
      field: 'vendor_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_id',
      headerTooltip: 'Vendor ID'
    },
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_name',
      headerTooltip: 'Vendor Name'
    },
    {
      headerName: 'Bid Winner',
      field: 'bid_winner',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_winner',
      headerTooltip: 'Bid Winner'
    },
    {
      headerName: 'Bid ID',
      field: 'bid_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_id',
      headerTooltip: 'Bid ID'
    },
    {
      headerName: 'RFQ ID',
      field: 'rfq_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'rfq_id',
      headerTooltip: 'RFQ ID'
    },
    {
      headerName: 'Part ID',
      field: 'part_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_id',
      headerTooltip: 'Part ID'
    },
    {
      headerName: 'Customer Order ID',
      field: 'customer_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_order_id',
      headerTooltip: 'Customer Order ID'
    },
    {
      headerName: 'Customer Price',
      field: 'customer_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_price',
      headerTooltip: 'Customer Price'
    },
    {
      headerName: 'Vendor Price',
      field: 'vendor_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_price',
      headerTooltip: 'Vendor Price'
    },
    {
      headerName: 'Counter Price',
      field: 'counter_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'counter_price',
      headerTooltip: 'Counter Price'
    },
    {
      headerName: 'Bid Accepted',
      field: 'bid_accepted',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_accepted',
      headerTooltip: 'Bid Accepted'
    },
    {
      headerName: 'Counter Accepted',
      field: 'counter_accepted',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'counter_accepted',
      headerTooltip: 'Counter Accepted'
    },
    {
      headerName: 'Material ID',
      field: 'material_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'material_id',
      headerTooltip: 'Material ID',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Material Name',
      field: 'material_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'material_name',
      headerTooltip: 'Material Name',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Tech ID',
      field: 'equipment_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipment_id',
      headerTooltip: 'Tech ID',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Tech Name',
      field: 'equipment_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipment_name',
      headerTooltip: 'Tech Name',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Created By',
      field: 'created_by',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'created_by',
      headerTooltip: 'Created By'
    },
    {
      headerName: 'Created Date',
      field: 'created_date',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'Created Date'
    },
    {
      headerName: 'Quote Price',
      field: 'quote_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'quote_price',
      headerTooltip: 'Quote Price '
    },
    {
      headerName: 'Bid Order Status',
      field: 'bid_order_status',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_order_status',
      headerTooltip: 'Bid Order Status'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
