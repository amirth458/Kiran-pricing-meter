import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessMetadataService {

  constructor(public http: HttpClient) { }

  getMeasurementType() {
    this.http.get(environment.apiBaseUrl + '/api/v1/process-metadata/measurement_type');
  }

  getCurrency() {
    this.http.get(environment.apiBaseUrl + '/api/v1/process-metadata/currency');
  }

  getoperatorType() {
    this.http.get(environment.apiBaseUrl + '/api/v1/process-metadata/operator_type');
  }

  getOperatorType() {
    this.http.get(environment.apiBaseUrl + '/api/v1/process-metadata/operator_type');
  }

  getProcessDimensionalPropertyType() {
    this.http.get(environment.apiBaseUrl + '/api/v1/process-metadata/process_dimensional_property_type');
  }

  getProcessMterialCharacteristicType() {
    this.http.get(environment.apiBaseUrl + '/api/v1/process-metadata/process_material_characteristic_type');
  }

  getProcessParameterType() {
    this.http.get(environment.apiBaseUrl + '/api/v1/process-metadata/process_parameter_type');
  }

  getProcessPricingConditionType() {
    this.http.get(environment.apiBaseUrl + '/api/v1/process-metadata/process_pricing_condition_type');
  }

  getProcessPricingParameterType() {
    this.http.get(environment.apiBaseUrl + '/api/v1/process-metadata/process_pricing_parameter_type');
  }

  getProcessProfileType() {
    this.http.get(environment.apiBaseUrl + '/api/v1/process-metadata/process_profile_type');
  }

  getValueSignType() {
    this.http.get(environment.apiBaseUrl + '/api/v1/process-metadata/value_sign_type');
  }

}
