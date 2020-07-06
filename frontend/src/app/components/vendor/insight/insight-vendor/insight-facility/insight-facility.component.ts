import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-facility',
  templateUrl: './insight-facility.component.html',
  styleUrls: ['./insight-facility.component.css']
})
export class InsightFacilityComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'SS Vendor ID',
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
      headerName: 'Facility Number',
      field: 'facility_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_id',
      headerTooltip: 'facility_id'
    },
    {
      headerName: 'Facility Name',
      field: 'facility_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_name',
      headerTooltip: 'facility_name'
    },
    {
      headerName: 'Quoter First Name',
      field: 'quoter_first_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'quoter_first_name',
      headerTooltip: 'quoter_first_name'
    },
    {
      headerName: 'Quoter Last Name',
      field: 'quoter_last_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'quoter_last_name',
      headerTooltip: 'quoter_last_name'
    },
    {
      headerName: 'Email',
      field: 'quoting_email',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'quoting_email',
      headerTooltip: 'quoting_email'
    },
    {
      headerName: 'Address 1',
      field: 'facility_address_1',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_address_1',
      headerTooltip: 'facility_address_1'
    },
    {
      headerName: 'Address 2',
      field: 'facility_address_2',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_address_2',
      headerTooltip: 'facility_address_2'
    },
    {
      headerName: 'City',
      field: 'facility_city',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_city',
      headerTooltip: 'facility_city'
    },
    {
      headerName: 'State',
      field: 'facility_state',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_state',
      headerTooltip: 'facility_state'
    },
    {
      headerName: 'Postal',
      field: 'facility_postal',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_postal',
      headerTooltip: 'facility_postal'
    },
    {
      headerName: 'Country',
      field: 'facility_country',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_country',
      headerTooltip: 'facility_country'
    },
    {
      headerName: 'Facility Certs',
      field: 'facility_certs',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_certs',
      headerTooltip: 'facility_certs',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Part Certs',
      field: 'part_certs',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_certs',
      headerTooltip: 'part_certs',
      valueFormatter: v => v && v.value && v.value.join(',')
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
      headerName: 'List of Materials',
      field: 'material',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'material',
      headerTooltip: 'material',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Equipment Count',
      field: 'equipment_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipment_count',
      headerTooltip: 'equipment_count'
    },
    {
      headerName: 'List of Equipment',
      field: 'equipments',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipments',
      headerTooltip: 'equipments',
      valueFormatter: v => v && v.value && v.value.join(',')
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
      headerName: 'Created Date/Time',
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
