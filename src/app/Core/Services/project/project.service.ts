import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = 'http://localhost:3000/api/projects';

  constructor(private http: HttpClient) { }

  getAllProjectsByCompany(companyUUID: number): Observable<any> {
    const url = `${this.apiUrl}/${companyUUID}`;
    return this.http.get<any>(url);
  }

  getProjectById(companyUUID: number, projectId: number): Observable<any> {
    const url = `${this.apiUrl}/${companyUUID}/${projectId}`;
    return this.http.get<any>(url);
  }

  createProject(companyUUID: number, projectData: any): Observable<{ message: string }> {
    const url = `${this.apiUrl}/${companyUUID}`;
    return this.http.post<{ message: string }>(url, projectData);
  }

  updateProject(companyUUID: number, projectId: number, projectData: any): Observable<{ message: string }> {
    const url = `${this.apiUrl}/${companyUUID}/${projectId}`;
    return this.http.put<{ message: string }>(url, projectData);
  }

  deleteProject(companyUUID: number, projectId: number): Observable<{ message: string }> {
    const url = `${this.apiUrl}/${companyUUID}/${projectId}`;
    return this.http.delete<{ message: string }>(url);
  }
}
