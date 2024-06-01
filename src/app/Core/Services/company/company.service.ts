// company.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private apiUrl = 'http://localhost:3000/api/companies';

  constructor(private http: HttpClient) { }

  // Method to check if a company exists
  checkCompanyExists(companyName: string): Observable<{ exists: boolean }> {
    const url = `${this.apiUrl}/check?companyName=${companyName}`;
    return this.http.get<{ exists: boolean }>(url);
  }

  checkCompanyExistsByUUID_old(uuid: any): Observable<any> {
    const url = `${this.apiUrl}/check-by-uuid?uuid=${uuid}`;
    return this.http.get(url);
  }

  checkCompanyExistsByUUID(uuid: any): Observable<any> {
    const url = `${this.apiUrl}/verify-by-uuid`;
    return this.http.post(url, {uuid: uuid});
  }

  // Method to create a new company
  createCompany(companyData: any): Observable<{ id: number }> {
    const url = `${this.apiUrl}/add-company`;
    return this.http.post<{ id: number }>(url, companyData);
  }

  // Method to update an existing company
  updateCompany(companyId: number, companyData: any): Observable<void> {
    const url = `${this.apiUrl}/${companyId}`;
    return this.http.put<void>(url, companyData);
  }

  // Method to delete a company
  deleteCompany(companyUUID: number): Observable<void> {
    const url = `${this.apiUrl}/delete/${companyUUID}`;
    return this.http.delete<void>(url);
  }

  // Get All Companies
  getAllCompanies(userId: any){
    const reqBody: any = {
      userId: userId
    } 
    return this.http.post(this.apiUrl, reqBody);
  }

  // Get Company By Id
  getCompanyById(id: any){
    return this.http.get(this.apiUrl+"/"+id);
  }

  // Method to upload company logo
  uploadCompanyLogo(companyUUID: number, logoFile: File): Observable<void> {
    const formData: FormData = new FormData();
    formData.append('logo', logoFile, logoFile.name);
    const url = `${this.apiUrl}/upload-image?companyUUID=${companyUUID}`;
    return this.http.post<void>(url, formData);
  }

  getCompanyImage(image: any){
    return `${this.apiUrl}/uploads/company/${image}`;
  }

  getCompanyByUUID(uuid: any): Observable<any> {
    const url = `${this.apiUrl}/get-by-uuid`;
    return this.http.post(url, {uuid: uuid});
  }

  // Add more methods for other company-related operations here
}
