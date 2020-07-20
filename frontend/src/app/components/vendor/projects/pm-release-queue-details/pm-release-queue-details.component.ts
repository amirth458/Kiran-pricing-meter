import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectService } from 'src/app/service/project.service';
import { PartService } from 'src/app/service/part.service';
import { ConnectProject } from 'src/app/model/connect.model';
import { MetadataService } from 'src/app/service/metadata.service';
import { MetadataConfig } from 'src/app/model/metadata.model';

@Component({
  selector: 'app-pm-release-queue-details',
  templateUrl: './pm-release-queue-details.component.html',
  styleUrls: ['./pm-release-queue-details.component.css']
})
export class PmReleaseQueueDetailsComponent implements OnInit {
  @ViewChild('removeCell') removeCell: TemplateRef<any>;
  @ViewChild('moveCell') moveCell: TemplateRef<any>;
  @ViewChild('statusCell') statusCell: TemplateRef<any>;
  @ViewChild('vendorCell') vendorCell: TemplateRef<any>;
  @ViewChild('vendorProfile') vendorProfileModal: TemplateRef<any>;
  @ViewChild('addSupplier') addSupplier: TemplateRef<any>;
  @ViewChild('reference') reference: TemplateRef<any>;

  suppliers = [];
  showPartDetails = false;
  projectDetails: ConnectProject;
  unitOptions = [];
  parts = [];
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public metadataService: MetadataService,
    public projectService: ProjectService,
    public partService: PartService,
    public toastr: ToastrService,
    public modal: NgbModal
  ) {}

  ngOnInit() {
    this.route.params.subscribe(({ id }) => {
      if (!id) {
        return;
      }
      const partIds = id.split(',');
      // console.log(partIds);

      // this.parts = this.projectService.partService();
      this.getPartsAndSuppliersByPartId(partIds);
    });
  }
  getAdminMetaData() {
    this.metadataService.getAdminMetaData(MetadataConfig.MEASUREMENT_UNIT_TYPE).subscribe(res => {
      this.unitOptions = res;
    });
  }

  // getAllSuppliersListByPartIds(partIds) {

  // }

  getPartsAndSuppliersByPartId(partIds) {
    console.log(partIds);
    this.partService.getPartsById(partIds).subscribe(
      reponse => {
        console.log(reponse);
        this.parts = reponse;
      },
      error => {
        console.log('Error', error);
      }
    );

    this.partService.getPartsById(partIds).subscribe(
      reponse => {
        console.log(reponse);
        this.parts = reponse;
      },
      error => {
        console.log('Error', error);
      }
    );
  }
}
