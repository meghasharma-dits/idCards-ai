import { Injectable } from '@angular/core';
import {  HttpInterceptorFn } from '@angular/common/http';
import { Observable } from 'rxjs';

// @Injectable()
export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.get('No-Auth') == 'True') {
  return next(req);
}

if (typeof window !== 'undefined') {
  const authToken = localStorage.getItem('authToken');

  if (!authToken) {
  }

  const authReq = req.clone({
    setHeaders: {
      // Authorization: `Bearer ${authToken}`,
      Authorization: 'Basic ' + btoa(`${'admin'}:${'password123'}`),
    },
  });

  return next(authReq);
}
return next(req);
}