import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessMetadataService {
  constructor(public http: HttpClient) {}

  getMeasurementType(postProcess = false): Observable<{ metadataList: any; metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(
        environment.managementBaseUrl + '/process-metadata/measurement_type?processProfileTypeId=2'
      );
    }
    return this.http.get<any>(
      environment.managementBaseUrl + '/process-metadata/measurement_type?processProfileTypeId=1'
    );
  }

  getCurrency(postProcess = false): Observable<{ metadataList: any; metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(environment.managementBaseUrl + '/process-metadata/currency?processProfileTypeId=2');
    }
    return this.http.get<any>(environment.managementBaseUrl + '/process-metadata/currency?processProfileTypeId=1');
  }

  getMeasurementUnitType(postProcess = false): Observable<{ metadataList: any; metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(
        environment.managementBaseUrl + '/process-metadata/measurement_unit_type?processProfileTypeId=2'
      );
    }
    return this.http.get<any>(
      environment.managementBaseUrl + '/process-metadata/measurement_unit_type?processProfileTypeId=1'
    );
  }

  getoperatorType(postProcess = false): Observable<{ metadataList: any; metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(
        environment.managementBaseUrl + '/process-metadata/operator_type?processProfileTypeId=2'
      );
    }
    return this.http.get<any>(environment.managementBaseUrl + '/process-metadata/operator_type?processProfileTypeId=1');
  }

  getOperand(postProcess = false): Observable<{ metadataList: any; metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(
        environment.managementBaseUrl + '/process-metadata/operand_type?processProfileTypeId=2'
      );
    }
    return this.http.get<any>(environment.managementBaseUrl + '/process-metadata/operand_type?processProfileTypeId=1');
  }

  getProcessDimensionalPropertyType(postProcess = false): Observable<{ metadataList: any; metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(
        environment.managementBaseUrl + '/process-metadata/process_dimensional_property_type?processProfileTypeId=2'
      );
    }
    return this.http.get<any>(
      environment.managementBaseUrl + '/process-metadata/process_dimensional_property_type?processProfileTypeId=1'
    );
  }

  getProcessMaterialCharacteristicType(postProcess = false): Observable<{ metadataList: any; metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(
        environment.managementBaseUrl + '/process-metadata/process_material_characteristic_type?processProfileTypeId=2'
      );
    }
    return this.http.get<any>(
      environment.managementBaseUrl + '/process-metadata/process_material_characteristic_type?processProfileTypeId=1'
    );
  }

  getProcessParameterType(postProcess = false): Observable<{ metadataList: any; metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(
        environment.managementBaseUrl + '/process-metadata/process_parameter_type?processProfileTypeId=2'
      );
    }
    return this.http.get<any>(
      environment.managementBaseUrl + '/process-metadata/process_parameter_type?processProfileTypeId=1'
    );
  }

  getProcessPricingConditionType(postProcess = false): Observable<{ metadataList: any; metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(
        environment.managementBaseUrl + '/process-metadata/process_pricing_condition_type?processProfileTypeId=2'
      );
    }
    return this.http.get<any>(
      environment.managementBaseUrl + '/process-metadata/process_pricing_condition_type?processProfileTypeId=1'
    );
  }

  getProcessPricingParameterType(postProcess = false): Observable<{ metadataList: any; metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(
        environment.managementBaseUrl + '/process-metadata/process_pricing_parameter_type?processProfileTypeId=2'
      );
    }
    return this.http.get<any>(
      environment.managementBaseUrl + '/process-metadata/process_pricing_parameter_type?processProfileTypeId=1'
    );
  }

  getProcessProfileType(postProcess = false): Observable<{ metadataList: any; metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(
        environment.managementBaseUrl + '/process-metadata/process_profile_type?processProfileTypeId=2'
      );
    }
    return this.http.get<any>(
      environment.managementBaseUrl + '/process-metadata/process_profile_type?processProfileTypeId=1'
    );
  }

  getValueSignType(postProcess = false): Observable<{ metadataList: any; metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(
        environment.managementBaseUrl + '/process-metadata/value_sign_type?processProfileTypeId=2'
      );
    }
    return this.http.get<any>(
      environment.managementBaseUrl + '/process-metadata/value_sign_type?processProfileTypeId=1'
    );
  }

  getAppProcessSpeedType(): Observable<{ metadataList: any; metadataType: any }> {
    return this.http.get<any>(
      environment.managementBaseUrl + '/process-metadata/process_speed_type?processProfileTypeId=1'
    );
  }
}
