// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import Swal from 'sweetalert2';
// import { Router } from '@angular/router';

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   constructor(private router: Router) {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = localStorage.getItem('token');

//     // Define routes that do not need token
//     const excludeRoutes = ['/api/users/login', '/api/auth/register'];

//     // Check if the request URL is among excluded routes
//     if (excludeRoutes.some(route => request.url.includes(route))) {
//       // For excluded routes, pass the request without token
//       return next.handle(request);
//     }

//     if (token) {
//       // Check if the token is expired
//       if (this.isTokenExpired(token)) {
//          // Handle unauthorized or forbidden errors
//          Swal.fire({
//           icon: 'error',
//           title: 'Session Expired',
//           text: 'Your session has expired. Please log in again.',
//         });           
//         localStorage.removeItem('token');
//         localStorage.removeItem('crnt_cmp');
//         this.router.navigateByUrl("/auth/login");
//         return throwError('Token expired');
//       }

//       const modifiedRequest = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });

//       return next.handle(modifiedRequest).pipe(
//         catchError((error: HttpErrorResponse) => {
//           if (error.status === 401 || error.status === 403) {
//             // Handle unauthorized or forbidden errors
//             Swal.fire({
//               icon: 'error',
//               title: 'Session Expired',
//               text: 'Your session has expired. Please log in again.',
//             });           
//             localStorage.removeItem('token');
//             localStorage.removeItem('crnt_cmp');
//             this.router.navigateByUrl("/auth/login");
//           }
//           return throwError(error);
//         })
//       );
//     } else {
//       return next.handle(request);
//     }
//   }

//   // Example method to check if token is expired (you need to implement your own logic)
//   private isTokenExpired(token: string): boolean {
//     const expirationDate = new Date(); // Example: always return current date for demonstration
//     const currentDate = new Date();
//     if (expirationDate < currentDate) {
//       return true; // Token is expired
//     }
//     return false; // Token is not expired
//   }
// }

// import { Injectable } from '@angular/core';
// import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import Swal from 'sweetalert2';
// import { Router, ActivatedRoute } from '@angular/router';
// import jwt_decode from 'jwt-decode';
// import * as jwt from 'jsonwebtoken'; // Import jsonwebtoken library

// import {environment} from '../../../environments/environment'

// @Injectable()
// export class TokenInterceptor implements HttpInterceptor {
//   constructor(private router: Router, private activatedRoute: ActivatedRoute) {}

//   intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//     const token = localStorage.getItem('token');

//     // Define routes that do not need token
//     const excludeRoutes = ['/api/users/login', '/api/auth/register'];

//     // Check if the request URL is among excluded routes
//     if (excludeRoutes.some(route => request.url.includes(route))) {
//       // For excluded routes, pass the request without token
//       return next.handle(request);
//     }

//     // Check if the current route is cmp-profile with a dynamic UUID
//     if (this.isCmpProfileRoute()) {
//       // Generate a secure internal token specifically for cmp-profile route
//       const internalToken = this.generateInternalToken();
//       // Attach the internal token to the request headers
//       request = request.clone({
//         setHeaders: {
//           'X-Internal-Token': internalToken
//         }
//       });
//     } else if (token) {
//       // Check if the token is expired
//       if (this.isTokenExpired(token)) {
//          // Handle unauthorized or forbidden errors
//          Swal.fire({
//           icon: 'error',
//           title: 'Session Expired',
//           text: 'Your session has expired. Please log in again.',
//         });           
//         localStorage.removeItem('token');
//         localStorage.removeItem('crnt_cmp');
//         this.router.navigateByUrl("/auth/login");
//         return throwError('Token expired');
//       }

//       // Attach the user's token to the request headers
//       request = request.clone({
//         setHeaders: {
//           Authorization: `Bearer ${token}`
//         }
//       });
//     }

//     return next.handle(request).pipe(
//       catchError((error: HttpErrorResponse) => {
//         if (error.status === 401 || error.status === 403) {
//           // Handle unauthorized or forbidden errors
//           Swal.fire({
//             icon: 'error',
//             title: 'Session Expired',
//             text: 'Your session has expired. Please log in again.',
//           });           
//           localStorage.removeItem('token');
//           localStorage.removeItem('crnt_cmp');
//           this.router.navigateByUrl("/auth/login");
//         }
//         return throwError(error);
//       })
//     );
//   }

//   // Example method to check if token is expired (you need to implement your own logic)
//   private isTokenExpired(token: string): boolean {
//     const expirationDate = new Date(); // Example: always return current date for demonstration
//     const currentDate = new Date();
//     if (expirationDate < currentDate) {
//       return true; // Token is expired
//     }
//     return false; // Token is not expired
//   }

//   // Method to check if the active route is cmp-profile with a dynamic UUID
//   private isCmpProfileRoute(): boolean {
//     const currentUrl = this.router.url;
//     return currentUrl.includes('cmp-profile');
//   }

//   // Method to generate a secure internal token for cmp-profile route
//   private generateInternalToken(): string {
//     // Define payload with custom claim
//     const payload = {
//       purpose: 'shared-profile'
//       // Add more custom claims if needed
//     };
    
//     // Generate a secure internal token with a secret key known only to your server
//     const internalToken = jwt.sign(payload, "227a10f4904d1776d0f347fc869c41553ac1c95ae76d045d3d982ed4af70a904", { expiresIn: '1h' }); // Adjust expiresIn as needed
//     return internalToken;
//   }
// }

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token');

    // Define routes that do not need token
    const excludeRoutes = ['/api/users/login', '/api/auth/register'];

    // Check if the request URL is among excluded routes
    if (excludeRoutes.some(route => request.url.includes(route))) {
      // For excluded routes, pass the request without token
      return next.handle(request);
    }

    // Check if the current route is cmp-profile with a dynamic UUID
    if (this.isCmpProfileRoute()) {
      // Attach a special header indicating that this is a shared profile request
      request = request.clone({
        setHeaders: {
          'X-Shared-Profile': 'true'
        }
      });
    } else if (token) {
      // Check if the token is expired
      if (this.isTokenExpired(token)) {
         // Handle unauthorized or forbidden errors
         Swal.fire({
          icon: 'error',
          title: 'Session Expired',
          text: 'Your session has expired. Please log in again.',
        });           
        localStorage.removeItem('token');
        localStorage.removeItem('crnt_cmp');
        this.router.navigateByUrl("/auth/login");
        return throwError('Token expired');
      }

      // Attach the user's token to the request headers
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          // Handle unauthorized or forbidden errors
          Swal.fire({
            icon: 'error',
            title: 'Session Expired',
            text: 'Your session has expired. Please log in again.',
          });           
          localStorage.removeItem('token');
          localStorage.removeItem('crnt_cmp');
          this.router.navigateByUrl("/auth/login");
        }
        return throwError(error);
      })
    );
  }

  // Example method to check if token is expired (you need to implement your own logic)
  private isTokenExpired(token: string): boolean {
    const expirationDate = new Date(); // Example: always return current date for demonstration
    const currentDate = new Date();
    if (expirationDate < currentDate) {
      return true; // Token is expired
    }
    return false; // Token is not expired
  }

  // Method to check if the active route is cmp-profile with a dynamic UUID
  private isCmpProfileRoute(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('cmp-profile');
  }
}
