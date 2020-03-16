import { CustomerData } from 'src/app/model/user.model';
import { RfqData, ParameterTolerance, PartCustomParameter, PartDimension } from './../../../../../model/part.model';
import { Util } from './../../../../../util/Util';
import { Component, OnInit, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Part } from 'src/app/model/part.model';

import { MetadataService } from './../../../../../service/metadata.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ForgeService } from 'src/app/service/forge.service';

@Component({
  selector: 'app-part-information',
  templateUrl: './part-information.component.html',
  styleUrls: ['./part-information.component.css']
})
export class PartInformationComponent implements OnInit {
  @Input() part: Part;
  @Input() rfq: RfqData;
  @Input() customer: CustomerData;
  @Input() partDimension: PartDimension;

  countries = [];
  certs = [];
  postProcesses = [];
  antiMatchCerts = [];
  operatorTypes = [];

  measurementUnits;

  constructor(
    public modalService: NgbModal,
    public metadataService: MetadataService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public forgeService: ForgeService
  ) {}

  ngOnInit() {
    console.log('part', this.part);
    this.metadataService.getMetaData('measurement_unit_type').subscribe(v => (this.measurementUnits = v));
    this.metadataService.getMetaData('country').subscribe(v => (this.countries = v));
    this.metadataService.getMetaData('vendor_certificate').subscribe(v => (this.certs = v));
    this.metadataService.getMetaData('post_process_action').subscribe(v => (this.postProcesses = v));
    this.metadataService.getMetaData('core_competence').subscribe(v => (this.antiMatchCerts = v));
    this.metadataService.getMetaData('operator_type').subscribe(v => (this.operatorTypes = v));
  }

  getDimension() {
    const metadataList = this.measurementUnits;
    return this.partDimension && Util.getPartDimension(this.partDimension, metadataList || []);
  }

  getDimensionValue(dimensionValue) {
    return Util.getPartDimensionValue(dimensionValue, this.measurementUnits || []);
  }

  getBoundingBox() {
    return Util.getBoundingBox(this.part.rfqMedia.media.partDimension, this.measurementUnits || []);
  }

  showCustomParameter(customParameter: PartCustomParameter) {
    return Util.showCustomPrameter(customParameter, this.measurementUnits || []);
  }

  getCustomerIndustries() {
    return this.customer && this.customer.industries.map(industry => industry.name).join(', ');
  }

  getPermittedCountries() {
    return (
      this.rfq &&
      (this.rfq.projectProfile.countryIds || [])
        .map(item => {
          const found = this.countries && this.countries.find(country => country.id === item);
          return found && found.name;
        })
        .join(', ')
    );
  }

  getAntiMatch() {
    return (
      this.rfq &&
      (this.rfq.projectProfile.antiMatchCertIds || [])
        .map(item => {
          const found = this.antiMatchCerts && this.antiMatchCerts.find(certs => certs.id === item);
          return found ? found.name : item;
        })
        .join(', ')
    );
  }

  getRequiredCerts() {
    return (
      this.rfq &&
      (this.rfq.projectProfile.vendorCertIds || [])
        .map(item => {
          const found = this.certs && this.certs.find(cert => cert.id === item);
          return found && found.name;
        })
        .join(', ')
    );
  }

  getPostProcesses() {
    return (
      this.part &&
      this.part.postProcessTypeIds &&
      this.part.postProcessTypeIds
        .map(id => {
          const found = this.postProcesses && this.postProcesses.find(postProcess => postProcess.id == id);
          return found && found.name;
        })
        .join(', ')
    );
  }

  view3D(content) {
    this.toastr.warning('It is under development.');
    return;
    this.spinner.show();
    this.forgeService.getMetadataId(this.part.rfqMedia.media.connectorServiceId).subscribe(
      (res: any) => {
        this.modalService.open(content, {
          size: 'lg',
          centered: true,
          windowClass: 'model-viewer-modal'
        });

        const wrapper = document.querySelector('#container');
        // tslint:disable-next-line:max-line-length
        // const urn = 'dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6dG9kYXlzYnVja2V0MS9jb25uZWN0b3IzMzQxMDM1MTg2NjY5NTEwNDU2Q3VzaGlvbmVlci0yaW5fc3Ryb2tlLlNURVA=';
        this.forgeService.start(wrapper, res.urn);
      },
      err => {
        console.log({ err });
        this.toastr.error('Error while fetching file Urn.');
        this.spinner.hide();
      }
    );
  }

  getSurfaceRoughness() {
    const found = this.part.partCustomParameterList.find(item => item.partParameterType.name === 'SURFACE_ROUGHNESS');
    if (found) {
      return Util.showCustomPrameter(found, this.measurementUnits, this.operatorTypes);
    }
    return '';
  }
  getTolerance() {
    return this.part.partCustomParameterList
      .filter(item => item.partParameterType.name !== 'SURFACE_ROUGHNESS')
      .map(item => Util.showCustomPrameter(item, this.measurementUnits))
      .join(', ');
  }

  getToleranceList() {
    return (
      this.part && this.part.partCustomParameterList.filter(item => item.partParameterType.name !== 'SURFACE_ROUGHNESS')
    );
  }
}
