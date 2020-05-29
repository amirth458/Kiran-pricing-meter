import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { FilterOption } from '../model/vendor.model';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  constructor(public http: HttpClient) {}
  getMaterials(filterOption: FilterOption = null): Observable<any> {
    const url = `${environment.managementBaseUrl}/marketplace/material`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
      params = params.append('sort', filterOption.sort.toString());
      params = params.append('q', filterOption.q.toString());
    }
    return this.http.get<any>(url, { params });
  }
}
