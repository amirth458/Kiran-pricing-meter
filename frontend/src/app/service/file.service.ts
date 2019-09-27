import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UploadedCertFile } from '../model/uploadedCertFile';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FileService {

  constructor(public http: HttpClient, public route: Router) { }

  fileUpload(userId: number, vendorId: number, certFile: any): Observable < UploadedCertFile > {
    const url = `${environment.apiBaseUrl}/user/${userId}/vendor/${vendorId}/file`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.post<UploadedCertFile>(url, certFile, { headers });
  }
}
