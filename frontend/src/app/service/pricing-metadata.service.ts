import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PricingMetadataService {

  constructor(public http: HttpClient) { }
  getConditionTypes(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/process_pricing_condition_type');
  }

  getConditionParameters(): Observable<{ metadataList: any, metadataType: any }> {
    return this.http.get<any>(environment.apiBaseUrl + '/process-metadata/process_pricing_parameter_type');
  }
}