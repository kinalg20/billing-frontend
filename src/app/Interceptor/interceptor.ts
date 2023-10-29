import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AppUtility } from '../apputitlity';

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(private apiService: ApiService , private router : Router , private _utility : AppUtility) { }


  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // add auth header with jwt if account is logged in and request is to the api url
    let url = environment.backend_api;
    if ((request.url === url + 'login')) {
      return next.handle(request);
    }

    else {  
      if(localStorage.getItem('billing_token')){
        let token1 : any = localStorage.getItem('billing_token');
          var token: any = JSON.parse(token1);
          const isLoggedIn = (token) ? true : false;
          const isApiUrl = request.url.startsWith(environment.backend_api);
          if (isLoggedIn && isApiUrl) {
            request = request.clone({
              setHeaders: { Authorization: `Bearer ${token.token}` }
            });
          }
      }
      return next.handle(request)
      .pipe(catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            localStorage.removeItem('UserObject');
            this.router.navigate(['/login']);
          }
          if (err.status === 400) {
            // if (Object?.values(err?.error)[0][0]) {
            // //   this.apiService.showMessage(err.error.message || err.statusText , 'error');
            //   this._utility.loader(false);
            // }
            if(err.error) {
            //   this.apiService.showMessage(err.error.message || err.statusText , 'error');
              this._utility.loader(false);
            }
          }
          if (err.status === 500) {
            if (err.error.message == 'Object reference not set to an instance of an object') {
              localStorage.removeItem('UserObject');
              this.router.navigate(['/login']);
            }

            else{
            //   this.apiService.showMessage(err.error.message || err.statusText , 'error');
            }
            this._utility.loader(false);
          }
    
          if(err.status === 415){
            if (err.error) {
            //   this.apiService.showMessage(err.error.message || err.statusText , 'error');
              this._utility.loader(false);
              console.log(err.error);
            }
          }
      return throwError(err);
    }));
    }
  }
}
