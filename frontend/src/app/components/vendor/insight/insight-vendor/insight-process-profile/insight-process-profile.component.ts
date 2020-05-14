import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-process-profile',
  templateUrl: './insight-process-profile.component.html',
  styleUrls: ['./insight-process-profile.component.css']
})
export class InsightProcessProfileComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Process Profile ID',
      field: 'process_profile_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'process_profile_id',
      headerTooltip: 'Process Profile ID'
    },
    {
      headerName: 'Tech ID',
      field: 'equipment_ids',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_ids',
      headerTooltip: 'Tech ID',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Tech Name',
      field: 'equipment_names',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_names',
      headerTooltip: 'Tech Name',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Material ID',
      field: 'material_ids',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'material_ids',
      headerTooltip: 'Material ID',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Material Name',
      field: 'material_names',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'material_names',
      headerTooltip: 'Material Name',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Parameter Set Nickname',
      field: 'paramter_nick_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'paramter_nick_name',
      headerTooltip: 'Parameter Set Nickname'
    },
    {
      headerName: 'Active',
      field: 'active',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'active',
      headerTooltip: 'Active'
    },
    {
      headerName: 'Created By',
      field: 'created_by',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'created_by',
      headerTooltip: 'Created By'
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
      headerName: 'Vendor ID',
      field: 'vendor_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_id',
      headerTooltip: 'Vendor ID'
    },
    {
      headerName: 'Vendor Name',
      field: 'vendor_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'vendor_name',
      headerTooltip: 'Vendor Name'
    },
    {
      headerName: 'Process Action',
      field: 'process_action',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'process_action',
      headerTooltip: 'Process Action'
    },
    {
      headerName: 'Process Type',
      field: 'process_type',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'process_type',
      headerTooltip: 'Process Type'
    },
    {
      headerName: 'Process Profile Type',
      field: 'process_profile_type',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'process_profile_type',
      headerTooltip: 'Process Profile Type'
    }
  ];
  constructor() {}

  ngOnInit() {}
}
