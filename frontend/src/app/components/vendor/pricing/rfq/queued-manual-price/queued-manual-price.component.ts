import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CurrencyPipe } from '@angular/common';
import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';

import { BehaviorSubject } from 'rxjs';

import { Part } from '../../../../../model/part.model';
import { FileViewRendererComponent } from '../../../../../common/file-view-renderer/file-view-renderer.component';
import { RfqPricingService } from '../../../../../service/rfq-pricing.service';

@Component({
  selector: 'app-queued-manual-price',
  templateUrl: './queued-manual-price.component.html',
  styleUrls: ['./queued-manual-price.component.css']
})
export class QueuedManualPriceComponent implements OnInit {
  tabs = [
    {
      id: 0,
      title: 'Queued for Manual Pricing'
    },
    {
      id: 1,
      title: 'Manually Priced'
    }
  ];
  selectedTabId$: BehaviorSubject<number> = new BehaviorSubject(0);
  selectedTabId: number;

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  columnDefs = [[], []];
  gridOptions: GridOptions;
  rowData = [[], []];
  pageSize = 10;

  constructor(
    private spinner: NgxSpinnerService,
    private pricingService: RfqPricingService,
    private router: Router,
    public currencyPipe: CurrencyPipe
  ) {}

  ngOnInit() {
    this.columnDefs = [
      [
        // {
        //   headerName: 'Customer',
        //   field: 'customer',
        //   tooltipField: 'customer',
        //   hide: false,
        //   sortable: true,
        //   filter: false
        // },
        {
          headerName: 'RFQ',
          field: 'rfq',
          tooltipField: 'rfq',
          hide: false,
          sortable: true,
          filter: false,
          cellClass: 'text-center'
        },
        {
          headerName: 'Part',
          field: 'part',
          tooltipField: 'part',
          hide: false,
          sortable: true,
          filter: false,
          cellClass: 'text-center'
        },
        {
          headerName: 'File Name',
          field: 'fileName',
          tooltipField: 'fileName',
          hide: false,
          sortable: true,
          filter: false,
          cellRenderer: 'fileViewRenderer'
        },
        {
          headerName: 'Quantity',
          field: 'quantity',
          tooltipField: 'quantity',
          hide: false,
          sortable: true,
          filter: false,
          cellClass: 'text-center'
        },
        {
          headerName: 'Material',
          field: 'materialPropertyValues',
          tooltipField: 'materialPropertyValues',
          hide: false,
          sortable: true,
          filter: false,
          valueFormatter: dt => (dt.value || []).join(' , ')
        },
        {
          headerName: 'Technology',
          field: 'equipmentPropertyValues',
          tooltipField: 'equipmentPropertyValues',
          hide: false,
          sortable: true,
          filter: false,
          valueFormatter: dt => (dt.value || []).join(' , ')
        }
        // {
        //   headerName: 'Roughness',
        //   field: 'roughness',
        //   tooltipField: 'roughness',
        //   hide: false,
        //   sortable: true,
        //   filter: false,
        //   cellClass: 'text-center'
        // },
        // {
        //   headerName: 'Post-Process',
        //   field: 'postProcess',
        //   tooltipField: 'postProcess',
        //   hide: false,
        //   sortable: true,
        //   filter: true,
        //   cellClass: 'text-center'
        // },
        // {
        //   headerName: 'Wait',
        //   field: 'wait',
        //   tooltipField: 'wait',
        //   hide: false,
        //   sortable: true,
        //   cellClass: 'text-center'
        // }
      ],
      [
        // {
        //   headerName: 'Customer',
        //   field: 'customer',
        //   tooltipField: 'customer',
        //   hide: false,
        //   sortable: true,
        //   filter: false
        // },
        {
          headerName: 'RFQ',
          field: 'rfq',
          tooltipField: 'rfq',
          hide: false,
          sortable: true,
          filter: false,
          cellClass: 'text-center'
        },
        {
          headerName: 'Part',
          field: 'part',
          tooltipField: 'part',
          hide: false,
          sortable: true,
          filter: false,
          cellClass: 'text-center'
        },
        {
          headerName: 'File Name',
          field: 'fileName',
          tooltipField: 'fileName',
          hide: false,
          sortable: true,
          filter: false,
          cellRenderer: 'fileViewRenderer'
        },
        {
          headerName: 'Material',
          field: 'materialPropertyValues',
          tooltipField: 'materialPropertyValues',
          hide: false,
          sortable: true,
          filter: false,
          valueFormatter: dt => (dt.value || []).join(' , ')
        },
        {
          headerName: 'Technology',
          field: 'equipmentPropertyValues',
          tooltipField: 'equipmentPropertyValues',
          hide: false,
          sortable: true,
          filter: false,
          cellClass: 'text-center',
          valueFormatter: dt => (dt.value || []).join(' , ')
        },
        // {
        //   headerName: 'Post-Process',
        //   field: 'postProcess',
        //   tooltipField: 'postProcess',
        //   hide: false,
        //   sortable: true,
        //   filter: true,
        //   cellClass: 'text-center'
        // },
        // {
        //   headerName: 'NDA',
        //   field: 'nda',
        //   tooltipField: 'nda',
        //   hide: false,
        //   sortable: true,
        //   filter: false,
        //   cellClass: 'text-center'
        // },
        {
          headerName: 'Manual Price',
          field: 'price',
          tooltipField: 'price',
          hide: false,
          sortable: true,
          cellClass: 'text-center'
        }
      ]
    ];
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs[0],
      pagination: true,
      paginationPageSize: this.pageSize,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        // this.onRowClick(event);
        this.router.navigateByUrl(this.router.url + '/' + event.data.id);
      }
    };
    this.selectedTabId$.subscribe(value => {
      this.selectedTabId = value;
      if (this.gridOptions.api) {
        this.gridOptions.api.setColumnDefs(this.columnDefs[value]);
        this.gridOptions.api.setRowData(this.rowData[value]);
        this.gridOptions.api.sizeColumnsToFit();
        this.setDefaultSort();
      }
    });
    this.getQueuedManualPricing();
    this.getManuallyPriced();
  }

  onGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
    this.setDefaultSort();
  }

  setDefaultSort() {
    this.gridOptions.api.setSortModel([
      {
        colId: 'rfq',
        sort: this.selectedTabId === 0 ? 'asc' : 'desc'
      }
    ]);
  }

  async getQueuedManualPricing(q = null) {
    this.spinner.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const res = await this.pricingService
          .getQueuedManualPricing({ page, size: 1000, sort: 'id,ASC', q })
          .toPromise();

        if (!res.content) {
          break;
        }

        rows.push(
          ...res.content.map((part: Part) => ({
            id: part.id,
            subOrder: part.id,
            customer: '',
            rfq: part.rfqMedia.projectRfqId,
            part: `${part.rfqMedia.projectRfqId}.${part.id}`,
            fileName: part.rfqMedia.media.name,
            quantity: part.quantity,
            materialPropertyValues: part.materialPropertyValues,
            equipmentPropertyValues: part.equipmentPropertyValues,
            roughness: '',
            postProcess: '',
            price: part.shippingCost ? `$ ${part.shippingCost}` : ''
          }))
        );

        if (res.content.length === 0 || res.content.length < 1000) {
          break;
        }
        page++;
      }
      this.rowData[0] = rows;
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  async getManuallyPriced(q = null) {
    this.spinner.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const res = await this.pricingService
          .getManuallyPriced({ page, size: 1000, sort: 'id,ASC', q })
          .toPromise();

        if (!res.content) {
          break;
        }

        rows.push(
          ...res.content.map((part: Part) => ({
            id: part.id,
            subOrder: part.id,
            rfq: part.rfqMedia.projectRfqId,
            part: part.rfqMedia.projectRfqId + '.' + part.id,
            fileName: part.rfqMedia.media.name,
            quantity: part.quantity,
            materialPropertyValues: part.materialPropertyValues,
            equipmentPropertyValues: part.equipmentPropertyValues,
            roughness: '',
            postProcess: ''
            // manualPrice:
            //   part.partQuoteList && part.partQuoteList.length > 0
            //     ? part.partQuoteList[0].totalCost
            //       ? `$ ${part.shippingCost}`
            //       : ''
            //     : ''
          }))
        );

        if (res.content.length === 0 || res.content.length < 1000) {
          break;
        }
        page++;
      }
      this.rowData[1] = rows;
      this.pricingService
        .getPartQuotes(rows.map(item => item.id))
        .subscribe(partQuotes => {
          partQuotes.forEach(partQuote => {
            const findIndex = this.rowData[1].findIndex(
              row => row.id === partQuote.partId
            );
            this.rowData[1][findIndex] = {
              ...this.rowData[1][findIndex],
              price: this.currencyPipe.transform(
                partQuote.totalCost,
                'USD',
                'symbol',
                '0.0-3'
              )
            };
          });
          this.rowData[1] = [...this.rowData[1]];
        });
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }

  onPageSizeChange(ev) {
    this.pageSize = ev.target.value;
    this.gridOptions.api.paginationSetPageSize(this.pageSize);
  }

}
