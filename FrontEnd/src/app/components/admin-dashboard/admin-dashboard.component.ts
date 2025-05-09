import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  statistics$!: Observable<any>;
  isLoading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadStatistics();
  }

  loadStatistics() {
    this.isLoading = true;
    this.statistics$ = forkJoin({
      medications: this.adminService.getMedicationsCount(),
      pathologies: this.adminService.getPathologiesCount(),
      prescriptions: this.adminService.getPrescriptionsCount(),
      guidelines: this.adminService.getGuidelinesCount()
    }).pipe(
      map(result => {
        this.isLoading = false;
        return result;
      })
    );
  }
}
