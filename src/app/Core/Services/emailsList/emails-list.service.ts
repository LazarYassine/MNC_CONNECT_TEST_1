// emails-list.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailsListService {
  private apiUrl = 'http://localhost:3000/api/emails-list';

  constructor(private http: HttpClient) { }

  addEmailToList(emailData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, emailData);
  }

  editEmailInList(emailId: number, emailData: any): Observable<any> {
    const url = `${this.apiUrl}/${emailId}`;
    return this.http.put<any>(url, emailData);
  }

  deleteEmailFromList(emailId: number): Observable<any> {
    const url = `${this.apiUrl}/${emailId}`;
    return this.http.delete<any>(url);
  }

  updateStatusOfMultipleEmails(emailIds: number[], isImportant: boolean): Observable<any> {
    const url = `${this.apiUrl}/updateStatus`;
    return this.http.put<any>(url, { emailIds, isImportant });
  }

  exportEmailsToCSV(criteria: any): Observable<any> {
    const url = `${this.apiUrl}/export`;
    return this.http.get<any>(url, { params: criteria });
  }

  searchEmailsByCriteria1(criteria: any): Observable<any> {
    const url = `${this.apiUrl}/search`;
    return this.http.get<any>(url, { params: criteria });
  }

  searchEmailsByCriteria(criteria: any, userId: any): Observable<any> {
    const url = `${this.apiUrl}/search`;
    const params = new HttpParams({
      fromObject: {
        categoryId: criteria.categoryId || '',
        status: criteria.status || '',
        searchTerm: criteria.searchTerm || '',
        page: criteria.page || '1',
        pageSize: criteria.pageSize || '10', // Default page size,
        userId: userId
      }
    });
    return this.http.get<any>(url, { params });
  }

  // Function to insert multiple emails into the list at once
  insertMultipleEmails(emailAddresses: string[], categoryId: number, isImportant: boolean): Observable<any> {
    const payload = {
      emailAddresses,
      categoryId,
      isImportant
    };
    return this.http.post<any>(`${this.apiUrl}/insert-multiple`, payload);
  }

  exportEmailList(criteria: any, userId: any) {
    const body = {
      categoryId: criteria.categoryId || '',
      status: criteria.status || '',
      searchTerm: criteria.searchTerm || '',
      page: criteria.page || '1',
      pageSize: criteria.pageSize || '10', // Default page size
      userId: userId
    };

    const url = `${this.apiUrl}/export-email-list`;
    return this.http.post(url, body, { responseType: 'blob' }); // Set responseType to 'blob' to handle binary data (Excel file)
  }

}
