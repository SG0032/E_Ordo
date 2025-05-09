import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Medication } from '../models/medication.model';
import { Pathology } from '../models/pathology.model';
import { Prescription } from '../models/prescription.model';
import { Guideline } from '../models/guideline.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Statistics
  getMedicationsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/medications/count`);
  }

  getPathologiesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/pathologies/count`);
  }

  getPrescriptionsCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/prescriptions/count`);
  }

  getGuidelinesCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/guidelines/count`);
  }

  // Medications
  getAllMedications(): Observable<Medication[]> {
    return this.http.get<Medication[]>(`${this.apiUrl}/medications`);
  }

  getMedicationById(id: number): Observable<Medication> {
    return this.http.get<Medication>(`${this.apiUrl}/medications/${id}`);
  }

  createMedication(medication: Medication): Observable<Medication> {
    return this.http.post<Medication>(`${this.apiUrl}/medications`, medication);
  }

  updateMedication(id: number, medication: Medication): Observable<Medication> {
    return this.http.put<Medication>(`${this.apiUrl}/medications/${id}`, medication);
  }

  deleteMedication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/medications/${id}`);
  }

  // Pathologies
  getAllPathologies(): Observable<Pathology[]> {
    return this.http.get<Pathology[]>(`${this.apiUrl}/pathologies`);
  }

  getPathologyById(id: number): Observable<Pathology> {
    return this.http.get<Pathology>(`${this.apiUrl}/pathologies/${id}`);
  }

  createPathology(pathology: Pathology): Observable<Pathology> {
    return this.http.post<Pathology>(`${this.apiUrl}/pathologies`, pathology);
  }

  updatePathology(id: number, pathology: Pathology): Observable<Pathology> {
    return this.http.put<Pathology>(`${this.apiUrl}/pathologies/${id}`, pathology);
  }

  deletePathology(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/pathologies/${id}`);
  }

  // Prescriptions
  getAllPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/prescriptions`);
  }

  getPrescriptionById(id: number): Observable<Prescription> {
    return this.http.get<Prescription>(`${this.apiUrl}/prescriptions/${id}`);
  }

  createPrescription(prescription: Prescription): Observable<Prescription> {
    return this.http.post<Prescription>(`${this.apiUrl}/prescriptions`, prescription);
  }

  updatePrescription(id: number, prescription: Prescription): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.apiUrl}/prescriptions/${id}`, prescription);
  }

  deletePrescription(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/prescriptions/${id}`);
  }

  // Guidelines
  getAllGuidelines(): Observable<Guideline[]> {
    return this.http.get<Guideline[]>(`${this.apiUrl}/guidelines`);
  }

  getGuidelineById(id: number): Observable<Guideline> {
    return this.http.get<Guideline>(`${this.apiUrl}/guidelines/${id}`);
  }

  createGuideline(guideline: Guideline): Observable<Guideline> {
    return this.http.post<Guideline>(`${this.apiUrl}/guidelines`, guideline);
  }

  updateGuideline(id: number, guideline: Guideline): Observable<Guideline> {
    return this.http.put<Guideline>(`${this.apiUrl}/guidelines/${id}`, guideline);
  }

  deleteGuideline(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/guidelines/${id}`);
  }
}
