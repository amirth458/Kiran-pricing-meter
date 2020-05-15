import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-process-profile',
  templateUrl: './insight-process-profile.component.html',
  styleUrls: ['./insight-process-profile.component.css']
})
export class InsightProcessProfileComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'process_profile_id',
      field: 'process_profile_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'process_profile_id',
      headerTooltip: 'process_profile_id'
    },
    {
      headerName: 'equipment_ids',
      field: 'equipment_ids',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_ids',
      headerTooltip: 'equipment_ids',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'equipment_names',
      field: 'equipment_names',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_names',
      headerTooltip: 'equipment_names',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'material_ids',
      field: 'material_ids',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'material_ids',
      headerTooltip: 'material_ids',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'material_names',
      field: 'material_names',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'material_names',
      headerTooltip: 'material_names',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'parameter_nick_name',
      field: 'parameter_nick_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'parameter_nick_name',
      headerTooltip: 'parameter_nick_name'
    },
    {
      headerName: 'active',
      field: 'active',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'active',
      headerTooltip: 'active'
    },
    {
      headerName: 'created_by',
      field: 'created_by',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'created_by',
      headerTooltip: 'created_by'
    },
    {
      headerName: 'created_date',
      field: 'created_date',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'created_date',
      headerTooltip: 'created_date'
    },
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
      headerName: 'process_action',
      field: 'process_action',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'process_action',
      headerTooltip: 'process_action'
    },
    {
      headerName: 'process_type',
      field: 'process_type',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'process_type',
      headerTooltip: 'process_type'
    },
    {
      headerName: 'process_profile_type',
      field: 'process_profile_type',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'process_profile_type',
      headerTooltip: 'process_profile_type'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
