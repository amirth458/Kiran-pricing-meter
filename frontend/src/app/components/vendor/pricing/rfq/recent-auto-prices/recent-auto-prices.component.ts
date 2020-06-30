import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';

import { CustomerService } from './../../../../../service/customer.service';
import { FileViewRendererComponent } from './../../../../../common/file-view-renderer/file-view-renderer.component';
import { RfqPricingService } from './../../../../../service/rfq-pricing.service';
import { Pageable } from './../../../../../model/pageable.model';
import { Part, AppPartStatus } from './../../../../../model/part.model';
import { ToastrService } from 'ngx-toastr';
import { PartService } from 'src/app/service/part.service';

@Component({
  selector: 'app-recent-auto-prices',
  templateUrl: './recent-auto-prices.component.html',
  styleUrls: ['./recent-auto-prices.component.css']
})
export class RecentAutoPricesComponent implements OnInit {
  autoQuotedIds = [];
  columnDefs = [];
  gridOptions: GridOptions;
  rowData: any[] = [];
  pageSize = 10;
  navigation;

  frameworkComponents = {
    fileViewRenderer: FileViewRendererComponent
  };

  constructor(
    public spinner: NgxSpinnerService,
    public pricingService: RfqPricingService,
    public router: Router,
    public customerService: CustomerService,
    public currencyPipe: CurrencyPipe,
    public toast: ToastrService,
    public partService: PartService
  ) {}

  ngOnInit() {
    this.columnDefs = [
      {
        headerName: 'Customer',
        field: 'customerName',
        tooltipField: 'customerName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'RFQ',
        field: 'rfq',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'rfq'
      },
      {
        headerName: 'Part',
        field: 'part',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'part'
      },
      {
        headerName: 'File Name',
        field: 'fileName',
        hide: false,
        sortable: true,
        filter: false,
        cellRenderer: 'fileViewRenderer',
        tooltipField: 'fileName'
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        hide: false,
        sortable: true,
        filter: false,
        tooltipField: 'quantity'
      },
      {
        headerName: 'Material',
        field: 'materialPropertyValues',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(' , '),
        tooltipField: 'materialPropertyValues'
      },
      {
        headerName: 'Technology',
        field: 'equipmentPropertyValues',
        hide: false,
        sortable: true,
        filter: false,
        valueFormatter: dt => (dt.value || []).join(' , '),
        tooltipField: 'equipmentPropertyValues'
      },
      // {
      //   headerName: 'Roughness',
      //   field: 'roughness',
      //   hide: false,
      //   sortable: true,
      //   filter: false,
      //   tooltipField: 'roughness',
      // },
      // {
      //   headerName: 'Post-Process',
      //   field: 'postProcess',
      //   hide: false,
      //   sortable: true,
      //   filter: true,
      //   tooltipField: 'postProcess',
      // },
      {
        headerName: 'Price',
        field: 'price',
        hide: false,
        sortable: true,
        tooltipField: 'price'
      }
    ];

    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => {
        this.router.navigateByUrl(`${this.router.url}/${event.data.id}`);
      }
    };

    this.partService.getPartStatusType().subscribe(
      res => {
        res.map(item => {
          if (item.name === AppPartStatus.AUTO_QUOTED) {
            this.autoQuotedIds.push(item.id);
          }
        });
        this.getRows();
      },
      err => {
        console.log({ err });
        this.toast.error('Error occured while fetching part status');
      }
    );
  }

  async getRows(q = null) {
    this.spinner.show();
    let page = 0;
    const rows = [];
    try {
      while (true) {
        const res: Pageable<Part> = await this.pricingService
          .getRecentAutoPrices(
            {
              page,
              size: 1000,
              sort: 'id,ASC',
              q
            },
            this.autoQuotedIds
          )
          .toPromise();

        if (!res.content) {
          break;
        }

        rows.push(
          ...res.content.map((part: Part) => ({
            id: part.id,
            customerName: part.customerName,
            subOrder: part.id,
            rfq: part.rfqMedia.projectRfqId,
            part: `${part.rfqMedia.projectRfqId}.${part.id}`,
            fileName: part.rfqMedia.media.name,
            quantity: part.quantity,
            materialPropertyValues: part.materialPropertyValues,
            equipmentPropertyValues: part.equipmentPropertyValues
          }))
        );

        if (res.content.length === 0 || res.content.length < 1000) {
          break;
        }
        page++;
      }
      this.rowData = rows;

      this.pricingService.getPartQuotes(rows.map(item => item.id)).subscribe(partQuotes => {
        partQuotes.forEach(partQuote => {
          const findIndex = this.rowData.findIndex(row => row.id === partQuote.partId);
          this.rowData[findIndex] = {
            ...this.rowData[findIndex],
            price: this.currencyPipe.transform(partQuote.totalCost, 'USD', 'symbol', '0.0-3')
          };
        });
        this.rowData = [...this.rowData];
      });
    } catch (e) {
      console.log(e);
    } finally {
      this.spinner.hide();
    }
  }
  onGridReady(ev) {
    this.gridOptions.api = ev.api;
    this.gridOptions.api.sizeColumnsToFit();
    this.gridOptions.api.setSortModel([
      {
        colId: 'rfq',
        sort: 'desc'
      }
    ]);
  }

  onPageSizeChange(ev) {
    this.pageSize = ev.target.value;
    this.gridOptions.api.paginationSetPageSize(this.pageSize);
  }
}
