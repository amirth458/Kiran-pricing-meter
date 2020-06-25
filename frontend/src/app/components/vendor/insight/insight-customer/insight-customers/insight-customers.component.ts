import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-customers',
  templateUrl: './insight-customers.component.html',
  styleUrls: ['./insight-customers.component.css']
})
export class InsightCustomersComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'user_id',
      field: 'user_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'user_id',
      headerTooltip: 'user_id'
    },
    {
      headerName: 'customer_id',
      field: 'customer_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_id',
      headerTooltip: 'customer_id'
    },
    {
      headerName: 'first_name',
      field: 'first_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'first_name',
      headerTooltip: 'first_name'
    },
    {
      headerName: 'last_name',
      field: 'last_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_name',
      headerTooltip: 'last_name'
    },
    {
      headerName: 'email',
      field: 'email',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'email',
      headerTooltip: 'email'
    },
    {
      headerName: 'phone_no',
      field: 'phone_no',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'phone_no',
      headerTooltip: 'phone_no'
    },
    {
      headerName: 'company_name',
      field: 'company_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'company_name',
      headerTooltip: 'company_name'
    },
    {
      headerName: 'department',
      field: 'department',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'department',
      headerTooltip: 'department'
    },
    {
      headerName: 'division',
      field: 'division',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'division',
      headerTooltip: 'division'
    },
    {
      headerName: 'last_login_attempt',
      field: 'last_login_attempt',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_login_attempt',
      headerTooltip: 'last_login_attempt'
    },
    {
      headerName: 'last_30_active',
      field: 'last_30_active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_30_active',
      headerTooltip: 'last_30_active'
    },
    {
      headerName: 'last_14_active',
      field: 'last_14_active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_14_active',
      headerTooltip: 'last_14_active'
    },
    {
      headerName: 'last_7_active',
      field: 'last_7_active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_7_active',
      headerTooltip: 'last_7_active'
    },
    {
      headerName: 'rfq_count_active',
      field: 'rfq_count_active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'rfq_count_active',
      headerTooltip: 'rfq_count_active'
    },
    {
      headerName: 'rfq_count_inactive',
      field: 'rfq_count_inactive',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'rfq_count_inactive',
      headerTooltip: 'rfq_count_inactive'
    },
    {
      headerName: 'total_rfq_count',
      field: 'total_rfq_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'total_rfq_count',
      headerTooltip: 'total_rfq_count'
    },
    {
      headerName: 'order_count_active',
      field: 'order_count_active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'order_count_active',
      headerTooltip: 'order_count_active'
    },
    {
      headerName: 'order_count_inactive',
      field: 'order_count_inactive',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'order_count_inactive',
      headerTooltip: 'order_count_inactive'
    },
    {
      headerName: 'total_order_count',
      field: 'total_order_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'total_order_count',
      headerTooltip: 'total_order_count'
    },
    {
      headerName: 'created_date',
      field: 'created_date',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'created_date'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
