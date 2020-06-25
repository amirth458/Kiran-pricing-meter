import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  constructor(public http: HttpClient) {}

  // TODO:
  getVendorGovernanceMedia(partId: number) {
    const url = `${environment.managementBaseUrl}/project-governance-media/parts/${partId}/from-part?generateSignedUrl=true`;
    return this.http.get(url);
  }

  getCustomerGovernanceMedia(partId: number) {
    const url = `${environment.apiBaseUrl}/admin/project-governance-media/parts/${partId}/from-project-profile?generateSignedUrl=true`;
    return this.http.get(url);
  }

  getProjectGovernanceDediaForPartProposal(partId: number, proposalPartId: number, vendorId) {
    const url = `${environment.apiBaseUrl}/admin/project-governance-media/parts/${partId}/proposal-part/${proposalPartId}?vendor-id=${vendorId}&generateSignedUrl=true`;
    return this.http.get(url);
  }

  getCustomerGovernanceMediaCount(partId: number) {
    const url = `${environment.apiBaseUrl}/admin/project-governance-media/parts/${partId}/count/from-project-profile`;
    return this.http.get(url);
  }
  // TODO:
  getVendorGovernanceMediaCount(partId: number) {
    const url = `${environment.managementBaseUrl}/project-governance-media/parts/${partId}/count/from-part`;
    return this.http.get(url);
  }

  // TODO:
  getProjectGovernanceDediaForPartProposalCount(partId: number) {
    const url = `${environment.managementBaseUrl}/project-governance-media/parts/${partId}/proposal-part/:proposal-part-id/count`;
    return this.http.get(url);
  }
}
