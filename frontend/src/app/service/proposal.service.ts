import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { AdminProposalRequest } from '../model/bidding.order';
import { Observable } from 'rxjs';
import { Part } from '../model/part.model';
import { AdminPartQuote, PartQuoteCustomerView } from '../model/connect.model';
import { Util } from '../util/Util';

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

  updateAdminProposal(proposal: AdminProposalRequest): Observable<AdminProposalRequest> {
    return this.http.put<AdminProposalRequest>(
      `${environment.procurementApiBaseUrl}/part-proposal/admin-proposal`,
      proposal
    );
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

  getAdminPartQuote(partIds: Array<number>): Observable<PartQuoteCustomerView[]> {
    return this.http
      .post<AdminPartQuote[]>(`${environment.apiBaseUrl}/admin/pm-project/admin-proposal/part-quote`, {
        partIds
      })
      .pipe(
        map(quote => {
          const list: PartQuoteCustomerView[] = (quote || []).map((q: AdminPartQuote) => {
            const item: PartQuoteCustomerView = {
              id: q.id,
              partId: q.partId,
              proposalPartId: q.proposalPartId,
              vendorId: q.vendorId,
              isExpired: q.isExpired,
              expiredAt: Util.parseUtcDateTime(q.expiredAt),
              totalCost: q.totalCost,
              partQuoteDetails: q.partQuoteInvoiceItemDetails.map(li => {
                return {
                  partQuoteId: li.invoiceItemId,
                  invoiceItemId: li.invoiceItemId,
                  value: li.invoiceItemCost,
                  unit: li.unit,
                  unitPrice: li.unitPrice
                };
              }),
              winningProcessPricingId: q.winningProcessPricingId,
              matchedProcessPricingIds: q.matchedProcessPricingIds,
              minimumOrderAmount: q.minimumOrderAmount,
              proposalPartQuantity: null,
              proposalDeliveryDate: null,
              quoteCreatedBy: null,
              marginCost: q.marginCost
            };
            return item;
          });
          return list;
        })
      );
  }
}
