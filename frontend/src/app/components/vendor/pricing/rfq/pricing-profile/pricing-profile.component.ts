import { Component, OnInit, ViewChild, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions } from 'ag-grid-community';
import { NgxSpinnerService } from 'ngx-spinner';

import { catchError } from 'rxjs/operators';
import { BehaviorSubject, throwError } from 'rxjs';

import { Part } from 'src/app/model/part.model';
import { RfqPricingService } from '../../../../../service/rfq-pricing.service';
import { TemplateRendererComponent } from '../../../../../common/template-renderer/template-renderer.component';

@Component({
  selector: 'app-pricing-profile',
  templateUrl: './pricing-profile.component.html',
  styleUrls: ['./pricing-profile.component.css']
})
export class PricingProfileComponent implements OnInit {
  @Input() part: Part;
  @Input() rowData: any[];
  @Input() isShowingGlobalRuleProfile;
  @Output() toggleProfileView: EventEmitter<boolean> = new EventEmitter(null);
  @ViewChild('dateCell') dateCell: TemplateRef<any>;
  @ViewChild('checkBoxCell') checkBoxCell: TemplateRef<any>;
  type = ['search', 'filter'];

  searchColumns = [
    {
      name: 'Vendor Name',
      field: 'vendorName',
      tooltipField: 'vendorName',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Pricing Profile',
      field: 'pricingProfile',
      tooltipField: 'pricingProfile',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Material',
      field: 'material',
      tooltipField: 'material',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Equipment',
      field: 'equipment',
      tooltipField: 'equipment',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Process Profile',
      field: 'processProfile',
      tooltipField: 'processProfile',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    }
    // {
    //   name: "Post-Process",
    //   field: "postProcess",
    //   tooltipField: "postProcess",
    //   checked: false,
    //   query: {
    //     type: "",
    //     filter: ""
    //   }
    // },
    // {
    //   name: "Machines Matched",
    //   field: "machinesMatched",
    //   tooltipField: "machinesMatched",
    //   checked: false,
    //   query: {
    //     type: "",
    //     filter: ""
    //   }
    // },
    // {
    //   name: "Total Cost",
    //   field: "totalCost",
    //   tooltipField: "totalCost",
    //   checked: false,
    //   query: {
    //     type: "",
    //     filter: ""
    //   }
    // },
    // {
    //   name: "Estimated Delivery",
    //   field: "estimatedDelivery",
    //   tooltipField: "estimatedDelivery",
    //   checked: false,
    //   query: {
    //     type: "",
    //     filter: ""
    //   }
    // },
    // {
    //   name: "Match Score",
    //   field: "matchScore",
    //   tooltipField: "matchScore",
    //   checked: false,
    //   query: {
    //     type: "",
    //     filter: ""
    //   }
    // }
  ];
  filterColumns = [
    {
      name: 'Vendor Name',
      field: 'vendorName',
      tooltipField: 'vendorName',
      checked: true
    },
    {
      name: 'Pricing Profile',
      field: 'pricingProfile',
      tooltipField: 'pricingProfile',
      checked: true
    },
    {
      name: 'Material',
      field: 'material',
      tooltipField: 'material',
      checked: true
    },
    {
      name: 'Equipment',
      field: 'equipment',
      tooltipField: 'equipment',
      checked: true
    },
    {
      name: 'Process Profile',
      field: 'processProfile',
      tooltipField: 'processProfile',
      checked: true
    }
    // {
    //   name: "Post-Process",
    //   field: "postProcess",
    //   tooltipField: "postProcess",
    //   checked: true
    // },
    // {
    //   name: "Machines Matched",
    //   field: "machinesMatched",
    //   tooltipField: "machinesMatched",
    //   checked: true
    // },
    // {
    //   name: "Total Cost",
    //   field: "totalCost",
    //   tooltipField: "totalCost",
    //   checked: true
    // },
    // {
    //   name: "Estimated Delivery",
    //   field: "estimatedDelivery",
    //   tooltipField: "estimatedDelivery",
    //   checked: true
    // },
    // {
    //   name: "Match Score",
    //   field: "matchScore",
    //   tooltipField: "matchScore",
    //   checked: true
    // }
  ];

  columnDefs: Array<any> = [];
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  gridOptions: GridOptions;
  pageSize = 10;
  navigation;

  selected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  showViewToggle = false;
  constructor(public router: Router, public spinner: NgxSpinnerService, private pricingService: RfqPricingService) {
    this.navigation = this.router.getCurrentNavigation();
    this.showViewToggle = this.router.url.includes('/pricing/rfq/auto-prices');
  }

