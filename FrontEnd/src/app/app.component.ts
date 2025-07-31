import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { User, UserType, isAdmin, isNormalUser } from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'frontend-e_ordonnance';
  currentUser: User | null = null;
  private userSubscription!: Subscription;
  isBrowser: boolean;

  // Expose UserType enum to template
  UserType = UserType;

  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout();
    if (this.isBrowser) {
      this.router.navigate(['/login']);
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getUserDisplayName(): string {
    if (this.currentUser) {
      return `${this.currentUser.firstName} ${this.currentUser.familyName}`;
    }
    return '';
  }

  // Role-based access control methods
  isAdmin(): boolean {
    return isAdmin(this.currentUser);
  }

  isNormalUser(): boolean {
    return isNormalUser(this.currentUser);
  }

  canAccessAdmin(): boolean {
    return this.isAdmin();
  }

  canAccessSearch(): boolean {
    return this.isLoggedIn(); // All authenticated users can search
  }

  canAccessMedications(): boolean {
    return this.isAdmin();
  }

  getUserTypeDisplay(): string {
    if (!this.currentUser) return '';

    switch (this.currentUser.userType) {
      case UserType.ADMIN:
        return 'Administrator';
      case UserType.DOCTOR:
        return 'Doctor';
      case UserType.STUDENT:
        return 'Student';
      default:
        return 'User';
    }
  }

  getUserTypeIcon(): string {
    if (!this.currentUser) return 'person';

    switch (this.currentUser.userType) {
      case UserType.ADMIN:
        return 'admin_panel_settings';
      case UserType.DOCTOR:
        return 'local_hospital';
      case UserType.STUDENT:
        return 'school';
      default:
        return 'person';
    }
  }
}
