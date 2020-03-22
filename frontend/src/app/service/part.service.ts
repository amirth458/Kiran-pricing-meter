import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { MetaData } from '../model/metadata.model';
import { map } from '../store';

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
}
