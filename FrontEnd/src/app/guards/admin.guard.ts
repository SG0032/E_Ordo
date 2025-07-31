import { Inject, Injectable, PLATFORM_ID } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { isPlatformBrowser } from "@angular/common";

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // On server side, allow access (will be handled on client side)
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.showUnauthorizedMessage('Please log in to access this page');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      });
      return false;
    }

    // Check if user has admin role
    if (!this.authService.isAdmin()) {
      this.showUnauthorizedMessage('Access denied. Administrator privileges required.');
      this.router.navigate(['/']); // Redirect to home page
      return false;
    }

    return true;
  }

  private showUnauthorizedMessage(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar']
    });
  }
}
