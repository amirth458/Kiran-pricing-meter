import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-facility',
  templateUrl: './insight-facility.component.html',
  styleUrls: ['./insight-facility.component.css']
})
export class InsightFacilityComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Vendor Id',
      field: 'vendor_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_id',
      headerTooltip: 'Vendor Id'
    },
    {
      headerName: 'Company Name',
      field: 'vendor_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_name',
      headerTooltip: 'Company Name'
    },
    {
      headerName: 'Facilty ID',
      field: 'facility_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_id',
      headerTooltip: 'Facilty ID'
    },
    {
      headerName: 'Facility Name',
      field: 'facility_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_name',
      headerTooltip: 'Facility Name'
    },
    {
      headerName: 'Quoter First Name',
      field: 'quoter_first_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'quoter_first_name',
      headerTooltip: 'Quoter First Name'
    },
    {
      headerName: 'Quoter Last Name',
      field: 'quoter_last_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'quoter_last_name',
      headerTooltip: 'Quoter Last Name'
    },
    {
      headerName: 'Quoter Email',
      field: 'quoting_email',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'quoting_email',
      headerTooltip: 'Quoter Email'
    },
    {
      headerName: 'Facilty Address1',
      field: 'facility_address_1',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_address_1',
      headerTooltip: 'Facilty Address1'
    },
    {
      headerName: 'Facilty Address2',
      field: 'facility_address_2',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_address_2',
      headerTooltip: 'Facilty Address2'
    },
    {
      headerName: 'City',
      field: 'facility_city',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_city',
      headerTooltip: 'City'
    },
    {
      headerName: 'State',
      field: 'facility_state',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_state',
      headerTooltip: 'State'
    },
    {
      headerName: 'Postal',
      field: 'facility_postal',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_postal',
      headerTooltip: 'Postal'
    },
    {
      headerName: 'Country',
      field: 'facility_country',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_country',
      headerTooltip: 'Country'
    },
    {
      headerName: 'Facility Certs',
      field: 'facility_certs',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'facility_certs',
      headerTooltip: 'Facility Certs',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Part Certs',
      field: 'part_certs',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_certs',
      headerTooltip: 'Part Certs',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Equipment Count',
      field: 'equipment_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipment_count',
      headerTooltip: 'Equipment Count'
    },
    {
      headerName: 'Equipment offered',
      field: 'equipments',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipments',
      headerTooltip: 'Equipment offered',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Process Profile Count',
      field: 'process_profile_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'process_profile_count',
      headerTooltip: 'Process Profile Count'
    },
    {
      headerName: 'Pricing Profile Count',
      field: 'pricing_profile_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'pricing_profile_count',
      headerTooltip: 'Pricing Profile Count'
    },
    {
      headerName: 'Created Date',
      field: 'created_date',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'Created Date'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
