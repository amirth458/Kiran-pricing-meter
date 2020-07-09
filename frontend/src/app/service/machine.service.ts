import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FilterOption } from '../model/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class MachineService {
  constructor(public http: HttpClient) {}

  getMachinery(id: number, filterOption: FilterOption = null): Observable<any> {
    const url = `${environment.managementBaseUrl}/vendors/${id}/machineries`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
      params = params.append('sort', filterOption.sort.toString());
    }
    return this.http.get<any>(url, { params });
  }

  getMachine(vendorId: number, id: number): Observable<any> {
    const url = `${environment.managementBaseUrl}/vendors/${vendorId}/machineries/${id}`;
    return this.http.get(url);
  }

  createMachine(vendorId: number, machine): Observable<any> {
    const url = `${environment.managementBaseUrl}/vendors/${vendorId}/machineries`;
    return this.http.post(url, machine);
  }

  updateMachine(vendorId: number, id: number, machine): Observable<any> {
    const url = `${environment.managementBaseUrl}/vendors/${vendorId}/machineries/${id}`;
    return this.http.put(url, machine);
  }

  deleteMachine(vendorId: number, id: number): Observable<any> {
    const url = `${environment.managementBaseUrl}/vendors/${vendorId}/machineries/${id}`;
    return this.http.delete(url);
  }

  getEquipmentFeatureType(processTypeId): Observable<any> {
    const url = `${environment.managementBaseUrl}/equipment-feature-type/process-type/${processTypeId}`;
    return this.http.get(url);
  }

  getUnits(): Observable<any> {
    const url = `${environment.managementBaseUrl}/process-metadata/measurement_unit_type`;
    return this.http.get(url);
  }

  storeCloneData(cloneData: any) {
    localStorage.setItem('dms-machineCloneData', JSON.stringify(cloneData));
  }

  getCloneData(): any {
    return JSON.parse(localStorage.getItem('dms-machineCloneData'));
  }
}
