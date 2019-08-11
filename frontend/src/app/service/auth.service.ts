import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../model/user.model';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import {environment} from "../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";


@Injectable()
export class AuthService {

  constructor(
    private _http: HttpClient
  ){

  }

  data: Object;
  private _url: string = environment.serviceurl + "/login";


  login(user: string, password: string)
  {

    let userRequest = JSON.stringify(
      { "userName": user, "password": password }
    )

    let headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    let options = { headers: headers };

    return this._http.post(this._url,userRequest, options)
      .catch(this.errorHandler);

  }

  logout(): any {
    localStorage.removeItem('username');
  }

  getUser(): any {
    return localStorage.getItem('username');
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }

  errorHandler(error: Response){
    console.error(error);
    return Observable.throw(error || "Server Error");
  }


  loginTest(){
    return this._http.get(this._url)
      .map((response:Response) => response.json())
      .catch(this.errorHandler);
  }
}

export const AUTH_PROVIDERS: Array<any> = [
  { provide: AuthService, useClass: AuthService }
];
