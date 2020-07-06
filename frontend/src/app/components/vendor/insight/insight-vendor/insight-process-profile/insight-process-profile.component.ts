import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-process-profile',
  templateUrl: './insight-process-profile.component.html',
  styleUrls: ['./insight-process-profile.component.css']
})
export class InsightProcessProfileComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Process Profile No',
      field: 'process_profile_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'process_profile_id',
      headerTooltip: 'process_profile_id'
    },
    {
      headerName: 'Equipment Numbers',
      field: 'equipment_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipment_ids',
      headerTooltip: 'equipment_ids',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Equipment Names',
      field: 'equipment_names',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipment_names',
      headerTooltip: 'equipment_names',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Material Numbers',
      field: 'material_ids',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'material_ids',
      headerTooltip: 'material_ids',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Material Names',
      field: 'material_names',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'material_names',
      headerTooltip: 'material_names',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Parameter Set Nickname',
      field: 'parameter_nick_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'parameter_nick_name',
      headerTooltip: 'parameter_nick_name'
    },
    {
      headerName: 'Active',
      field: 'active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'active',
      headerTooltip: 'active'
    },
    {
      headerName: 'Vendor Lookup',
      field: 'created_by',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'created_by',
      headerTooltip: 'created_by'
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
      headerName: 'Vendor Number',
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
      headerName: 'Process Action',
      field: 'process_action',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'process_action',
      headerTooltip: 'process_action'
    },
    {
      headerName: 'Process Type',
      field: 'process_type',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'process_type',
      headerTooltip: 'process_type'
    },
    {
      headerName: 'Process Profile Type',
      field: 'process_profile_type',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'process_profile_type',
      headerTooltip: 'process_profile_type'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
