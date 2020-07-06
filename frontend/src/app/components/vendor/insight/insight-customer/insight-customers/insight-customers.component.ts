import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-customers',
  templateUrl: './insight-customers.component.html',
  styleUrls: ['./insight-customers.component.css']
})
export class InsightCustomersComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Vulcury ID',
      field: 'user_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'user_id',
      headerTooltip: 'user_id'
    },
    {
      headerName: 'PE User ID',
      field: 'customer_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_id',
      headerTooltip: 'customer_id'
    },
    {
      headerName: 'First Name',
      field: 'first_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'first_name',
      headerTooltip: 'first_name'
    },
    {
      headerName: 'Last Name',
      field: 'last_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_name',
      headerTooltip: 'last_name'
    },
    {
      headerName: 'Email',
      field: 'email',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'email',
      headerTooltip: 'email'
    },
    {
      headerName: 'Phone',
      field: 'phone_no',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'phone_no',
      headerTooltip: 'phone_no'
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'company_name',
      headerTooltip: 'company_name'
    },
    {
      headerName: 'Department',
      field: 'department',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'department',
      headerTooltip: 'department'
    },
    {
      headerName: 'Division',
      field: 'division',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'division',
      headerTooltip: 'division'
    },
    {
      headerName: 'Last Login Time',
      field: 'last_login_attempt',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_login_attempt',
      headerTooltip: 'last_login_attempt'
    },
    {
      headerName: 'Last 30 Active',
      field: 'last_30_active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_30_active',
      headerTooltip: 'last_30_active'
    },
    {
      headerName: 'Last 14 Active',
      field: 'last_14_active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_14_active',
      headerTooltip: 'last_14_active'
    },
    {
      headerName: 'Last 7 Active',
      field: 'last_7_active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_7_active',
      headerTooltip: 'last_7_active'
    },
    {
      headerName: 'Active RFQs',
      field: 'rfq_count_active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'rfq_count_active',
      headerTooltip: 'rfq_count_active'
    },
    {
      headerName: 'Completed RFQs',
      field: 'rfq_count_inactive',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'rfq_count_inactive',
      headerTooltip: 'rfq_count_inactive'
    },
    {
      headerName: 'No of RFQs',
      field: 'total_rfq_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'total_rfq_count',
      headerTooltip: 'total_rfq_count'
    },
    {
      headerName: 'Active Orders',
      field: 'order_count_active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'order_count_active',
      headerTooltip: 'order_count_active'
    },
    {
      headerName: 'Completed Orders',
      field: 'order_count_inactive',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'order_count_inactive',
      headerTooltip: 'order_count_inactive'
    },
    {
      headerName: 'No of Orders',
      field: 'total_order_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'total_order_count',
      headerTooltip: 'total_order_count'
    },
    {
      headerName: 'Created',
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
