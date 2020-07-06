import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-insight-quote',
  templateUrl: './insight-quote.component.html',
  styleUrls: ['./insight-quote.component.css']
})
export class InsightQuoteComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Part Quote Name',
      field: 'quote_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'quote_name',
      headerTooltip: 'quote_name'
    },
    {
      headerName: 'Part Quote No',
      field: 'part_quote_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_quote_id',
      headerTooltip: 'part_quote_id'
    },
    {
      headerName: 'Part ID',
      field: 'part_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_id',
      headerTooltip: 'part_id'
    },
    {
      headerName: 'RFQ ID',
      field: 'rfq_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'rfq_id',
      headerTooltip: 'rfq_id'
    },
    {
      headerName: 'Quoted Price',
      field: 'total_cost',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'total_cost',
      headerTooltip: 'total_cost'
    },
    {
      headerName: 'Material Options',
      field: 'material_property_values',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'material_property_values',
      headerTooltip: 'material_property_values',
      valueFormatter: v => v.value && v.value.join(', ')
    },
    {
      headerName: 'Equipment Options',
      field: 'equipment_property_values',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipment_property_values',
      headerTooltip: 'equipment_property_values',
      valueFormatter: v => v.value && v.value.join(', ')
    },
    {
      headerName: 'RFQ Submit Time',
      field: 'rfq_time',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'rfq_time',
      headerTooltip: 'rfq_time'
    },
    {
      headerName: 'Quote Issued Time',
      field: 'quote_time',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'quote_time',
      headerTooltip: 'quote_time'
    },
    {
      headerName: 'RFQ-Quote Time',
      field: 'rfq_quote_time',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'rfq_quote_time',
      headerTooltip: 'rfq_quote_time'
    },
    {
      headerName: 'Part Quote Status',
      field: 'part_quote_status',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_quote_status',
      headerTooltip: 'part_quote_status'
    },
    {
      headerName: 'Manually Priced',
      field: 'is_manual_pricing',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'is_manual_pricing',
      headerTooltip: 'is_manual_pricing'
    },
    {
      headerName: 'Expiration Time',
      field: 'expired_at',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'expired_at',
      headerTooltip: 'expired_at'
    },
    {
      headerName: 'Active',
      field: 'active',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'active',
      headerTooltip: 'active'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
