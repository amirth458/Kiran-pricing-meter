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

  getFileNameFromPath(filePath: string): string {
    const arrFilePath = filePath.split('/');
    const fileNameWithParam = arrFilePath[arrFilePath.length - 1];
    const pos = fileNameWithParam.toLowerCase().indexOf('.pdf');
    return fileNameWithParam.substring(0, pos + 4);
  }

  getS3URL(filePath: string): string {
    const fileName = this.getFileNameFromPath(filePath);
    return filePath.split(fileName)[0] + fileName;
  }

  fileUpload(userId: number, vendorId: number, certFile: any): Observable < UploadedCertFile > {
    const url = `${environment.apiBaseUrl}/user/${userId}/vendor/${vendorId}/file`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.post<UploadedCertFile>(url, certFile, { headers });
  }

  fileDelete(userId: number, vendorId: number, path: string) {
    const url = `${environment.apiBaseUrl}/user/${userId}/vendor/${vendorId}/file?s3URL=${path}`;
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.delete(url, { headers });
  }
}
