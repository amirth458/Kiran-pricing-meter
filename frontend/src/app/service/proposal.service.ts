import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';
import { UserService } from './user.service';
import { AdminProposalRequest } from '../model/bidding.order';
import { Observable } from 'rxjs';
import { Part } from '../model/part.model';

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

  createAdminProposal(proposal: AdminProposalRequest): Observable<AdminProposalRequest> {
    return this.http.post<AdminProposalRequest>(`${environment.apiBaseUrl}/admin/pm-project/admin-proposal`, proposal);
  }

  deleteAdminProposal(partId: number): Observable<any> {
    return this.http.delete(`${environment.apiBaseUrl}/admin/pm-project/admin-proposal?part-id=${partId}`);
  }

  getAdminProposalPartById(proposalPartId: number): Observable<Part> {
    return this.http.get<Part>(`${environment.apiBaseUrl}/admin/part-proposal/${proposalPartId}`);
  }

  getProposalPartByIds(proposalPartIds: Array<number>): Observable<Array<Part>> {
    return this.http.post<Array<Part>>(`${environment.apiBaseUrl}/admin/part-proposal/list`, proposalPartIds);
  }

  getProposalPartByParentPartId(parentPartId: number): Observable<Part> {
    return this.http.get<Part>(`${environment.apiBaseUrl}/admin/part-proposal/parent-part/${parentPartId}`);
  }

  getProposalPartByParentPartIds(proposalPartIds): Observable<Array<Part>> {
    return this.http.post<Array<Part>>(
      `${environment.apiBaseUrl}/admin/part-proposal/parent-part/list`,
      proposalPartIds
    );
  }
}
