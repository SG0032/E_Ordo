import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchResponse } from '../models/search-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private apiUrl = `${environment.apiUrl}/search`;

  constructor(private http: HttpClient) { }

  searchByPathologyId(pathologyId: number): Observable<SearchResponse> {
    return this.http.get<SearchResponse>(`${this.apiUrl}/pathology/${pathologyId}`);
  }
}
