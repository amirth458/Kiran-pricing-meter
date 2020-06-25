import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-vendors',
  templateUrl: './insight-vendors.component.html',
  styleUrls: ['./insight-vendors.component.css']
})
export class InsightVendorsComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'vendor_id',
      field: 'vendor_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_id',
      headerTooltip: 'vendor_id'
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
      headerName: 'address_1',
      field: 'address_1',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'address_1',
      headerTooltip: 'address_1'
    },
    {
      headerName: 'address_2',
      field: 'address_2',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'address_2',
      headerTooltip: 'address_2'
    },
    {
      headerName: 'city',
      field: 'city',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'city',
      headerTooltip: 'city'
    },
    {
      headerName: 'state',
      field: 'state',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'state',
      headerTooltip: 'state'
    },
    {
      headerName: 'postal',
      field: 'postal',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'postal',
      headerTooltip: 'postal'
    },
    {
      headerName: 'country',
      field: 'country',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'country',
      headerTooltip: 'country'
    },
    {
      headerName: 'facility_count',
      field: 'facility_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_count',
      headerTooltip: 'facility_count'
    },
    {
      headerName: 'equipment_count',
      field: 'equipment_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipment_count',
      headerTooltip: 'equipment_count'
    },
    {
      headerName: 'material_count',
      field: 'material_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'material_count',
      headerTooltip: 'material_count'
    },
    {
      headerName: 'process_profile_count',
      field: 'process_profile_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'process_profile_count',
      headerTooltip: 'process_profile_count'
    },
    {
      headerName: 'pricing_profile_count',
      field: 'pricing_profile_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'pricing_profile_count',
      headerTooltip: 'pricing_profile_count'
    },
    {
      headerName: 'prequote_request_count',
      field: 'prequote_request_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'prequote_request_count',
      headerTooltip: 'prequote_request_count'
    },
    {
      headerName: 'created_date',
      field: 'created_date',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'created_date'
    },
    {
      headerName: 'last_login',
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
