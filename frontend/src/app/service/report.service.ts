import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ReportSetting } from '../model/report.model';
import { Observable } from 'rxjs';

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
}
