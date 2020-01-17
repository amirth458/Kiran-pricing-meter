import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ColDef } from 'ag-grid-community/src/ts/entities/colDef';

import { of } from 'rxjs';
import { Observable } from 'rxjs';

import { BiddingOrder } from '../model/bidding.order';
import { environment } from 'src/environments/environment';
import { FilterOption } from './../model/vendor.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getSubOrderReleaseQueue(filterOption: FilterOption): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/part/placing-order-status`;
    let params = new HttpParams();
    if (filterOption) {
      params = params.append('page', filterOption.page.toString());
      params = params.append('size', filterOption.size.toString());
    }
    return this.http.get<any>(url, { params });
  }

  getStartedBidOrders(): Observable<Array<BiddingOrder>> {
    return this.http.get<Array<BiddingOrder>>(`${environment.apiBaseUrl}/admin/bidding/started-bid-orders`);
  }

  getPastOrders(filterOption: FilterOption): Observable<any> {
    const data = {
      content: [
        {
          id: 1,
          customerOrder: 234,
          subOrder: '234.1',
          fileName: 'Roter_No_Logo.stl',
          priceAccepted: '$ 334',
          customer: 'CompCo',
          quantity: '30',
          material: 'ABS M30',
          process: '3D Printing',
          postProcess: 'Sanding',
          previouslyOrdered: 'Yes',
          firstShipment: 'Yes',
          deliveryDate: '09/12/2019'
        },
        {
          id: 2,
          customerOrder: 234,
          subOrder: '234.2',
          fileName: 'Roter_No_Logo.stl',
          priceAccepted: '$ 334',
          customer: 'CompCo',
          quantity: '30',
          material: 'ABS M30',
          process: '3D Printing',
          postProcess: 'Sanding',
          previouslyOrdered: 'Yes',
          firstShipment: 'Yes',
          deliveryDate: '09/12/2019'
        },
        {
          id: 3,
          customerOrder: 456,
          subOrder: '456.1',
          fileName: 'Roter_No_Logo.stl',
          priceAccepted: '$ 334',
          customer: 'CompCo',
          quantity: '30',
          material: 'ABS M30',
          process: '3D Printing',
          postProcess: 'Sanding',
          previouslyOrdered: 'Yes',
          firstShipment: 'Yes',
          deliveryDate: '09/12/2019'
        },
        {
          id: 4,
          customerOrder: 456,
          subOrder: '456.4',
          fileName: 'Roter_No_Logo.stl',
          priceAccepted: '$ 334',
          customer: 'CompCo',
          quantity: '30',
          material: 'ABS M30',
          process: '3D Printing',
          postProcess: 'Sanding',
          previouslyOrdered: 'Yes',
          firstShipment: 'Yes',
          deliveryDate: '09/12/2019'
        },
        {
          id: 5,
          customerOrder: 128,
          subOrder: '128.1',
          fileName: 'Roter_No_Logo.stl',
          priceAccepted: '$ 334',
          customer: 'CompCo',
          quantity: '30',
          material: 'ABS M30',
          process: '3D Printing',
          postProcess: 'Sanding',
          previouslyOrdered: 'Yes',
          firstShipment: 'Yes',
          deliveryDate: '09/12/2019'
        }
      ]
    };
    return of(data);
  }

  getReleasedBiddingOrders(): Observable<Array<BiddingOrder>> {
    return this.http.get<Array<BiddingOrder>>(`${environment.apiBaseUrl}/admin/bidding/released-bid-orders`);
  }

  getSubOrderReleaseConfirmation() {
    const url = `${environment.apiBaseUrl}/admin/bidding/sub-order-release-confirmation`;
    return this.http.get<any>(url);
  }

  getFullfillmentSettings(): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/fulfillment-setting`;
    return this.http.get(url);
  }

  setFullfillmentSetting(data): Observable<any> {
    const url = `${environment.apiBaseUrl}/admin/fulfillment-setting`;
    return this.http.put(url, data);
  }

  getMatchedProfiles(userId: number, rfqMediaIds: number[]) {
    if (environment.isTestDataEnabled) {
      userId = 357;
      rfqMediaIds = [159];
    }
    const url = `${environment.apiBaseUrl}/admin/part/matched-profiles`;
    let params = new HttpParams();
    params = params.append('userId', userId.toString());
    params = params.append('rfqMediaIds', rfqMediaIds.join(','));
    return this.http.get<any>(url, { params });
  }

  getOrderViewColumns(): ColDef[] {
    const columns = [
      {
        headerName: 'Vendor Bid',
        field: 'bidOrder.id',
        sortable: true,
        filter: false
      },
      {
        headerName: 'Sub Order Count',
        field: 'subOrderCount',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Offer Price',
        field: 'offerPrice',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Quantity',
        field: 'quantity',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Material',
        field: 'material',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Process',
        field: 'process',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Post-Process',
        field: 'postProcess',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Delivery Date',
        field: 'deliveryDate',
        hide: false,
        sortable: true,
        filter: false
      },
      {
        headerName: 'Status',
        field: 'bidOrder.bidOrderStatusType.description',
        hide: false,
        sortable: true,
        filter: false
      }
    ];
    return columns;
  }
}
