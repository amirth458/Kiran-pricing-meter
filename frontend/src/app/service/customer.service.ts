import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

import { environment } from "../../environments/environment";
import { CustomerData } from "./../model/user.model";

@Injectable({
  providedIn: "root"
})
export class CustomerService {
  constructor(public http: HttpClient) {}

  getCustomer(): Observable<CustomerData> {
    const data = JSON.parse(localStorage.getItem("dms-auth"));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + " " + data.accessToken,
      "Content-Type": "application/json"
    });
    const url = `${environment.procurementApiBaseUrl}/customer`;
    return this.http.get<CustomerData>(url, { headers });
  }
}
