import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-pricing-profile',
  templateUrl: './insight-pricing-profile.component.html',
  styleUrls: ['./insight-pricing-profile.component.css']
})
export class InsightPricingProfileComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Pricing Profile No',
      field: 'process_pricing_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'process_pricing_id',
      headerTooltip: 'process_pricing_id'
    },
    {
      headerName: 'Pricing Profile Name',
      field: 'pricing_profile_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'pricing_profile_name',
      headerTooltip: 'pricing_profile_name'
    },
    {
      headerName: 'Pricing Condition',
      field: 'pricing_condition',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'pricing_condition',
      headerTooltip: 'pricing_condition',
      valueFormatter: v => this.getPricingCondition(v.value)
    },
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
      headerName: 'Process Profile Name',
      field: 'process_profile_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'process_profile_name',
      headerTooltip: 'process_profile_name'
    },
    {
      headerName: 'Parameter Set Name',
      field: 'parameter_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'parameter_name',
      headerTooltip: 'parameter_name'
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
      headerName: 'Shopsight Company Name',
      field: 'vendor_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_name',
      headerTooltip: 'vendor_name'
    },
    {
      headerName: 'Created By',
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
    }
  ];
  constructor() {}

  ngOnInit() {}

  getPricingCondition(value) {
    return value
      ? value
          .map(
            v =>
              `${v.process_pricng_condition_type} ${v.operator_type_symbol} ${v.process_pricng_condition_value} ${v.measurement_unit_type_symbol}`
          )
          .join(',')
      : '';
  }
}
