import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-customer-sub-order',
  templateUrl: './insight-customer-suborder.component.html',
  styleUrls: ['./insight-customer-suborder.component.css']
})
export class InsightCustomerSuborderComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Suborder No',
      field: 'part_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_id',
      headerTooltip: 'part_id'
    },
    {
      headerName: 'Order ID',
      field: 'customer_order_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'customer_order_id',
      headerTooltip: 'customer_order_id'
    },
    {
      headerName: 'Total Cost',
      field: 'total_cost',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'total_cost',
      headerTooltip: 'total_cost'
    },
    {
      headerName: 'Order Created Date/Time',
      field: 'order_created_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'order_created_date',
      headerTooltip: 'order_created_date'
    },
    {
      headerName: 'Target Delivery Date',
      field: 'target_delivery_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'target_delivery_date',
      headerTooltip: 'target_delivery_date'
    },
    {
      headerName: 'Implied Delivery Window',
      field: 'implied_delivery_window',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'implied_delivery_window',
      headerTooltip: 'implied_delivery_window'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
