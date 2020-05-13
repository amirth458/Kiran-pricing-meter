import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-customers',
  templateUrl: './insight-customers.component.html',
  styleUrls: ['./insight-customers.component.css']
})
export class InsightCustomersComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'User ID',
      field: 'user_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'user_id',
      headerTooltip: 'User ID'
    },
    {
      headerName: 'First Name',
      field: 'first_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'first_name',
      headerTooltip: 'First Name'
    },
    {
      headerName: 'Last Name',
      field: 'last_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'last_name',
      headerTooltip: 'Last Name'
    },
    {
      headerName: 'Email',
      field: 'email',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'email',
      headerTooltip: 'Email'
    },
    {
      headerName: 'Phone',
      field: 'phone_no',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'phone_no',
      headerTooltip: 'Phone'
    },
    {
      headerName: 'Company Name',
      field: 'company_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'company_name',
      headerTooltip: 'Company Name'
    },
    {
      headerName: 'Department',
      field: 'department',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'department',
      headerTooltip: 'Department'
    },
    {
      headerName: 'Last Login Attempt',
      field: 'last_login_attempt',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'last_login_attempt',
      headerTooltip: 'Last Login Attempt'
    },
    {
      headerName: 'Last 30 Active',
      field: 'last_30_active',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'last_30_active',
      headerTooltip: 'Last 30 Active'
    },
    {
      headerName: 'Last 14 Active',
      field: 'last_14_active',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'last_14_active',
      headerTooltip: 'Last 14 Active'
    },
    {
      headerName: 'Last 7 Active',
      field: 'last_7_active',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'last_7_active',
      headerTooltip: 'Last 7 Active'
    },
    {
      headerName: 'RFQ Count Active',
      field: 'rfq_count_active',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_count_active',
      headerTooltip: 'RFQ Count Active'
    },
    {
      headerName: 'RFQ Count Inactive',
      field: 'rfq_count_inactive',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_count_inactive',
      headerTooltip: 'RFQ Count Inactive'
    },
    {
      headerName: 'Total RFQ Count',
      field: 'total_rfq_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'total_rfq_count',
      headerTooltip: 'Total RFQ Count'
    },
    {
      headerName: 'Order Count Active',
      field: 'order_count_active',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'order_count_active',
      headerTooltip: 'Order Count Active'
    },
    {
      headerName: 'Order Count Inactive',
      field: 'order_count_inactive',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'order_count_inactive',
      headerTooltip: 'Order Count Inactive'
    },
    {
      headerName: 'Total Order Count',
      field: 'total_order_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'total_order_count',
      headerTooltip: 'Total Order Count'
    },
    {
      headerName: 'Created Date',
      field: 'created_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'Created Date'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
