import { RfqPricingService } from './../../../../../service/rfq-pricing.service';
import { TemplateRendererComponent } from './../../../../../common/template-renderer/template-renderer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, TemplateRef, Input, Output, EventEmitter } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { Part } from 'src/app/model/part.model';
import { OrdersService } from 'src/app/service/orders.service';
import { UserService } from 'src/app/service/user.service';
@Component({
  selector: 'app-process-profile',
  templateUrl: './process-profile.component.html',
  styleUrls: ['./process-profile.component.css']
})
export class ProcessProfileComponent implements OnInit {
  @Input() part: Part;
  @Input() rowData: any[];
  @Input() isShowingGlobalRuleProfile;
  @Output() toggleProfileView: EventEmitter<boolean> = new EventEmitter(null);
  @ViewChild('dateCell') dateCell: TemplateRef<any>;
  type = ['search', 'filter'];
  maxPartId;

  searchColumns = [
    {
      name: 'Corporate Name',
      field: 'vendorName',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Facility Name',
      field: 'facilityName',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Process Profile Name',
      field: 'processProfileName',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Equipment',
      field: 'equipment',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    },
    {
      name: 'Material',
      field: 'material',
      checked: false,
      query: {
        type: '',
        filter: ''
      }
    }
  ];

  filterColumns = [
    {
      name: 'Corporate Name',
      field: 'vendorName',
      checked: true
    },
    {
      name: 'Facility Name',
      field: 'facilityName',
      checked: true
    },
    {
      name: 'Process Profile Name',
      field: 'processProfileName',
      checked: true
    },
    {
      name: 'Equipment',
      field: 'equipment',
      checked: true
    },
    {
      name: 'Material',
      field: 'material',
      checked: true
    }
  ];

  columnDefs: Array<any> = [];
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  gridOptions: GridOptions;
  pageSize = 10;
  navigation;
  pricingSettings;

  showViewToggle = false;
  constructor(
    public router: Router,
    public spinner: NgxSpinnerService,
    private ordersService: OrdersService,
    private userService: UserService
  ) {
    this.navigation = this.router.getCurrentNavigation();
    this.toggleProfileView.emit(null);
    this.showViewToggle = this.router.url.includes('/pricing/rfq/auto-prices');
  }

  onPageSizeChange(v) {
    this.pageSize = v.target.value;
    if (this.gridOptions.api) {
      this.gridOptions.api.paginationSetPageSize(this.pageSize);
    }
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
      onRowClicked: event => {
        // this.onRowClick(event);
        //console.log('row click', event.data.id);
        this.router.navigateByUrl(this.router.url + '/process-profile/' + event.data.id);
      }
    };
  }

  initColumns() {
    this.columnDefs = [
      {
        headerName: 'Corporate Name',
        field: 'vendorName',
        hide: false,
        sortable: true,
        filter: false,
        tooltip: params => params.value
      },
      {
        headerName: 'Facility Name',
        field: 'facilityName',
        hide: false,
        sortable: true,
        filter: false,
        tooltip: params => params.value
      },
      {
        headerName: 'Process Profile Name',
        field: 'processProfileName',
        hide: false,
        sortable: true,
        filter: false,
        tooltip: params => params.value
      },
      {
        headerName: 'Equipment',
        field: 'equipment',
        hide: false,
        sortable: true,
        filter: false,
        tooltip: params => params.value
      },
      {
        headerName: 'Material',
        field: 'material',
        hide: false,
        sortable: true,
        filter: false,
        tooltip: params => params.value
      }
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

  onGridReady(event) {
    this.gridOptions.api = event.api;
    this.gridOptions.api.sizeColumnsToFit();
  }

  toggleView() {
    this.toggleProfileView.emit(!this.isShowingGlobalRuleProfile);
  }
}
