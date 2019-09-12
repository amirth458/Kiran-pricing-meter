import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VendorDetail, FilterOption } from '../model/vendor.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {

  constructor(
    private http: HttpClient
  ) { }

  getVendorDetail(id: number): Observable<VendorDetail> {
    const url = `${environment.apiBaseUrl}/vendors/${id}`;
    return this.http.get<VendorDetail>(url);
  }

  getFacilities(id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${id}/facilities`;
    return this.http.get<any>(url);
  }

  getMachinery(id: number, filterOption: FilterOption = null): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${id}/machinery`;
    let params = new HttpParams();
    if (filterOption) {
        params = params.append('offset', filterOption.offset.toString());
        params = params.append('pageNumber', filterOption.pageNumber.toString());
        params = params.append('pageSize', filterOption.pageSize.toString());
        params = params.append('paged', filterOption.paged.toString());
        params = params.append('sort.sorted', filterOption['sort.sorted'].toString());
        params = params.append('sort.unsorted', filterOption['sort.unsorted'].toString());
        params = params.append('unpaged', filterOption.unpaged.toString());
    }
    return this.http.get<any>(url, {params});
  }
}
