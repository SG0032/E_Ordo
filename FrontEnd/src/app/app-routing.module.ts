import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathologySearchComponent } from './components/pathology-search/pathology-search.component';
import { PathologyDetailComponent } from './components/pathology-detail/pathology-detail.component';
import { MedicationsListComponent } from './components/medications-list/medications-list.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: '', component: PathologySearchComponent, canActivate: [AuthGuard] },
  { path: 'pathology/:id', component: PathologyDetailComponent, canActivate: [AuthGuard] },
  { path: 'medications', component: MedicationsListComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [AdminGuard]
  },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
