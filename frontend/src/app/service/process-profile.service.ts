import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ProfileComparisonModel } from '../model/profile.comparison.model';

@Injectable({
  providedIn: 'root'
})
export class ProcessProfileService {
  constructor(public http: HttpClient) {}

  getAllProfiles(vendorId: number): Observable<any> {
    return this.http.get(environment.managementBaseUrl + `/vendors/${vendorId}/process-profile?processProfileTypeId=1`);
  }

  getProfile(vendorId: number, profileId: string): Observable<any> {
    return this.http.get(
      environment.managementBaseUrl + `/vendors/${vendorId}/process-profile/${profileId}?processProfileTypeId=1`
    );
  }

  updateProfile(vendorId: number, profileId, formData): Observable<any> {
    return this.http.put(environment.managementBaseUrl + `/vendors/${vendorId}/process-profile/${profileId}`, {
      ...formData,
      processProfileType: {
        id: 1
      }
    });
  }

  deleteProfile(vendorId: number, profileId: string): Observable<any> {
    return this.http.delete(
      environment.managementBaseUrl + `/vendors/${vendorId}/process-profile/${profileId}?processProfileTypeId=1`
    );
  }

  saveProfile(vendorId: number, formData): Observable<any> {
    return this.http.post(environment.managementBaseUrl + `/vendors/${vendorId}/process-profile`, {
      ...formData,
      processProfileType: {
        id: 1
      }
    });
  }

  storeCloneData(cloneData: any) {
    localStorage.setItem('dms-processProfileCloneData', JSON.stringify(cloneData));
  }

  getCloneData(): any {
    return JSON.parse(localStorage.getItem('dms-processProfileCloneData'));
  }

  // TODO return model any to specific model
  getScreenProfileComparison(param: ProfileComparisonModel): Observable<any> {
    return this.http.post(environment.PPE_HOST_URL + `/pre-quote/screen-profile-comparison`, param);
  }
}
