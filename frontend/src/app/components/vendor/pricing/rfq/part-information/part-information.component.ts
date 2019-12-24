import { CustomerData } from "src/app/model/user.model";
import {
  RfqData,
  ParameterTolerance,
  PartCustomParameter
} from "./../../../../../model/part.model";
import { Util } from "./../../../../../util/Util";
import { Component, OnInit, Input } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Part } from "src/app/model/part.model";

import { MetadataService } from "./../../../../../service/metadata.service";

@Component({
  selector: "app-part-information",
  templateUrl: "./part-information.component.html",
  styleUrls: ["./part-information.component.css"]
})
export class PartInformationComponent implements OnInit {
  @Input() part: Part;
  @Input() rfq: RfqData;
  @Input() customer: CustomerData;

  countries = [];
  certs = [];
  postProcesses = [];
  antiMatchCerts = [];

  measurementUnits;

  constructor(
    private modalService: NgbModal,
    private metadataService: MetadataService
  ) {}

  ngOnInit() {
    console.log('rfq',this.rfq);
    this.metadataService
      .getMetaData("measurement_unit_type")
      .subscribe(v => (this.measurementUnits = v));
    this.metadataService
      .getMetaData("country")
      .subscribe(v => (this.countries = v));
    this.metadataService
      .getMetaData("vendor_certificate")
      .subscribe(v => (this.certs = v));
    this.metadataService
      .getMetaData("post_process_action")
      .subscribe(v => (this.postProcesses = v));
  }

  getDimension() {
    const metadataList = this.measurementUnits;
    return Util.getPartDimension(
      this.part.rfqMedia.media.partDimension,
      metadataList || []
    );
  }

  getDimensionValue(dimensionValue) {
    return Util.getPartDimensionValue(
      dimensionValue,
      this.measurementUnits || []
    );
  }

  getBoundingBox() {
    return Util.getBoundingBox(
      this.part.rfqMedia.media.partDimension,
      this.measurementUnits || []
    );
  }

  showCustomParameter(customParameter: PartCustomParameter) {
    return Util.showCustomPrameter(
      customParameter,
      this.measurementUnits || []
    );
  }

  getCustomerIndustries() {
    return (
      this.customer &&
      this.customer.industries.map(industry => industry.name).join(", ")
    );
  }

  getPermittedCountries() {
    return (
      this.rfq &&
      this.rfq.projectProfile.countryIds
        .map(item => {
          const found = this.countries && this.countries.find(country => country.id === item);
          return found && found.name;
        })
        .join(", ")
    );
  }

  getRequiredCerts() {
    return (
      this.rfq &&
      this.rfq.projectProfile.vendorCertIds
        .map(item => {
          const found = this.certs && this.certs.find(cert => cert.id === item);
          return found && found.name;
        })
        .join(", ")
    );
  }

  getPostProcesses() {
    return (
      this.part &&
      this.part.postProcessTypeIds &&
      this.part.postProcessTypeIds
        .map(
          id => {
            const found = this.postProcesses && this.postProcesses.find(postProcess => postProcess.id == id);
            return found && found.name;
          }
        )
        .join(", ")
    );
  }

  view3D(content) {
    this.modalService.open(content, {
      centered: true,
      windowClass: "model-viewer-modal"
    });
  }
}
