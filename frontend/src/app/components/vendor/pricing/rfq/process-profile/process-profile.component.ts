import { RfqPricingService } from './../../../../../service/rfq-pricing.service';
import { TemplateRendererComponent } from './../../../../../common/template-renderer/template-renderer.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';
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
    },
    {
      name: 'PricingProfile',
      field: 'pricingProfile',
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
    },
    {
      name: 'PricingProfile',
      field: 'pricingProfile',
      checked: true
    }
  ];

  columnDefs: Array<any> = [];
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };
  gridOptions: GridOptions;
  rowData;
  pageSize = 10;
  navigation;
  pricingSettings;

  constructor(
    public router: Router,
    public spinner: NgxSpinnerService,
    private ordersService: OrdersService,
    private userService: UserService
  ) {
    this.navigation = this.router.getCurrentNavigation();
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
    this.getProcessProfile();
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
      },
      {
        headerName: 'PricingProfile',
        field: 'pricingProfile',
        hide: false,
        sortable: true,
        filter: false,
        tooltip: params => params.value
      }
    ];
  }

  async getProcessProfile(q = null) {
    this.spinner.show();
    const res = await this.ordersService
      .getMatchedProfiles(this.userService.getUserInfo().id, [this.part.rfqMedia.id])
      .toPromise();

    this.rowData = res.map(item => ({
      id: item.processProfileView.id,
      profileId: item.processProfileId,
      vendorName: item.vendorProfile.name,
      processProfileName: item.processProfileView.name,
      facilityName:
        item.processProfileView.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery
          .vendorFacility.name,
      pricingProfile: item.processPricingViews && item.processPricingViews.map(v => v.name).join(', '),
      material: this.getAllMaterials(item.processProfileView.processMachineServingMaterialList),
      equipment:
        item.processProfileView.processMachineServingMaterialList[0].machineServingMaterial.vendorMachinery.equipment
          .name
    }));
    this.spinner.hide();
  }

  getAllMaterials(m: any) {
    const arr = [];
    (m || []).map(m => {
      m.machineServingMaterial.material.name;
      if (m.machineServingMaterial && m.machineServingMaterial.material && m.machineServingMaterial.material.name) {
        arr.push(m.machineServingMaterial.material.name);
      }
    });
    return arr.join(',');
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
}
