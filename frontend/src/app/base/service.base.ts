import {Headers} from "@angular/http";
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs/Observable";

export class ServiceBase {

  constructor(
    public http: HttpClient
  ){

  }

  errorHandler(error: Response){
    console.error(error);
    return Observable.throw(error || "Server Error");
  }

  getConversationHeader(userID:number):HttpHeaders {

    let headers = new HttpHeaders()
      .set('Content-type','application/json')
      .set('userID', userID.toString());

    return headers;
  }

}
