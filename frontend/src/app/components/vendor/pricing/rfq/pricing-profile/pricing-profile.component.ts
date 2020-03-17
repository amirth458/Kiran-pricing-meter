import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
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
  rowData;
  pageSize = 10;
  navigation;

  selected$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(public router: Router, public spinner: NgxSpinnerService, private pricingService: RfqPricingService) {
    this.navigation = this.router.getCurrentNavigation();
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
    this.getPricingProfiles();
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

  async getPricingProfiles(q = null) {
    this.spinner.show();
    this.pricingService
      .getPricingProfiles(this.part.id)
      .pipe(
        catchError(e => {
          const message = e.error.message;
          this.spinner.hide();
          console.log(message);
          return throwError('Error');
        })
      )
      .subscribe(res => {
        this.rowData = res.map(item => ({
          selected: false,
          id: item.id,
          vendorName: item.vendorProfile.name,
          pricingProfile: item.name,
          material: item.processProfile.processMachineServingMaterialList
            .map(item => item.machineServingMaterial.material.name)
            .join(', '),
          equipment: item.processProfile.processMachineServingMaterialList
            .map(item => item.machineServingMaterial.vendorMachinery.equipment.name)
            .join(', '),
          processProfile: item.processProfile.name,
          totalCost: null
        }));
        this.spinner.hide();
      });
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
            }
          });
          this.gridOptions.columnApi.setColumnVisible('totalCost', true);
          this.gridOptions.api.sizeColumnsToFit();
        }
      });
  }

  resetPricingFilters() {
    this.gridOptions.columnApi.setColumnVisible('totalCost', false);
    (this.rowData || []).map(row => {
      row.totalCos = null;
      row.selected = false;
    });
    this.valueChange();
    this.gridOptions.api.sizeColumnsToFit();
  }

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }
}
