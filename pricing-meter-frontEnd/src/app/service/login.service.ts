import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public isUserLoggedIn = new BehaviorSubject(false);

  constructor() {
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('login');
  }
}
