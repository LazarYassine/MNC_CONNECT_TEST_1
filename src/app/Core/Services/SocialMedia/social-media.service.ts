import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocialMediaService {
  private baseUrl = 'http://localhost:3000/api/social-media-accounts'; // Update the base URL according to your backend API

  constructor(private http: HttpClient) { }

  createSocialMediaAccount(companyUUID: string, accountData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${companyUUID}`, accountData);
  }

  getAllSocialMediaAccounts(companyUUID: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${companyUUID}`);
  }

  getSocialMediaAccountById(companyUUID: string, accountId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${companyUUID}/${accountId}`);
  }

  updateSocialMediaAccount(companyUUID: string, accountId: string, accountData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${companyUUID}/${accountId}`, accountData);
  }

  deleteSocialMediaAccount(companyUUID: string, accountId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${companyUUID}/${accountId}`);
  }
}
