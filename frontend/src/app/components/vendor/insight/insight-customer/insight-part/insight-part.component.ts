import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { PartService } from 'src/app/service/part.service';

@Component({
  selector: 'app-insight-part',
  templateUrl: './insight-part.component.html',
  styleUrls: ['./insight-part.component.css']
})
export class InsightPartComponent implements OnInit {
  columnDefs = [
    {
      headerName: 'Part Number',
      field: 'part_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_id',
      headerTooltip: 'part_id',
      cellRenderer: 'linkCellRenderer',
      cellRendererParams: {
        action: param => {
          this.onRowClick(param);
        }
      }
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
      headerName: 'Order ID',
      field: 'customer_order_id',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_order_id',
      headerTooltip: 'customer_order_id'
    },
    {
      headerName: 'File Name',
      field: 'file_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'file_name',
      headerTooltip: 'file_name'
    },
    {
      headerName: 'Part Status',
      field: 'part_status',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_status',
      headerTooltip: 'part_status'
    },
    {
      headerName: 'Part Type',
      field: 'part_type',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_type',
      headerTooltip: 'part_type'
    },
    {
      headerName: 'Payment Status',
      field: 'payment_status',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'payment_status',
      headerTooltip: 'payment_status'
    },
    {
      headerName: 'Part Quote Price',
      field: 'part_quote_price',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'part_quote_price',
      headerTooltip: 'part_quote_price'
    },
    {
      headerName: 'Account Name',
      field: 'customer_name',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_name',
      headerTooltip: 'customer_name'
    },
    {
      headerName: 'Contact Email',
      field: 'customer_email',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'customer_email',
      headerTooltip: 'customer_email'
    },
    {
      headerName: 'Quantity',
      field: 'quantity',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'quantity',
      headerTooltip: 'quantity'
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
      headerName: 'Requested Materials',
      field: 'material',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'material',
      headerTooltip: 'material',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Tech Count',
      field: 'equipment_count',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'equipment_count',
      headerTooltip: 'equipment_count'
    },
    {
      headerName: 'Requested Tech',
      field: 'technology',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'technology',
      headerTooltip: 'technology',
      valueFormatter: v => v && v.value && v.value.join(',')
    },
    {
      headerName: 'Post Process',
      field: 'post_process',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'post_process',
      headerTooltip: 'post_process'
    },
    {
      headerName: 'Target Delivery Date',
      field: 'target_delivery_date',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'target_delivery_date',
      headerTooltip: 'target_delivery_date'
    },
    {
      headerName: 'Shipping Address',
      field: 'shipping_address',
      hide: false,
      sortable: false,
      filter: false,
      tooltipField: 'shipping_address',
      headerTooltip: 'shipping_address'
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

  parts = null;

  constructor(protected spinner: NgxSpinnerService, public partService: PartService) {}

  ngOnInit() {}

  onRowClick(ev) {
    this.spinner.show();
    this.partService.getPartsByRfqId(ev.data.rfq_id).subscribe(
      res => {
        this.parts = res.filter(part => part.id == ev.data.part_id);
        if (this.parts.length === 0) {
          this.parts = null;
        }
        this.spinner.hide();
      },
      err => {
        this.spinner.hide();
        console.log(err);
      }
    );
  }

  onClose() {
    this.parts = null;
  }
}
