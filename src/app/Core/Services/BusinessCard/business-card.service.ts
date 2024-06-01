import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessCardService {
  private baseUrl = 'http://localhost:3000/api/business-cards'; // Replace with your backend API URL

  constructor(private http: HttpClient) {}

  getBusinessCardsImage(image: any){
    return `${this.baseUrl}/uploads/BusinessCards/${image}`;
  }

  getAllBusinessCards(companyUUID: any): Observable<any> {
    return this.http.get(`${this.baseUrl}/${companyUUID}`);
  }

  getBusinessCardById(cardId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${cardId}`);
  }

  createBusinessCard(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}`, formData);
  }

  updateBusinessCard(cardId: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/${cardId}`, formData);
  }

  deleteBusinessCard(cardId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${cardId}`);
  }

  checkBusinessCardExists(cardName: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/check?cardName=${cardName}`);
  }

  changeCardStatus(cardId: number, isActive: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/change-status/${cardId}`, { isActive });
  }
}
