import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { ForgeService } from 'src/app/service/forge.service';
import { ForgeMetadata } from 'src/app/model/forge.modal';
@Component({
  selector: 'app-view-in-three-d',
  templateUrl: './view-in-three-d.component.html',
  styleUrls: ['./view-in-three-d.component.css']
})
export class ViewInThreeDComponent implements OnInit {
  @Input() set connectorServiceId(val: number) {
    this.id = val;
    this.getMetadataId(val);
  }
  id: number = null;
  res: ForgeMetadata = null;

  constructor(
    public toastrService: ToastrService,
    public modalService: NgbModal,
    public forgeService: ForgeService,
    public spineer: NgxSpinnerService
  ) {}

  ngOnInit() {}

  async getMetadataId(connectorServiceId) {
    try {
      this.res = await this.forgeService.getMetadataId(connectorServiceId.toString()).toPromise();
    } catch (error) {
      this.res = null;
    }
  }

  open(content, size: any = 'xl') {
    this.modalService.open(content, {
      ariaLabelledBy: 'modal-basic-title',
      centered: true,
      size
    });
    this.onModalOpen();
  }

  onModalOpen() {
    this.spineer.show();
    const wrapper = document.querySelector('#container');
    this.forgeService.start(wrapper, this.res.urn);
  }
}
