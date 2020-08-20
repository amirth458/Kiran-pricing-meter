import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-vendors',
  templateUrl: './insight-vendors.component.html',
  styleUrls: ['./insight-vendors.component.css']
})
export class InsightVendorsComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'SS User ID',
      field: 'vendor_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_id',
      headerTooltip: 'vendor_id'
    },
    {
      headerName: 'Contact Full Name',
      field: 'company_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'company_name',
      headerTooltip: 'company_name'
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
      headerName: 'NDA',
      field: 'nda',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'nda',
      headerTooltip: 'nda'
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
      headerName: 'Street',
      field: 'address_1',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'address_1',
      headerTooltip: 'address_1'
    },
    {
      headerName: 'Street 2',
      field: 'address_2',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'address_2',
      headerTooltip: 'address_2'
    },
    {
      headerName: 'City',
      field: 'city',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'city',
      headerTooltip: 'city'
    },
    {
      headerName: 'State',
      field: 'state',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'state',
      headerTooltip: 'state'
    },
    {
      headerName: 'Postal',
      field: 'postal',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'postal',
      headerTooltip: 'postal'
    },
    {
      headerName: 'Country',
      field: 'country',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'country',
      headerTooltip: 'country'
    },
    {
      headerName: 'Facility Count',
      field: 'facility_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_count',
      headerTooltip: 'facility_count'
    },
    {
      headerName: 'Machine Count',
      field: 'equipment_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipment_count',
      headerTooltip: 'equipment_count'
    },
    {
      headerName: 'Material Count',
      field: 'material_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'material_count',
      headerTooltip: 'material_count'
    },
    {
      headerName: 'Process Profile Count',
      field: 'process_profile_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'process_profile_count',
      headerTooltip: 'process_profile_count'
    },
    {
      headerName: 'Pricing Profile Count',
      field: 'pricing_profile_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'pricing_profile_count',
      headerTooltip: 'pricing_profile_count'
    },
    {
      headerName: 'Subscription Type',
      field: 'subscription_type',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'subscription_type',
      headerTooltip: 'subscription_type'
    },
    {
      headerName: 'Pre-Quote Request Count',
      field: 'prequote_request_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'prequote_request_count',
      headerTooltip: 'prequote_request_count'
    },
    {
      headerName: 'Create Date/Time',
      field: 'created_date',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'created_date'
    },
    {
      headerName: 'Last Login Time',
      field: 'last_login',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'last_login',
      headerTooltip: 'last_login'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
