import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-bidprocess',
  templateUrl: './insight-bidprocess.component.html',
  styleUrls: ['./insight-bidprocess.component.css']
})
export class InsightBidprocessComponent implements OnInit {
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
      headerName: 'Bid Order Item Lookup',
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
      headerName: 'Bid Process No',
      field: 'bid_process_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_process_id',
      headerTooltip: 'bid_process_id'
    },
    {
      headerName: 'Bid Process Name',
      field: 'bid_process_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_process_name',
      headerTooltip: 'bid_process_name'
    },
    {
      headerName: 'Bid Winner',
      field: 'bid_winner',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_winner',
      headerTooltip: 'bid_winner'
    },
    {
      headerName: 'Bid Accepted',
      field: 'bid_accepted',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'bid_accepted',
      headerTooltip: 'bid_accepted'
    },
    {
      headerName: 'Counter Accepted',
      field: 'counter_accepted',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'counter_accepted',
      headerTooltip: 'counter_accepted'
    },
    {
      headerName: 'Counter Price',
      field: 'counter_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'counter_price',
      headerTooltip: 'counter_price'
    },
    {
      headerName: 'Created By',
      field: 'created_by',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'created_by',
      headerTooltip: 'created_by'
    },
    {
      headerName: 'Created Date/Time',
      field: 'created_date',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'created_date'
    },
    {
      headerName: 'Order Lookup',
      field: 'customer_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_order_id',
      headerTooltip: 'customer_order_id'
    },
    {
      headerName: 'Combined Customer Price',
      field: 'customer_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_price',
      headerTooltip: 'customer_price'
    },
    {
      headerName: 'Equipment Numbers',
      field: 'equipment_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipment_id',
      headerTooltip: 'equipment_id'
    },
    {
      headerName: 'Equipment Names',
      field: 'equipment_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipment_name',
      headerTooltip: 'equipment_name'
    },
    {
      headerName: 'Modified By',
      field: 'last_modified_by',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_modified_by',
      headerTooltip: 'last_modified_by'
    },
    {
      headerName: 'Last Modified Date/Time',
      field: 'last_modified_date',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_modified_date',
      headerTooltip: 'last_modified_date'
    },
    {
      headerName: 'Material Names',
      field: 'materialName',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'materialName',
      headerTooltip: 'materialName',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Material Numbers',
      field: 'material_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'material_id',
      headerTooltip: 'material_id',
      valueFormatter: v => v && v.value && v.value.join(',')
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
      headerName: 'Quote Price',
      field: 'quote_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'quote_price',
      headerTooltip: 'quote_price'
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
      headerName: 'Vendor Lookup',
      field: 'vendor_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_id',
      headerTooltip: 'vendor_id'
    },
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_name',
      headerTooltip: 'vendor_name'
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
