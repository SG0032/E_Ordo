import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Angular Material imports
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';

// Components
import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';
import { AdminMedicationsComponent } from '../components/admin-medications/admin-medications.component';
import { AdminPathologiesComponent } from '../components/admin-pathologies/admin-pathologies.component';
import { AdminPrescriptionsComponent } from '../components/admin-prescriptions/admin-prescriptions.component';
import { AdminGuidelinesComponent } from '../components/admin-guidelines/admin-guidelines.component';
import { AdminNavComponent } from '../components/admin-nav/admin-nav.component';
import { MedicationFormComponent } from '../components/medication-form/medication-form.component';
import { PathologyFormComponent } from '../components/pathology-form/pathology-form.component';
import { PrescriptionFormComponent } from '../components/prescription-form/prescription-form.component';
import { GuidelineFormComponent } from '../components/guideline-form/guideline-form.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

// Routes
import { adminRoutes } from './admin.routes';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminMedicationsComponent,
    AdminPathologiesComponent,
    AdminPrescriptionsComponent,
    AdminGuidelinesComponent,
    AdminNavComponent,
    MedicationFormComponent,
    PathologyFormComponent,
    PrescriptionFormComponent,
    GuidelineFormComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(adminRoutes),
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTooltipModule
  ]
})
export class AdminModule { }
