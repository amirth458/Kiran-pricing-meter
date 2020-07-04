import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { MetaData } from '../model/metadata.model';
import { Part, ProjectProfile } from '../model/part.model';

@Injectable({
  providedIn: 'root'
})
export class PartService {
  constructor(public http: HttpClient) {}

  getPartStatusType() {
    return this.http
      .get<MetaData[]>(environment.apiBaseUrl + '/admin/metadata/partstatus')
      .pipe(map((res: any) => res.metadataList || []));
  }

  getPartsById(partId: number[]): Observable<Part[]> {
    return this.http.get<Part[]>(environment.procurementApiBaseUrl + '/part?ids=' + partId.join(','));
  }

  getPartsByRfqId(rfqId: number): Observable<any> {
    return this.http
      .get<any>(`${environment.apiBaseUrl}/admin/part/rfq/${rfqId}?generateSignedUrl=true`)
      .pipe(
        map(_ => [
          ...(_.parts || []).map(_ => new Object({ ..._, proposalPart: false })),
          ...(_.proposalParts || []).map(_ => new Object({ ..._, proposalPart: true }))
        ])
      );
  }

  getPartsByRfq(rfqId: number): Observable<any> {
    return this.http.get<any>(`${environment.procurementApiBaseUrl}/part/rfq/${rfqId}`);
  }

  getPartByPartId(partId: number): Observable<Part> {
    return this.http.get<any>(`${environment.procurementApiBaseUrl}/part/${partId}?generateSignedUrl=true`);
  }

  getProjectProfileByOrderId(orderId: number): Observable<ProjectProfile[]> {
    return this.http.get<ProjectProfile[]>(`${environment.procurementApiBaseUrl}/project-profile/order/${orderId}`);
  }
}
