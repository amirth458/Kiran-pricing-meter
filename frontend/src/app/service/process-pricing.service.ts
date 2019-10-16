import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProcessPricingService {

  constructor(public http: HttpClient) { }

  getAllProfiles(vendorId: number): Observable<any> {
    return this.http.get(environment.apiBaseUrl + `/vendors/${vendorId}/process-pricing?processProfileTypeId=1`);
  }

  getProfile(vendorId: number, profileId: string): Observable<any> {
    return this.http.get(environment.apiBaseUrl + `/vendors/${vendorId}/process-pricing/${profileId}?processProfileTypeId=1`);
  }

  updateProfile(vendorId: number, profileId, formData): Observable<any> {
    return this.http.put(environment.apiBaseUrl + `/vendors/${vendorId}/process-pricing/${profileId}`, {
      ...formData, processProfileType: {
        id: 1
      }
    });
  }

  deleteProfile(vendorId: number, profileId: string): Observable<any> {
    return this.http.delete(environment.apiBaseUrl + `/vendors/${vendorId}/process-pricing/${profileId}?processProfileTypeId=1`);
  }

  saveProfile(vendorId: number, formData): Observable<any> {
    return this.http.post(environment.apiBaseUrl + `/vendors/${vendorId}/process-pricing`, {
      ...formData, processProfileType: {
        id: 1
      }
    });
  }

  storeCloneData(cloneData: any) {
    localStorage.setItem('processPriceCloneData', JSON.stringify(cloneData));
  }

  getCloneData(): any {
    return JSON.parse(localStorage.getItem('processPriceCloneData'));
  }
}
