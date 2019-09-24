import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessMetadataService {

  constructor(public http: HttpClient) { }

  getMeasurementType(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/measurement_type');
  }

  getCurrency(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/currency');
  }

  getMeasurementUnitType(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/measurement_unit_type');
  }

  getoperatorType(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/operator_type');
  }

  getOperand(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/operand_type');
  }

  getProcessDimensionalPropertyType(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/process_dimensional_property_type');
  }

  getProcessMaterialCharacteristicType(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/process_material_characteristic_type');
  }

  getProcessParameterType(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/process_parameter_type');
  }

  getProcessPricingConditionType(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/process_pricing_condition_type');
  }

  getProcessPricingParameterType(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/process_pricing_parameter_type');
  }

  getProcessProfileType(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/process_profile_type');
  }

  getValueSignType(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/value_sign_type');
  }

}
