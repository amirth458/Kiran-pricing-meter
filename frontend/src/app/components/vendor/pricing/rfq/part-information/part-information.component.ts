import { CustomerData } from "src/app/model/user.model";
import {
  RfqData,
  ParameterTolerance,
  PartCustomParameter,
  PartDimension
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
  @Input() partDimension: PartDimension;

  countries = [];
  certs = [];
  postProcesses = [];
  antiMatchCerts = [];
  operatorTypes = [];

  measurementUnits;

  constructor(
    private modalService: NgbModal,
    private metadataService: MetadataService
  ) {}

  ngOnInit() {
    console.log("part", this.part);
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
    this.metadataService
      .getMetaData("core_competence")
      .subscribe(v => (this.antiMatchCerts = v));
    this.metadataService
      .getMetaData("operator_type")
      .subscribe(v => (this.operatorTypes = v));
  }

  getDimension() {
    const metadataList = this.measurementUnits;
    return Util.getPartDimension(this.partDimension, metadataList || []);
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
          const found =
            this.countries &&
            this.countries.find(country => country.id === item);
          return found && found.name;
        })
        .join(", ")
    );
  }

  getAntiMatch() {
    return (
      this.rfq &&
      this.rfq.projectProfile.antiMatchCertIds
        .map(item => {
          const found =
            this.antiMatchCerts &&
            this.antiMatchCerts.find(certs => certs.id === item);
          return found ? found.name : item;
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
        .map(id => {
          const found =
            this.postProcesses &&
            this.postProcesses.find(postProcess => postProcess.id == id);
          return found && found.name;
        })
        .join(", ")
    );
  }

  view3D(content) {
    this.modalService.open(content, {
      centered: true,
      windowClass: "model-viewer-modal"
    });
  }

  getSurfaceRoughness() {
    const found = this.part.partCustomParameterList.find(
      item => item.partParameterType.name === "SURFACE_ROUGHNESS"
    );
    if (found) {
      return Util.showCustomPrameter(
        found,
        this.measurementUnits,
        this.operatorTypes
      );
    }
    return "";
  }
  getTolerance() {
    return this.part.partCustomParameterList
      .filter(item => item.partParameterType.name !== "SURFACE_ROUGHNESS")
      .map(item => Util.showCustomPrameter(item, this.measurementUnits))
      .join(", ");
  }

  getToleranceList() {
    return (
      this.part &&
      this.part.partCustomParameterList.filter(
        item => item.partParameterType.name !== "SURFACE_ROUGHNESS"
      )
    );
  }
}
