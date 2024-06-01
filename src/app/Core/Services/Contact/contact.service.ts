import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:3000/api/contacts';

  constructor(private http: HttpClient) { }

  createContact(contactData: any, companyUUID: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+"/"+companyUUID, contactData);
  }

  getAllContacts(companyUUID: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl + "/" + companyUUID);
  }

  getContactById(contactId: number): Observable<any> {
    const url = `${this.apiUrl}/${contactId}`;
    return this.http.get<any>(url);
  }

  updateContact(contactId: number, contactData: any): Observable<any> {
    const url = `${this.apiUrl}/${contactId}`;
    return this.http.put<any>(url, contactData);
  }

  deleteContact(contactId: number): Observable<any> {
    const url = `${this.apiUrl}/${contactId}`;
    return this.http.delete<any>(url);
  }
}
