import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  data: {};
  url: string = environment.apiBaseUrl + '/login';

  constructor(public http: HttpClient) { }


  login(user: string, password: string) {

    const userRequest = JSON.stringify({ userName: user, password });

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'application/json');

    const options = { headers };

    return this.http.post(this.url, userRequest, options);
    // .catch(this.errorHandler);

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

  errorHandler(error: Response) {
    console.error(error);
    return Observable.throw(error || 'Server Error');
  }


  loginTest() {
    return this.http.get(this.url);
    // .map((response: Response) => response.json())
    // .catch(this.errorHandler);
  }
}
