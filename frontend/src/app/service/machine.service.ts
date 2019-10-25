import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.get<any>(url, { params,  headers });
  }


  getMachine(vendorId: number, id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/machineries/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.get(url, { headers });
  }

  createMachine(vendorId: number, machine): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/machineries`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.post(url, machine, { headers });
  }

  updateMachine(vendorId: number, id: number, machine): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/machineries/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.put(url, machine, { headers });
  }

  deleteMachine(vendorId: number, id: number): Observable<any> {
    const url = `${environment.apiBaseUrl}/vendors/${vendorId}/machineries/${id}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.delete(url, { headers });
  }

  getEquipmentFeatureType(processTypeId): Observable<any> {
    const url = `${environment.apiBaseUrl}/equipment-feature-type/process-type/${processTypeId}`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.get(url, { headers });
  }

  getUnits(): Observable<any> {
    const url = `${environment.apiBaseUrl}/process-metadata/measurement_unit_type`;
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });
    return this.http.get(url, { headers });
  }

  storeCloneData(cloneData: any) {
    localStorage.setItem('machineCloneData', JSON.stringify(cloneData));
  }

  getCloneData(): any {
    return JSON.parse(localStorage.getItem('machineCloneData'));
  }
}
