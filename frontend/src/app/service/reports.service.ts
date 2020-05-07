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
    const params = new HttpParams();
    params.append('page', filter.page.toString());
    params.append('size', filter.size.toString());
    params.append('sort', filter.sort);
    return this.http.post(
      url,
      { ...filter.filters },
      {
        params: params
      }
    );
  }

  download(type, filter) {
    const url = `${environment.apiBaseUrl}/admin/insight/reports/${type}-report/csv`;
    const params = new HttpParams();
    params.append('sort', filter.sort);
    return this.http.post(
      url,
      { ...filter.filters },
      {
        headers: new HttpHeaders({
          Accept: 'application/octet-stream'
        }),
        responseType: 'arraybuffer',
        params: params
      }
    );
  }
}
