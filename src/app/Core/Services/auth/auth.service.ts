import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:3000/api/auth'; // Assuming your backend server is running locally on port 3000
  private tokenKey: any = "token";

  constructor(private http: HttpClient) { }

  loginUser(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }
  
  logout(): void {
    // Clear the token from local storage
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    // Check if the token exists in local storage
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    // Retrieve the token from local storage
    return localStorage.getItem(this.tokenKey);
  }

  // Function to retrieve user ID from JWT token
getUserIdFromToken(): string | null {
  try {
      const decoded: any = jwtDecode(<any>localStorage.getItem(this.tokenKey));
      return decoded.userId; // Assuming the user ID is stored in the 'userId' claim
  } catch (error) {
      console.error('Error decoding JWT token:', error);
      return null;
  }
}

}
