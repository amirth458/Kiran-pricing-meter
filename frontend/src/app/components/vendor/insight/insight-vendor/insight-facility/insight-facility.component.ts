import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-facility',
  templateUrl: './insight-facility.component.html',
  styleUrls: ['./insight-facility.component.css']
})
export class InsightFacilityComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'vendor_id',
      field: 'vendor_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_id',
      headerTooltip: 'vendor_id'
    },
    {
      headerName: 'vendor_name',
      field: 'vendor_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_name',
      headerTooltip: 'vendor_name'
    },
    {
      headerName: 'facility_id',
      field: 'facility_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'facility_id',
      headerTooltip: 'facility_id'
    },
    {
      headerName: 'facility_name',
      field: 'facility_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'facility_name',
      headerTooltip: 'facility_name'
    },
    {
      headerName: 'quoter_first_name',
      field: 'quoter_first_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'quoter_first_name',
      headerTooltip: 'quoter_first_name'
    },
    {
      headerName: 'quoter_last_name',
      field: 'quoter_last_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'quoter_last_name',
      headerTooltip: 'quoter_last_name'
    },
    {
      headerName: 'quoting_email',
      field: 'quoting_email',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'quoting_email',
      headerTooltip: 'quoting_email'
    },
    {
      headerName: 'facility_address_1',
      field: 'facility_address_1',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'facility_address_1',
      headerTooltip: 'facility_address_1'
    },
    {
      headerName: 'facility_address_2',
      field: 'facility_address_2',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'facility_address_2',
      headerTooltip: 'facility_address_2'
    },
    {
      headerName: 'facility_city',
      field: 'facility_city',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'facility_city',
      headerTooltip: 'facility_city'
    },
    {
      headerName: 'facility_state',
      field: 'facility_state',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'facility_state',
      headerTooltip: 'facility_state'
    },
    {
      headerName: 'facility_postal',
      field: 'facility_postal',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'facility_postal',
      headerTooltip: 'facility_postal'
    },
    {
      headerName: 'facility_country',
      field: 'facility_country',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'facility_country',
      headerTooltip: 'facility_country'
    },
    {
      headerName: 'facility_certs',
      field: 'facility_certs',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'facility_certs',
      headerTooltip: 'facility_certs',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'part_certs',
      field: 'part_certs',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_certs',
      headerTooltip: 'part_certs',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'equipment_count',
      field: 'equipment_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_count',
      headerTooltip: 'equipment_count'
    },
    {
      headerName: 'equipments',
      field: 'equipments',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipments',
      headerTooltip: 'equipments',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'process_profile_count',
      field: 'process_profile_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'process_profile_count',
      headerTooltip: 'process_profile_count'
    },
    {
      headerName: 'pricing_profile_count',
      field: 'pricing_profile_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'pricing_profile_count',
      headerTooltip: 'pricing_profile_count'
    },
    {
      headerName: 'created_date',
      field: 'created_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'created_date'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
