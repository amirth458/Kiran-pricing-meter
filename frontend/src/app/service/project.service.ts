import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FilterOption } from '../model/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  constructor(public http: HttpClient) {}

  getProjectReleaseQueue(filterOption: FilterOption) {
    const url = `${environment.apiBaseUrl}/admin/part/search`;
    let params = new HttpParams();

    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
      params = params.append('sort', filterOption.sort.toString());
    }

    return this.http.post<any>(
      url,
      {
        statusIds: [15]
      },
      { params }
    );
  }

  getConfirmationQueue(filterOption: FilterOption) {
    const url = `${environment.apiBaseUrl}/admin/bidding/production-project/bid-project/status`;
    let params = new HttpParams();

    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
      params = params.append('sort', filterOption.sort.toString());
    }
    return this.http.post<any>(url, [1], { params });
  }

  getReleasedProjects(filterOption: FilterOption) {
    const url = `${environment.apiBaseUrl}/admin/bidding/production-project/bid-project/status`;
    let params = new HttpParams();

    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
      params = params.append('sort', filterOption.sort.toString());
    }
    return this.http.post<any>(url, [2], { params });
  }
}
