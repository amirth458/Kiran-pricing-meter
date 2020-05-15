import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-insight-quote',
  templateUrl: './insight-quote.component.html',
  styleUrls: ['./insight-quote.component.css']
})
export class InsightQuoteComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'quote_name',
      field: 'quote_name',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'quote_name',
      headerTooltip: 'quote_name'
    },
    {
      headerName: 'part_quote_id',
      field: 'part_quote_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_quote_id',
      headerTooltip: 'part_quote_id'
    },
    {
      headerName: 'part_id',
      field: 'part_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_id',
      headerTooltip: 'part_id'
    },
    {
      headerName: 'rfq_id',
      field: 'rfq_id',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_id',
      headerTooltip: 'rfq_id'
    },
    {
      headerName: 'total_cost',
      field: 'total_cost',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'total_cost',
      headerTooltip: 'total_cost'
    },
    {
      headerName: 'material_property_values',
      field: 'material_property_values',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'material_property_values',
      headerTooltip: 'material_property_values',
      valueFormatter: v => v.value && v.value.join(', ')
    },
    {
      headerName: 'equipment_property_values',
      field: 'equipment_property_values',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'equipment_property_values',
      headerTooltip: 'equipment_property_values',
      valueFormatter: v => v.value && v.value.join(', ')
    },
    {
      headerName: 'rfq_time',
      field: 'rfq_time',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_time',
      headerTooltip: 'rfq_time'
    },
    {
      headerName: 'quote_time',
      field: 'quote_time',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'quote_time',
      headerTooltip: 'quote_time'
    },
    {
      headerName: 'rfq_quote_time',
      field: 'rfq_quote_time',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'rfq_quote_time',
      headerTooltip: 'rfq_quote_time'
    },
    {
      headerName: 'part_quote_status',
      field: 'part_quote_status',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'part_quote_status',
      headerTooltip: 'part_quote_status'
    },
    {
      headerName: 'is_manual_pricing',
      field: 'is_manual_pricing',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'is_manual_pricing',
      headerTooltip: 'is_manual_pricing'
    },
    {
      headerName: 'expired_at',
      field: 'expired_at',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'expired_at',
      headerTooltip: 'expired_at'
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
      headerName: 'total_row_count',
      field: 'total_row_count',
      hide: false,
      sortable: true,
      filter: false,
      tooltipField: 'total_row_count',
      headerTooltip: 'total_row_count'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
