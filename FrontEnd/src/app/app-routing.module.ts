import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PathologySearchComponent } from './components/pathology-search/pathology-search.component';
import { PathologyDetailComponent } from './components/pathology-detail/pathology-detail.component';
import { MedicationsListComponent } from './components/medications-list/medications-list.component';

const routes: Routes = [
  { path: '', component: PathologySearchComponent },
  { path: 'pathology/:id', component: PathologyDetailComponent },
  { path: 'medications', component: MedicationsListComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
