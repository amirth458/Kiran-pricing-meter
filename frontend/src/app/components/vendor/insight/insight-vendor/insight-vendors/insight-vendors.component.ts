import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-vendors',
  templateUrl: './insight-vendors.component.html',
  styleUrls: ['./insight-vendors.component.css']
})
export class InsightVendorsComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Vendor ID',
      field: 'vendor_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_id',
      headerTooltip: 'Vendor ID'
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
      headerName: 'Address1',
      field: 'address_1',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'address_1',
      headerTooltip: 'Address1'
    },
    {
      headerName: 'Address2',
      field: 'address_2',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'address_2',
      headerTooltip: 'Address2'
    },
    {
      headerName: 'City',
      field: 'city',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'city',
      headerTooltip: 'City'
    },
    {
      headerName: 'State',
      field: 'state',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'state',
      headerTooltip: 'State'
    },
    {
      headerName: 'Postal',
      field: 'postal',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'postal',
      headerTooltip: 'Postal'
    },
    {
      headerName: 'Country',
      field: 'country',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'country',
      headerTooltip: 'Country'
    },
    {
      headerName: 'Facility Count',
      field: 'facility_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'facility_count',
      headerTooltip: 'Facility Count'
    },
    {
      headerName: 'Machine Count',
      field: 'equipment_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_count',
      headerTooltip: 'Machine Count'
    },
    {
      headerName: 'Material Count',
      field: 'material_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'material_count',
      headerTooltip: 'Material Count'
    },
    {
      headerName: 'Process Profiles Count',
      field: 'process_profile_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'process_profile_count',
      headerTooltip: 'Process Profiles Count'
    },
    {
      headerName: 'Pricing Profiles Count',
      field: 'pricing_profile_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'pricing_profile_count',
      headerTooltip: 'Pricing Profiles Count'
    },
    {
      headerName: 'Prequote Request Count',
      field: 'prequote_request_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'prequote_request_count',
      headerTooltip: 'Prequote Request CountD'
    },
    {
      headerName: 'Created Date',
      field: 'created_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'Created Date'
    },
    {
      headerName: 'Last login',
      field: 'last_login',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'last_login',
      headerTooltip: 'Last  login'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
