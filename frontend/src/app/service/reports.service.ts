import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { ReportFilterOptions } from './../model/insight.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(public http: HttpClient) {}

  getReports(type, filter) {
    const url = `${environment.apiBaseUrl}/admin/insight/reports/${type}-report`;
    let params = new HttpParams();
    params = params.append('page', filter.page.toString());
    params = params.append('size', filter.size.toString());
    if (filter.sort) {
      params = params.append('sort', filter.sort);
    }
    return this.http.post(
      url,
      { ...filter.filters },
      {
        params
      }
    );
  }

  download(type, filter, uploadToZoho = false) {
    const url = `${environment.apiBaseUrl}/admin/insight/reports/${type}-report/csv`;
    let params = new HttpParams();
    if (filter.sort) {
      params = params.append('sort', filter.sort);
    }
    params = params.append('upload_to_zoho', uploadToZoho.toString());
    let options = {
      params,
      headers: new HttpHeaders({
        Accept: `application/${uploadToZoho ? 'json' : 'octet-stream'}`
      })
    };
    if (!uploadToZoho) {
      options = {
        ...options,
        ...{
          responseType: 'arraybuffer'
        }
      };
    }
    return this.http.post(url, { ...filter.filters }, options);
  }
}
