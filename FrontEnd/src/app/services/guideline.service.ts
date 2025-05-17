import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Guideline } from '../models/guideline.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuidelineService {
  private apiUrl = `${environment.apiUrl}/guidelines`;

  constructor(private http: HttpClient) { }

  getGuidelineByPathologyId(pathologyId: number): Observable<Guideline> {
    return this.http.get<Guideline>(`${this.apiUrl}/pathology/${pathologyId}`);
  }
}
