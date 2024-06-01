import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private baseUrl = 'http://localhost:3000/api/users'; // Assuming your backend server is running locally on port 3000

  constructor(private http: HttpClient) { }

  registerUser(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { username, email, password });
  }

  getUserById(userId: any){
    return this.http.get(`${this.baseUrl}/${userId}`);
  }

  getUserSubscriptionDetailsByUserId(userId: any){
    return this.http.get(`${this.baseUrl}/subscription-details/${userId}`);
  }

  updateUser(reqBody: any){
    return this.http.put(`${this.baseUrl}/update-user`, reqBody);
  }

}
