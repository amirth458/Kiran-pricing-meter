import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilterOption } from '../model/vendor.model';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Machine } from '../model/machine.model';

@Injectable({
  providedIn: 'root'
})
export class MachineService {

  constructor(
    public http: HttpClient
  ) { }

  getMachinery(id: number, filterOption: FilterOption = null): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${id}/machineries`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
      params = params.append('sort', filterOption.sort.toString());
    }
    return this.http.get<any>(url, { params });
  }


  getMachine(vendorId: number, id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/machineries/${id}`;

    return this.http.get(url);
  }

  createMachine(vendorId: number, machine: Machine): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/machineries`;

    return this.http.post(url, machine);
  }

  updateMachine(vendorId: number, id: number, machine: Machine): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/machineries/${id}`;
    return this.http.put(url, machine);
  }

  deleteMachine(vendorId: number, id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/machineries/${id}`;
    return this.http.delete(url);
  }
}
