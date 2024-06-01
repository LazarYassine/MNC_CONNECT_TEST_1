import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:3000/api/services';

  constructor(private http: HttpClient) { }

  // Method to create a new service for a company
  createService(companyUUID: string, serviceData: any): Observable<any> {
    const url = `${this.apiUrl}/${companyUUID}`;
    return this.http.post<any>(url, serviceData);
  }

  // Method to get all services for a company
  getAllServices(companyUUID: string): Observable<any[]> {
    const url = `${this.apiUrl}/${companyUUID}`;
    return this.http.get<any[]>(url);
  }

  // Method to get a service by ID for a company
  getServiceByUUID(companyUUID: string, serviceId: string): Observable<any> {
    const url = `${this.apiUrl}/${companyUUID}/${serviceId}`;
    return this.http.get<any>(url);
  }

  // Method to update a service by ID for a company
  updateService(companyUUID: string, serviceId: string, serviceData: any): Observable<any> {
    const url = `${this.apiUrl}/${companyUUID}/${serviceId}`;
    return this.http.put<any>(url, serviceData);
  }

  // Method to delete a service by ID for a company
  deleteService(companyUUID: string, serviceId: string): Observable<void> {
    const url = `${this.apiUrl}/${companyUUID}/${serviceId}`;
    return this.http.delete<void>(url);
  }
}
