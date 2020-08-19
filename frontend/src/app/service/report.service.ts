import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReportSetting } from '../model/report.model';
import { Observable } from 'rxjs';
import { FilterOption } from '../model/vendor.model';
import { Util } from '../util/Util';
import { Pageable } from '../model/order.model';
import { Reports } from '../model/reports.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) {}

  getReportSettings(): Observable<ReportSetting[]> {
    const url = `${environment.apiBaseUrl}/admin/design-reports`;
    return this.http.get<ReportSetting[]>(url);
  }

  updateReportSettings(body: ReportSetting[]): Observable<ReportSetting[]> {
    const url = `${environment.apiBaseUrl}/admin/design-reports/save-update`;
    return this.http.post<ReportSetting[]>(url, body);
  }

  updateReportSettingsById(body: ReportSetting): Observable<ReportSetting> {
    const url = `${environment.apiBaseUrl}/admin/design-reports`;
    return this.http.put<ReportSetting>(url, body);
  }

  deleteReportSettingsById(settingId) {
    const url = `${environment.apiBaseUrl}/admin/design-reports?design-reports-settings-id=${settingId}`;
    return this.http.delete(url);
  }

  getReportList(req: FilterOption, filter): Observable<Pageable<Reports>> {
    const url = `${environment.apiBaseUrl}/part-reports/search-for-admin`;
    return this.http.post<Pageable<Reports>>(url, filter, { params: Util.buildParameters(req) });
  }

  getPartList(reportId: number): Observable<any> {
    const url = `${environment.procurementApiBaseUrl}/part/rfq/${reportId}?generateSignedUrl=true`;
    return this.http.get<any>(url);
  }
}
