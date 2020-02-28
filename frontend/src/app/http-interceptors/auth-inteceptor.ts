import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const localAuthInfo = localStorage.getItem('admin-auth'); // you probably want to store it in localStorage or something

    if (!localAuthInfo) {
      const req1 = req.clone({
        headers: req.headers
          .set('Content-Type', 'application/json; charset=utf-8')
          .set('X-Content-Type-Options', 'nosniff')
      });
      return next.handle(req1);
    }

    const token = JSON.parse(localAuthInfo);
    const req2 = req.clone({
      headers: req.headers
        .set('Authorization', `${token.tokenType} ${token.accessToken}`)
        .set('Content-Type', 'application/json; charset=utf-8')
        .set('X-Content-Type-Options', 'nosniff')
    });
    return next.handle(req2);
  }
}
