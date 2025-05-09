import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pathology } from '../models/pathology.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PathologyService {
  private apiUrl = `${environment.apiUrl}/pathologies`;

  constructor(private http: HttpClient) { }

  searchPathologies(term: string): Observable<Pathology[]> {
    return this.http.get<Pathology[]>(`${this.apiUrl}/search?term=${term}`);
  }

  getPathologyById(id: number): Observable<Pathology> {
    return this.http.get<Pathology>(`${this.apiUrl}/${id}`);
  }
}
