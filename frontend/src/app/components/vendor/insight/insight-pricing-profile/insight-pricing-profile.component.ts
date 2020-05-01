import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-pricing-profile',
  templateUrl: './insight-pricing-profile.component.html',
  styleUrls: ['./insight-pricing-profile.component.css']
})
export class InsightPricingProfileComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Profile ID',
      field: 'process_pricing_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'process_pricing_id',
      headerTooltip: 'Profile ID'
    },
    {
      headerName: 'Pricing Profile Name',
      field: 'pricing_profile_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'pricing_profile_name',
      headerTooltip: 'Pricing Profile Name'
    },
    {
      headerName: 'Pricing Condition 1',
      field: 'pricing_condition',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'pricing_condition',
      headerTooltip: 'Pricing Condition 1',
      valueFormatter: v => this.getPricingCondition(v.value)
    },
    {
      headerName: 'Process Profile ID',
      field: 'process_profile_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'process_profile_id',
      headerTooltip: 'Process Profile ID'
    },
    {
      headerName: 'Process Profile Name',
      field: 'process_profile_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'process_profile_name',
      headerTooltip: 'Process Profile Name'
    },
    {
      headerName: 'Parameter Name',
      field: 'parameter_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'parameter_name',
      headerTooltip: 'Parameter Name'
    },
    {
      headerName: 'Active',
      field: 'active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'active',
      headerTooltip: 'Active'
    },
    {
      headerName: 'Shopsight Company Name',
      field: 'vendor_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'vendor_name',
      headerTooltip: 'Shopsight Company Name'
    },
    {
      headerName: 'Created By',
      field: 'created_by',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'created_by',
      headerTooltip: 'Created By'
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
