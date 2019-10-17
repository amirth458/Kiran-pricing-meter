import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ConnectorService {

  constructor(public http: HttpClient, public route: Router) { }

  fileUploadForProcessScreener(file: File): Observable<any> {
    const url = `${environment.CONNECTOR_HOST_URL}/connector/upload-file`;

    const formData: FormData = new FormData();
    formData.append('file', file, file.name);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
    });
    return this.http.post<any>(url, formData, { headers });
  }

  getMetaDataForProcessScreener(id: number) {
    const url = `${environment.apiBaseUrl}/connector/metadata/${id}`;
    return this.http.get<any>(url);
  }
}
