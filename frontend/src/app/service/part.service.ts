import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MetaData } from '../model/metadata.model';
import { map, Observable } from '../store';

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

  getProjectReleaseQueue(): Observable<any[]> {
    const url = `${environment.apiBaseUrl}/admin/part/search`;
    return this.http.post<any[]>(url, {
      statusIds: [15]
    });
  }
}
