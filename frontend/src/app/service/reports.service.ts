import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ReportFilterOptions } from './../model/insight.model';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  constructor(public http: HttpClient) {}

  getCustomerReports(filter: ReportFilterOptions) {
    const url = `${environment.apiBaseUrl}/admin/insight/reports/customer-report`;
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
}
