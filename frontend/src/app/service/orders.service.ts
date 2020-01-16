import { of } from "rxjs";
import { Observable } from "rxjs";
import { FilterOption } from "./../model/vendor.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
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

  getOrderConfirmationQueue(filterOption: FilterOption): Observable<any> {
    const data = {
      content: [
        {
          id: 1,
          vendorOrderId: "555",
          customerOrder: 2,
          subOrder: 2,
          priceAccepted: "$ 614",
          quantity: "74",
          material: "ABS M30",
          process: "3D Printing",
          postProcess: "Sanding",
          deliveryDate: "09/12/2019",
          status: "Bidding In Progress"
        },
        {
          id: 2,
          vendorOrderId: "555",
          customerOrder: 234,
          subOrder: "234.2",
          priceAccepted: 334,
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          process: "3D Printing",
          postProcess: "Sanding",
          previouslyOrdered: "Yes",
          firstShipment: "Yes",
          deliveryDate: "09/12/2019"
        },
        {
          id: 3,
          vendorOrderId: "555",
          customerOrder: 4556,
          subOrder: "456.2",
          priceAccepted: 334,
          customer: "CompCo",
          quantity: "44",
          material: "ABS M30",
          process: "3D Printing",
          postProcess: "Sanding",
          previouslyOrdered: "Yes",
          firstShipment: "Yes",
          deliveryDate: "09/12/2019"
        },
        {
          id: 4,
          vendorOrderId: "7889",
          customerOrder: 456,
          subOrder: "456.1",
          priceAccepted: 334,
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          process: "3D Printing",
          postProcess: "Sanding",
          deliveryDate: "09/12/2019"
        },
        {
          id: 5,
          vendorOrderId: "7889",
          customerOrder: 456,
          subOrder: "456.4",
          priceAccepted: 334,
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          process: "3D Printing",
          postProcess: "Sanding",
          deliveryDate: "09/12/2019"
        },
        {
          id: 6,
          vendorOrderId: "1345",
          customerOrder: 128,
          subOrder: "128.1",
          priceAccepted: 334,
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          process: "3D Printing",
          postProcess: "Sanding",
          deliveryDate: "09/12/2019"
        }
      ]
    };
    return of(data);
  }

  getPastOrders(filterOption: FilterOption): Observable<any> {
    const data = {
      content: [
        {
          id: 1,
          customerOrder: 234,
          subOrder: "234.1",
          fileName: "Roter_No_Logo.stl",
          priceAccepted: "$ 334",
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          process: "3D Printing",
          postProcess: "Sanding",
          previouslyOrdered: "Yes",
          firstShipment: "Yes",
          deliveryDate: "09/12/2019"
        },
        {
          id: 2,
          customerOrder: 234,
          subOrder: "234.2",
          fileName: "Roter_No_Logo.stl",
          priceAccepted: "$ 334",
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          process: "3D Printing",
          postProcess: "Sanding",
          previouslyOrdered: "Yes",
          firstShipment: "Yes",
          deliveryDate: "09/12/2019"
        },
        {
          id: 3,
          customerOrder: 456,
          subOrder: "456.1",
          fileName: "Roter_No_Logo.stl",
          priceAccepted: "$ 334",
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          process: "3D Printing",
          postProcess: "Sanding",
          previouslyOrdered: "Yes",
          firstShipment: "Yes",
          deliveryDate: "09/12/2019"
        },
        {
          id: 4,
          customerOrder: 456,
          subOrder: "456.4",
          fileName: "Roter_No_Logo.stl",
          priceAccepted: "$ 334",
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          process: "3D Printing",
          postProcess: "Sanding",
          previouslyOrdered: "Yes",
          firstShipment: "Yes",
          deliveryDate: "09/12/2019"
        },
        {
          id: 5,
          customerOrder: 128,
          subOrder: "128.1",
          fileName: "Roter_No_Logo.stl",
          priceAccepted: "$ 334",
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          process: "3D Printing",
          postProcess: "Sanding",
          previouslyOrdered: "Yes",
          firstShipment: "Yes",
          deliveryDate: "09/12/2019"
        }
      ]
    };
    return of(data);
  }

  getReleasedOrders(filterOption: FilterOption): Observable<any> {
    const data = {
      content: [
        {
          id: 1,
          vendorOrderId: "555",
          customerOrder: 2,
          subOrder: 2,
          priceAccepted: "$ 614",
          quantity: "74",
          material: "ABS M30",
          equipment: "Fortus 450",
          postProcess: "Sanding",
          nda: "Yes",
          deliveryDate: "09/12/2019",
          status: "Bidding In Progress"
        },
        {
          id: 2,
          vendorOrderId: "555",
          customerOrder: 234,
          subOrder: "234.2",
          priceAccepted: 334,
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          equipment: "Fortus 450",
          postProcess: "Sanding",
          nda: "Yes",
          previouslyOrdered: "Yes",
          firstShipment: "Yes",
          deliveryDate: "09/12/2019"
        },
        {
          id: 3,
          vendorOrderId: "555",
          customerOrder: 4556,
          subOrder: "456.2",
          priceAccepted: 334,
          customer: "CompCo",
          quantity: "44",
          material: "ABS M30",
          equipment: "Fortus 450",
          postProcess: "Sanding",
          nda: "Yes",
          previouslyOrdered: "Yes",
          firstShipment: "Yes",
          deliveryDate: "09/12/2019"
        },
        {
          id: 4,
          vendorOrderId: "7889",
          customerOrder: 456,
          subOrder: "456.1",
          priceAccepted: 334,
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          equipment: "Fortus 450",
          postProcess: "Sanding",
          nda: "Yes",
          deliveryDate: "09/12/2019"
        },
        {
          id: 5,
          vendorOrderId: "7889",
          customerOrder: 456,
          subOrder: "456.4",
          priceAccepted: 334,
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          equipment: "Fortus 450",
          postProcess: "Sanding",
          nda: "Yes",
          deliveryDate: "09/12/2019"
        },
        {
          id: 6,
          vendorOrderId: "1345",
          customerOrder: 128,
          subOrder: "128.1",
          priceAccepted: 334,
          customer: "CompCo",
          quantity: "30",
          material: "ABS M30",
          equipment: "Fortus 450",
          postProcess: "Sanding",
          nda: "Yes",
          deliveryDate: "09/12/2019"
        }
      ]
    };
    return of(data);
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
    const data = JSON.parse(localStorage.getItem("auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });

    let params = new HttpParams();
    params = params.append("userId", userId.toString());
    params = params.append("rfqMediaIds", rfqMediaIds.join(','));

    return this.http.get<any>(url, { headers, params });
  }
}
