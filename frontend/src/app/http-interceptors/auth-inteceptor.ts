import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localAuthInfo = localStorage.getItem('admin-auth');

    if (!localAuthInfo || req.headers.get('Authorization')) {
      const req1 = req.clone({
        headers: req.headers
      });
      return next.handle(req1);
    }

    const token = JSON.parse(localAuthInfo);
    const req2 = req.clone({
      headers: req.headers
        .set('Authorization', `${token.tokenType} ${token.accessToken}`)
        .set('X-Content-Type-Options', 'nosniff')
        .set('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate')
        .set('Pragma', 'no-cache')
    });
    return next.handle(req2);
  }
}
