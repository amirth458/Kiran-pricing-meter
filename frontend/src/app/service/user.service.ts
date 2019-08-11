import {Injectable} from "@angular/core";
import {ServiceBase} from "../base/service.base";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable()

export class UserService extends ServiceBase {

  constructor(
    public http: HttpClient
  ){
    super(http);
  }

  getHeader(userId:number = 0, roleId:number = 0):HttpHeaders {
    let headers = new HttpHeaders()
      .set('Content-type','application/json')
      .set('userID', userId.toString())
      .set('roleId', roleId.toString());

    return headers;
  }


}
