import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { Store, AppTypes, AppFields } from '../store';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  data: {};
  url: string = environment.apiBaseUrl + '/auth/signin';

  constructor(
    public http: HttpClient,
    private store: Store<any>
  ) {}


  login(user: string, password: string) {

    const userRequest = {
      email: user,
      password
    };

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const options = {
      headers
    };

    return this.http.post(this.url, userRequest, options);
    // .catch(this.errorHandler);

  }

  setAuthData(data) {
    localStorage.setItem('auth', JSON.stringify(data));
  }

  getAuthData() {
    return JSON.parse(localStorage.getItem('auth'));
  }
  logout(): any {
    localStorage.removeItem('auth');
    localStorage.removeItem('remember_me');
    localStorage.removeItem('email');
    localStorage.removeItem('password');

    this.store.dispatch({
      type: AppTypes.UpdateState,
      payload: {
        [AppFields.VendorInfo]: null
      }
    });
  }

  getProfile(): any {
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });

    const url = `${environment.apiBaseUrl}/auth/user/me`;
    return this.http.get(url, {
      headers
    });
  }

  getVendor(): any {
    const data = JSON.parse(localStorage.getItem('auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });

    const url = `${environment.apiBaseUrl}/vendors`;
    return this.http.get(url, {
      headers
    });
  }

  isLoggedIn(): boolean {
    const data = JSON.parse(localStorage.getItem('auth'));
    if (data) {
      const expireDate = new Date(data.expiryDate);
      const now = new Date();
      if (now > expireDate) {
        return false;
      }
      return true;
    }
    return false;
  }

  errorHandler(error: Response) {
    console.error(error);
    return throwError(error || 'Server Error');
  }


  loginTest() {
    return this.http.get(this.url);
    // .map((response: Response) => response.json())
    // .catch(this.errorHandler);
  }
}
