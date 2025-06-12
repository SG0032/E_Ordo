import {Inject, Injectable, PLATFORM_ID} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {isPlatformBrowser} from "@angular/common";

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

  canActivate(): boolean {
    // On server side, allow access (will be handled on client side)
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    const user = this.authService.getCurrentUser();

    if (!user) {
      this.snackBar.open('Please log in to access this page', 'Close', { duration: 3000 });
      this.router.navigate(['/login']);
      return false;
    }

    // For now, allow both doctors and students to access admin panel
    // You can modify this logic based on your requirements
    return true;
  }
}
