// email-category.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailCategoryService {
  private apiUrl = 'http://localhost:3000/api/email-categories';

  constructor(private http: HttpClient) { }

  getAllCategories(userId: number): Observable<any[]> {
    const url = `${this.apiUrl}?userId=${userId}`;
    return this.http.get<any[]>(url);
  }

  getCategoryById(categoryId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}?userId=${userId}`;
    return this.http.get<any>(url);
  }

  createCategory(categoryData: any, userId: number): Observable<any> {
    const url = `${this.apiUrl}?userId=${userId}`;
    return this.http.post<any>(url, categoryData);
  }

  updateCategory(categoryId: number, categoryData: any, userId: number): Observable<any> {
    const url = `${this.apiUrl}/${categoryId}?userId=${userId}`;
    return this.http.put<any>(url, categoryData);
  }

  deleteCategory(categoryId: number, userId: number): Observable<void> {
    const url = `${this.apiUrl}/${categoryId}?userId=${userId}`;
    return this.http.delete<void>(url);
  }

  // searchCategoriesByName(name: string, userId: number): Observable<any[]> {
  //   const url = `${this.apiUrl}/search?name=${name}&userId=${userId}`;
  //   return this.http.get<any[]>(url);
  // }


  // searchCategoriesByName(name: string, userId: number): Observable<any[]> {
  //   const url = `${this.apiUrl}/search`;
  //   const params = new HttpParams().set('name', name).set('userId', userId.toString());
  //   return this.http.get<any[]>(url, { params });
  // }
  searchCategoriesByName(name: string, userId: number): Observable<any[]> {
    const searchData = { name, userId };
    return this.http.post<any[]>(`${this.apiUrl}/search`, searchData);
  }

}
