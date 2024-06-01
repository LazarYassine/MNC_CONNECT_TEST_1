import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkCategoryService {
  private apiUrl = 'http://localhost:3000/api/networkcategories';

  constructor(private http: HttpClient) { }

  createCategory(companyUUID: any, categoryData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl+ "/" +companyUUID, categoryData);
  }

  getAllCategories(companyUUID: any): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl+ "/" +companyUUID);
  }

  getCategoryById(companyUUID: any, categoryId: number): Observable<any> {
    const url = `${this.apiUrl}/${companyUUID}/${categoryId}`;
    return this.http.get<any>(url);
  }

  updateCategory(companyUUID: any, categoryId: number, categoryData: any): Observable<any> {
    const url = `${this.apiUrl}/${companyUUID}/${categoryId}`;
    return this.http.put<any>(url, categoryData);
  }

  deleteCategory(companyUUID: any, categoryId: number): Observable<any> {
    const url = `${this.apiUrl}/${companyUUID}/${categoryId}`;
    return this.http.delete<any>(url);
  }
}
