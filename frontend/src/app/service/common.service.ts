import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { MetaData } from '../model/metadata.model';
import { Part, ProjectProfile } from '../model/part.model';
import { IdCollection } from '../model/id-collection.model';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  constructor(public http: HttpClient) {}

  getVariousIdCollection(inputId: any): Observable<IdCollection[]> {
    return this.http.post<IdCollection[]>(environment.apiBaseUrl + '/admin/common/ids', inputId);
  }
}
