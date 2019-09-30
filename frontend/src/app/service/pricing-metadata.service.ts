import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PricingMetadataService {

  constructor(public http: HttpClient) { }
  getConditionTypes(postProcess?): Observable<{ metadataList: any, metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/process_pricing_condition_type?processProfileTypeId=2');
    }
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/process_pricing_condition_typeprocessProfileTypeId=1');
  }

  getConditionParameters(postProcess?): Observable<{ metadataList: any, metadataType: any }> {
    if (postProcess) {
      return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/process_pricing_parameter_type?processProfileTypeId=2');
    }
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/process_pricing_parameter_typeprocessProfileTypeId=1');
  }
}
