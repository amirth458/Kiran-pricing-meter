import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Util } from 'src/app/util/Util';
import { Part, PartCustomParameter, PartDimension, PartQuote, RfqData } from 'src/app/model/part.model';
import { CustomerDetails } from 'src/app/model/customer.model';
import { MetadataService } from 'src/app/service/metadata.service';
import { CommonService } from '../../service/common.service';
import { IdCollection } from '../../model/id-collection.model';

@Component({
  selector: 'app-part-information',
  templateUrl: './part-information.component.html',
  styleUrls: ['./part-information.component.css']
})
export class PartInformationComponent implements OnInit {
  partInfo: Part;
  @Input()
  set part(value: Part) {
    this.partInfo = value;
  }
  get part(): Part {
    return this.partInfo;
  }
  @Input() rfq: RfqData;
  @Input() customer: CustomerDetails;
  @Input() partDimension: PartDimension;
  @Input() partQuote: PartQuote;
  @Input() invoiceItems: any;

  @Input() countries = [];
  @Input() certs = [];
  @Input() postProcesses = [];
  @Input() antiMatchCerts = [];
  @Input() operatorTypes = [];
  @Input() measurementUnits;

  idCollection: IdCollection;

  constructor(
    public modalService: NgbModal,
    public metadataService: MetadataService,
    public spinner: NgxSpinnerService,
    public toastr: ToastrService,
    public commonService: CommonService
  ) {}

  ngOnInit() {
    let inputId = null;
    if (this.rfq && this.rfq.id) {
      inputId = {
        id: this.rfq.id,
        idType: 'RFQ_ID'
      };
    } else if(this.part && this.part.id) {
      inputId = {
        id: this.part.id,
        idType: 'PART_ID'
      };
    }
    if (inputId) {
      this.commonService.getVariousIdCollection(inputId).subscribe(
        res => {
          if (res && res.length > 0) {
            this.idCollection = res[0];
          }
        },
        err => {
          this.toastr.error('Unable to perform action');
        }
      );
    }
  }

  isProposalPart(part: Part): boolean {
    return Util.isProposalPart(part);
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

  download() {
    let url = this.part.rfqMedia.media.location;
    let a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    a.setAttribute('target', '_blank');
    a.href = url;
    a.download = this.part.rfqMedia.media.name;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
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

  open(content, size: any = 'xl') {
    this.modalService
      .open(content, {
        size,
        ariaLabelledBy: 'modal-basic-title',
        centered: true
      })
      .result.then(
        result => {},
        reason => {}
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
