import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from "@angular/common/http";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const localAuthInfo = localStorage.getItem("admin-auth"); // you probably want to store it in localStorage or something

    console.log("Auth Interceptor");

    if (!localAuthInfo) {
      return next.handle(req);
    }

    const token = JSON.parse(localAuthInfo);
    const req1 = req.clone({
      headers: req.headers.set(
        "Authorization",
        `${token.tokenType} ${token.accessToken}`
      )
    });

    return next.handle(req1);
  }
}
