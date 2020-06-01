import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MetaData } from '../model/metadata.model';
import { map, Observable } from '../store';
import { Part } from '../model/part.model';

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
}
