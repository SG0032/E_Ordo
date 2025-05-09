import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prescription } from '../models/prescription.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionService {
  private apiUrl = `${environment.apiUrl}/prescriptions`;

  constructor(private http: HttpClient) { }

  getPrescriptionsByPathologyId(pathologyId: number): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/pathology/${pathologyId}`);
  }
}
