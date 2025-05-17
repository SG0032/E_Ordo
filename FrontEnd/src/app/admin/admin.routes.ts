import { Routes } from '@angular/router';
import { AdminDashboardComponent } from '../components/admin-dashboard/admin-dashboard.component';
import { AdminMedicationsComponent } from '../components/admin-medications/admin-medications.component';
import { AdminPathologiesComponent } from '../components/admin-pathologies/admin-pathologies.component';
import { AdminPrescriptionsComponent } from '../components/admin-prescriptions/admin-prescriptions.component';
import { AdminGuidelinesComponent } from '../components/admin-guidelines/admin-guidelines.component';
import { MedicationFormComponent } from '../components/medication-form/medication-form.component';
import { PathologyFormComponent } from '../components/pathology-form/pathology-form.component';
import { PrescriptionFormComponent } from '../components/prescription-form/prescription-form.component';
import { GuidelineFormComponent } from '../components/guideline-form/guideline-form.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardComponent
  },
  {
    path: 'medications',
    component: AdminMedicationsComponent
  },
  {
    path: 'medications/new',
    component: MedicationFormComponent
  },
  {
    path: 'medications/edit/:id',
    component: MedicationFormComponent
  },
  {
    path: 'pathologies',
    component: AdminPathologiesComponent
  },
  {
    path: 'pathologies/new',
    component: PathologyFormComponent
  },
  {
    path: 'pathologies/edit/:id',
    component: PathologyFormComponent
  },
  {
    path: 'prescriptions',
    component: AdminPrescriptionsComponent
  },
  {
    path: 'prescriptions/new',
    component: PrescriptionFormComponent
  },
  {
    path: 'prescriptions/edit/:id',
    component: PrescriptionFormComponent
  },
  {
    path: 'guidelines',
    component: AdminGuidelinesComponent
  },
  {
    path: 'guidelines/new',
    component: GuidelineFormComponent
  },
  {
    path: 'guidelines/edit/:id',
    component: GuidelineFormComponent
  }
];
