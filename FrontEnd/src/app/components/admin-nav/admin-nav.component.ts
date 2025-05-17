import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-nav',
  templateUrl: './admin-nav.component.html',
  styleUrls: ['./admin-nav.component.scss']
})
export class AdminNavComponent {
  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin' },
    { label: 'Medications', icon: 'medication', route: '/admin/medications' },
    { label: 'Pathologies', icon: 'sick', route: '/admin/pathologies' },
    { label: 'Prescriptions', icon: 'receipt', route: '/admin/prescriptions' },
    { label: 'Guidelines', icon: 'menu_book', route: '/admin/guidelines' }
  ];
}
