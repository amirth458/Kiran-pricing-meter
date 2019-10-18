import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileScreenerService {

  constructor(public http: HttpClient) { }

  screenProfiles(vendorId: number, body): Observable<any> {
    const fakeBody = {
      userId: null,
      profileTypeId: null,
      requiredCertificateId: 1,
      materialId: 1,
      equipmentId: 1,
      confidentialityId: 1,


      customerIndustryId: 1,
      deliveryStatementId: 1,
      tolerance: 1,
      surfaceRoughness: 1,
      surfaceFinish: 1
    };
    return this.http.post(environment.PPE_HOST_URL + '/profile', { ...body, userId: vendorId });
    // return this.http.post(environment.PPE_HOST_URL + '/profile', { ...fakeBody });
  }

  estimatePrice(vendorId: number, body): Observable<any> {
    const fakeBody = {
      userId: 1,
      profileTypeId: 1,
      customerIndustryId: 1,
      requiredCertificateId: 1,
      materialId: 1,
      equipmentId: 1,
      deliveryStatementId: 1,
      nda: false,
      tolerance: 1,
      surfaceRoughness: 1,
      surfaceFinish: 1,
      processProfileIdList: [
        1, 2
      ]
    };
    return this.http.post(environment.PPE_HOST_URL + '/profile', { ...body, userId: vendorId });
    // return this.http.post(environment.PPE_HOST_URL + '/pre-quote', { ...fakeBody });
  }

}
