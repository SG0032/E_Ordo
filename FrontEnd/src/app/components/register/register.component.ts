import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

// Material imports
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../services/auth.service';
import { UserType } from '../../models/user.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ]
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  userTypes = UserType;
  isLoading = false;
  selectedFile: File | null = null;
  specialisations: string[] = [];
  showStudentFields = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadSpecialisations();
  }

  createForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      familyName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      userType: ['', Validators.required],
      yearOfStudy: [''],
      specialisation: ['']
    }, { validators: this.passwordMatchValidator });

    // Watch for user type changes
    this.registerForm.get('userType')?.valueChanges.subscribe(userType => {
      this.showStudentFields = userType === UserType.STUDENT;
      this.updateStudentFieldValidators();
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password?.value === confirmPassword?.value ? null : { passwordMismatch: true };
  }

  updateStudentFieldValidators(): void {
    const yearOfStudyControl = this.registerForm.get('yearOfStudy');
    const specialisationControl = this.registerForm.get('specialisation');

    if (this.showStudentFields) {
      yearOfStudyControl?.setValidators([Validators.required, Validators.min(1), Validators.max(7)]);
      specialisationControl?.setValidators([Validators.required]);
    } else {
      yearOfStudyControl?.clearValidators();
      specialisationControl?.clearValidators();
    }

    yearOfStudyControl?.updateValueAndValidity();
    specialisationControl?.updateValueAndValidity();
  }

  loadSpecialisations(): void {
    this.authService.getSpecialisations().subscribe(
      specialisations => {
        this.specialisations = specialisations;
      },
      error => {
        console.error('Error loading specialisations', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
        this.snackBar.open('Only image files and PDFs are allowed', 'Close', { duration: 3000 });
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.snackBar.open('File size must be less than 5MB', 'Close', { duration: 3000 });
        return;
      }

      this.selectedFile = file;
    }
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (this.showStudentFields && !this.selectedFile) {
      this.snackBar.open('Please upload your student card', 'Close', { duration: 3000 });
      return;
    }

    this.isLoading = true;
    const formValue = this.registerForm.value;

    const registerData = {
      firstName: formValue.firstName,
      familyName: formValue.familyName,
      email: formValue.email,
      password: formValue.password,
      userType: formValue.userType,
      yearOfStudy: this.showStudentFields ? formValue.yearOfStudy : undefined,
      specialisation: this.showStudentFields ? formValue.specialisation : undefined
    };

    this.authService.register(registerData).subscribe(
      response => {
        if (response.success) {
          // If student, upload student card
          if (this.showStudentFields && this.selectedFile && response.data) {
            this.uploadStudentCard(response.data.id);
          } else {
            this.handleRegistrationSuccess();
          }
        } else {
          this.snackBar.open(response.message, 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      },
      error => {
        console.error('Registration error', error);
        this.snackBar.open('Registration failed. Please try again.', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  uploadStudentCard(userId: number): void {
    if (!this.selectedFile) {
      this.handleRegistrationSuccess();
      return;
    }

    this.authService.uploadStudentCard(userId, this.selectedFile).subscribe(
      response => {
        if (response.success) {
          this.snackBar.open('Registration successful! Student card uploaded. Please wait for verification.', 'Close', { duration: 5000 });
        } else {
          this.snackBar.open(`Registration successful, but file upload failed: ${response.message}`, 'Close', { duration: 5000 });
        }
        this.handleRegistrationSuccess();
      },
      error => {
        console.error('File upload error', error);
        this.snackBar.open('Registration successful, but file upload failed. You can upload it later.', 'Close', { duration: 5000 });
        this.handleRegistrationSuccess();
      }
    );
  }

  handleRegistrationSuccess(): void {
    this.isLoading = false;
    this.router.navigate(['/login']);
  }

  markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getYearOptions(): number[] {
    return [1, 2, 3, 4, 5, 6, 7];
  }

  getUserTypeDisplayName(userType: UserType): string {
    switch (userType) {
      case UserType.STUDENT:
        return 'Student (Normal User)';
      case UserType.DOCTOR:
        return 'Doctor (Normal User)';
      case UserType.ADMIN:
        return 'Administrator';
      default:
        return userType;
    }
  }

  getUserTypeDescription(userType: UserType): string {
    switch (userType) {
      case UserType.STUDENT:
        return 'Access to search pathologies and view medical information';
      case UserType.DOCTOR:
        return 'Access to search pathologies and view medical information';
      case UserType.ADMIN:
        return 'Full administrative access including user management and system configuration';
      default:
        return '';
    }
  }
}
