import { of } from "rxjs";
import { Observable } from "rxjs";
import { FilterOption } from "./../model/vendor.model";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class OrdersService {
  constructor(private http: HttpClient) {}

  getSubOrderReleaseQueue(filterOption: FilterOption): Observable<any> {
    const data = {
      content: [
        {
          id: 1,
          customerOrder: 234,
          subOrder: "234.1",
          fileName: 'Roter_No_Logo.stl',
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
          fileName: 'Roter_No_Logo.stl',
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
          fileName: 'Roter_No_Logo.stl',
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
          fileName: 'Roter_No_Logo.stl',
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
          fileName: 'Roter_No_Logo.stl',
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
          fileName: 'Roter_No_Logo.stl',
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
          fileName: 'Roter_No_Logo.stl',
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
          fileName: 'Roter_No_Logo.stl',
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
          fileName: 'Roter_No_Logo.stl',
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
          fileName: 'Roter_No_Logo.stl',
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
          nda: 'Yes',
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
          nda: 'Yes',
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
          nda: 'Yes',
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
          nda: 'Yes',
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
          nda: 'Yes',
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
          nda: 'Yes',
          deliveryDate: "09/12/2019"
        }
      ]
    };
    return of(data);
  }

}
