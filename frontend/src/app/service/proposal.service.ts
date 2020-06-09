import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  constructor(public http: HttpClient) {}

  getCustomerGovernanceMedia(partId: number) {
    const url = `${environment.apiBaseUrl}/admin/project-governance-media/parts/${partId}/from-project-profile?generateSignedUrl=true`;
    return this.http.get(url);
  }

  getCustomerGovernanceMediaCount(partId: number) {
    const url = `${environment.apiBaseUrl}/admin/project-governance-media/parts/${partId}/count/from-project-profile`;
    return this.http.get(url);
  }
}
