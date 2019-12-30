import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map } from 'rxjs/operators';
import { Observable } from "rxjs";

import { environment } from "src/environments/environment";
import { MetaData } from './../model/metadata.model';

@Injectable({
  providedIn: "root"
})
export class MetadataService {
  constructor(public http: HttpClient) {}

  getMetaData(type: string): Observable<MetaData[]> {
    const url = `${environment.procurementApiBaseUrl}/metadata/${type}`;
    return this.http.get<any>(url).pipe(map(res => res.metadataList));
  }
  getProcessMetaData(type: string) : Observable<MetaData[]> {
    const url = `${environment.managementBaseUrl}/process-metadata/${type}`;
    return this.http.get<any>(url).pipe(map(res => res.metadataList));
  }
}
