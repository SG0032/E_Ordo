import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medication } from '../models/medication.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MedicationService {
  private apiUrl = `${environment.apiUrl}/medications`;

  constructor(private http: HttpClient) { }

  getAllMedications(): Observable<Medication[]> {
    return this.http.get<Medication[]>(this.apiUrl);
  }

  getMedicationById(id: number): Observable<Medication> {
    return this.http.get<Medication>(`${this.apiUrl}/${id}`);
  }
}
