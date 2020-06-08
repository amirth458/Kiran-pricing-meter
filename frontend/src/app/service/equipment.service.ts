import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilterOption } from '../model/vendor.model';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EquipmentService {
  constructor(public http: HttpClient) {}
  getEquipments(filterOption: FilterOption = null): Observable<any> {
    const url = `${environment.managementBaseUrl}/marketplace/equipment`;
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
