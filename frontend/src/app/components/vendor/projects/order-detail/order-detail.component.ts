import { Component, OnInit } from '@angular/core';
import { OrdersService } from 'src/app/service/orders.service';
import { MetadataConfig } from 'src/app/model/metadata.model';
import { MetadataService } from 'src/app/service/metadata.service';
import { combineLatest } from 'rxjs';
import { GridOptions } from 'ag-grid-community';
import { ActivatedRoute } from '@angular/router';
import { PartService } from 'src/app/service/part.service';
import { TemplateRendererComponent } from 'src/app/common/template-renderer/template-renderer.component';
import { UserService } from 'src/app/service/user.service';
import { Part } from 'src/app/model/part.model';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  measurementUnits: any;
  postProcessAction: any;

  supplierGridOptions: GridOptions[] = [];
  supplierColumnDefs = [
    [
      {
        headerName: 'No',
        field: 'id',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Process Profile Name',
        field: 'processProfileName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Quantity of Process Profiles',
        field: 'releasedPriority',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Released Priority',
        field: 'releasedPriority',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: '',
        hide: false,
        sortable: true,
        filter: false
      }
    ],
    [
      {
        headerName: 'No',
        field: 'id',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Vendor Name',
        field: 'vendorName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Process Profile Name',
        field: 'processProfileName',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: '',
        hide: false,
        sortable: true,
        filter: false
      }
    ]
  ];
  frameworkComponents = {
    templateRenderer: TemplateRendererComponent
  };

  matchingSuppliersProfile = [];
  removedMatchingSuppliersProfile = [];
  selectedSuppliers = [];

  part: Part;

  constructor(
    public orderService: OrdersService,
    public metadataService: MetadataService,
    public route: ActivatedRoute,
    public partService: PartService,
    public userService: UserService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(({ id }) => {
      this.orderService.getPartById(id).subscribe(v => {
        this.part = v;
        this.orderService
          .getMatchedProfiles(this.userService.getUserInfo().id, [this.part.rfqMedia.id])
          .subscribe(res => (this.matchingSuppliersProfile = res));
      });
    });
    combineLatest(
      this.orderService.getAllMeasurementUnitType(),
      this.metadataService.getAdminMetaData(MetadataConfig.POST_PROCESS_ACTION)
    ).subscribe(([measurementUnits, postProcessAction]) => {
      this.measurementUnits = measurementUnits;
      this.postProcessAction = postProcessAction;
    });

    this.supplierGridOptions[0] = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.supplierColumnDefs[0],
      enableColResize: true,
      rowHeight: 50,
      headerHeight: 35,
      domLayout: 'autoHeight',
      rowSelection: 'multiple'
    };

    this.supplierGridOptions[1] = {
      frameworkComponents: this.frameworkComponents,
      columnDefs: this.supplierColumnDefs[1],
      enableColResize: true,
      rowHeight: 50,
      headerHeight: 35,
      domLayout: 'autoHeight'
    };
  }

  onSuppliersGridReady(index, ev) {
    this.supplierGridOptions[index].api = ev.api;
    this.supplierGridOptions[index].api.sizeColumnsToFit();
  }
}
