import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { RegisterRequest, LoginRequest, LoginResponse, ApiResponse } from '../models/auth.model';
import {User} from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Only check for user on browser side
    if (isPlatformBrowser(this.platformId)) {
      const user = this.getCurrentUser();
      if (user) {
        this.currentUserSubject.next(user);
      }
    }
  }

  register(registerData: RegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/register`, registerData);
  }

  login(loginData: LoginRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        map(response => {
          if (response.success && response.data && isPlatformBrowser(this.platformId)) {
            const loginResponse = response.data as LoginResponse;
            // Store user data and token only on browser side
            localStorage.setItem('currentUser', JSON.stringify(loginResponse.user));
            localStorage.setItem('authToken', loginResponse.token);
            this.currentUserSubject.next(loginResponse.user);
          }
          return response;
        })
      );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken');
    }
    this.currentUserSubject.next(null);
  }

  getCurrentUser(): User | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    try {
      const userString = localStorage.getItem('currentUser');
      return userString ? JSON.parse(userString) : null;
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      return null;
    }
  }

  getAuthToken(): string | null {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    return localStorage.getItem('authToken');
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  uploadStudentCard(userId: number, file: File): Observable<ApiResponse> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<ApiResponse>(`${this.apiUrl}/upload-student-card/${userId}`, formData);
  }

  getSpecialisations(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/specialisations`);
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getPendingVerifications(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/pending-verifications`);
  }

  updateVerificationStatus(userId: number, status: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/verify-user/${userId}?status=${status}`, {});
  }
}
