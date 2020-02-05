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
  url: string = environment.managementBaseUrl + '/auth/signin';

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
    localStorage.setItem('admin-auth', JSON.stringify(data));
  }

  getAuthData() {
    return JSON.parse(localStorage.getItem('admin-auth'));
  }

  logout(): any {
    localStorage.removeItem('admin-auth');
    localStorage.removeItem('admin-remember_me');
    localStorage.removeItem('admin-email');
    localStorage.removeItem('admin-password');
    localStorage.removeItem('admin-user');

    this.store.dispatch({
      type: AppTypes.UpdateState,
      payload: {
        [AppFields.VendorInfo]: null
      }
    });
  }

  getProfile(): any {
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });

    const url = `${environment.managementBaseUrl}/auth/user/me`;
    return this.http.get(url, {
      headers
    });
  }

  getVendor(): any {
    const data = JSON.parse(localStorage.getItem('admin-auth'));
    const headers = new HttpHeaders({
      Authorization: data.tokenType + ' ' + data.accessToken
    });

    const url = `${environment.managementBaseUrl}/vendors`;
    return this.http.get(url, {
      headers
    });
  }

  isLoggedIn(): boolean {
    const data = JSON.parse(localStorage.getItem('admin-auth'));
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
