import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GridOptions, ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ProjectService } from 'src/app/service/project.service';

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
  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public projectService: ProjectService,
    public toastr: ToastrService,
    public modal: NgbModal
  ) {}

  ngOnInit() {
    this.route.params.subscribe(({ id }) => {
      if (!id) {
        return;
      }
      const partIds = id.split(',');
      console.log(partIds);
      this.getAllSuppliersListByPartIds(partIds);
    });
  }

  getAllSuppliersListByPartIds(partIds) {
    this.projectService.getAllSuppliersListByPartIds({ partIds }).subscribe(
      reponse => {
        console.log(reponse);
        this.suppliers = reponse;
      },
      error => {
        console.log('Error', error);
      }
    );
  }
}
