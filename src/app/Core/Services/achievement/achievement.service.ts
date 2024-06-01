// achievement.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private apiUrl = 'http://localhost:3000/api/achievements';

  constructor(private http: HttpClient) { }

  getAllAchievements(companyUUID: number): Observable<any[]> {
    const url = `${this.apiUrl}/${companyUUID}`;
    return this.http.get<any[]>(url);
  }

  createAchievement(companyUUID: number, achievementData: any): Observable<any> {
    const url = `${this.apiUrl}/${companyUUID}`;
    return this.http.post<any>(url, achievementData);
  }

  updateAchievement(companyUUID: number, achievementId: number, achievementData: any): Observable<any> {
    const url = `${this.apiUrl}/${companyUUID}/${achievementId}`;
    return this.http.put<any>(url, achievementData);
  }

  deleteAchievement(companyUUID: number, achievementId: number): Observable<void> {
    const url = `${this.apiUrl}/${companyUUID}/${achievementId}`;
    return this.http.delete<void>(url);
  }
}
