import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcessProfileService {

  constructor(public http: HttpClient) { }

  getAllProfiles(vendorId: number): Observable<any> {
    return this.http.get(environment.apiBaseUrl + `/vendors/${vendorId}/process-profile?processProfileTypeId=1`);
  }

  getProfile(vendorId: number, profileId: string): Observable<any> {
    return this.http.get(environment.apiBaseUrl + `/vendors/${vendorId}/process-profile/${profileId}?processProfileTypeId=1`);
  }

  updateProfile(vendorId: number, profileId, formData): Observable<any> {
    return this.http.put(environment.apiBaseUrl + `/vendors/${vendorId}/process-profile/${profileId}`, {
      ...formData, processProfileType: {
        id: 1
      }
    });
  }

  deleteProfile(vendorId: number, profileId: string): Observable<any> {
    return this.http.delete(environment.apiBaseUrl + `/vendors/${vendorId}/process-profile/${profileId}?processProfileTypeId=1`);
  }

  saveProfile(vendorId: number, formData): Observable<any> {
    return this.http.post(environment.apiBaseUrl + `/vendors/${vendorId}/process-profile`, {
      ...formData, processProfileType: {
        id: 1
      }
    });
  }
}