  ngOnInit() {
    this.initColumns();
    this.gridOptions = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.columnDefs,
      pagination: true,
      paginationPageSize: 10,
      enableColResize: true,
      rowHeight: 35,
      headerHeight: 35,
      onRowClicked: event => this.router.navigateByUrl(`${this.router.url}/pricing-profile/${event.data.id}`)
    };
  }

  onPageSizeChange(v) {
    this.pageSize = v.target.value;
    if (this.gridOptions.api) {
      this.gridOptions.api.paginationSetPageSize(this.pageSize);
    }
  }

  initColumns() {
    this.columnDefs = [
      {
        headerName: '',
        field: 'selected',
        hide: false,
        sortable: false,
        filter: false,
        width: 60,
        maxWidth: 60,
        cellClass: 'p-0 check-box-column',
        cellRenderer: 'templateRenderer',
        cellRendererParams: {
          ngTemplate: this.checkBoxCell
        },
        cellEditor: 'templateRenderer',
        cellEditorParams: {
          ngTemplate: this.checkBoxCell
        }
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        tooltipField: 'vendorName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Pricing Profile',
        field: 'pricingProfile',
        tooltipField: 'pricingProfile',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Material',
        field: 'material',
        tooltipField: 'material',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Equipment',
        field: 'equipment',
        tooltipField: 'equipment',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Process Profile',
        field: 'processProfile',
        tooltipField: 'processProfile',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Total Cost',
        field: 'totalCost',
        tooltipField: 'totalCost',
        hide: true,
        sortable: true,
        filter: false,
        valueFormatter: x => (x.value ? `$ ${(x.value || 0).toFixed(2)}` : '')
      }
      // {
      //   headerName: "Post-Process",
      //   field: "postProcess",
      //   tooltipField: "postProcess",
      //   hide: false,
      //   sortable: true,
      //   filter: false
      // },
      // {
      //   headerName: "Machines Matched",
      //   field: "machinesMatched",
      //   tooltipField: "machinesMatched",
      //   hide: false,
      //   sortable: true,
      //   filter: false
      // },
      // {
      //   headerName: "Estimated Delivery",
      //   field: "esitmatedDelivery",
      //   tooltipField: "esitmatedDelivery",
      //   hide: false,
      //   sortable: true,
      //   filter: false
      // },
      // {
      //   headerName: "Match Score",
      //   field: "matchScore",
      //   tooltipField: "matchScore",
      //   hide: false,
      //   sortable: false,
      //   filter: false
      // }
    ];
  }

  configureColumnDefs() {
    this.filterColumns.map(column => {
      this.columnDefs.map(col => {
        if (col.headerName === column.name) {
          col.hide = !column.checked;
        }
      });
    });
  }

  filterColumnsChange(event) {
    this.configureColumnDefs();
    this.gridOptions.api.setColumnDefs([]);
    this.gridOptions.api.setColumnDefs(this.columnDefs);
    this.gridOptions.api.sizeColumnsToFit();
  }

  searchColumnsChange(columns) {
    columns.map(column => {
      const columnInstance = this.gridOptions.api.getFilterInstance(column.field);
      if (columnInstance) {
        if (column.checked) {
          columnInstance.setModel(column.query);
        } else {
          columnInstance.setModel({ type: '', filter: '' });
        }
      }
      this.gridOptions.api.onFilterChanged();
    });
  }

  valueChange() {
    this.selected$.next((this.rowData || []).some(i => i.selected));
  }

  showPartQuotePricingInfo() {
    this.spinner.show('spooler');
    if (!this.selected$.getValue()) {
      (this.rowData || []).map(row => (row.selected = true));
      this.gridOptions.api.setRowData(this.rowData || []);
    }
    this.pricingService
      .getPartQuoteByPricingIds(
        this.part.id,
        (this.rowData || [])
          .filter(i => i.selected)
          .map(i => i.id)
          .join(',')
      )
      .subscribe(v => {
        if (v) {
          (this.rowData || []).map(row => {
            if (v[row.id]) {
              row.totalCost = v[row.id].totalCost;
            } else {
              row.totalCost = null;
            }
          });
          this.gridOptions.api.setRowData(this.rowData || []);
          this.gridOptions.columnApi.setColumnVisible('totalCost', true);
          this.gridOptions.api.sizeColumnsToFit();
        }
        this.spinner.hide('spooler');
      });
  }

  resetPricingFilters() {
    this.gridOptions.columnApi.setColumnVisible('totalCost', false);
    (this.rowData || []).map(row => {
      row.totalCost = null;
      row.selected = false;
    });
    this.valueChange();
    this.gridOptions.api.setRowData(this.rowData || []);
    this.gridOptions.api.sizeColumnsToFit();
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  toggleView() {
    this.toggleProfileView.emit(!this.isShowingGlobalRuleProfile);
  }
}
