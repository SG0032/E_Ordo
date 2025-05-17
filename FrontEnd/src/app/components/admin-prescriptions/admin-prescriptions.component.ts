import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Prescription } from '../../models/prescription.model';
import { AdminService } from '../../services/admin.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-prescriptions',
  templateUrl: './admin-prescriptions.component.html',
  styleUrls: ['./admin-prescriptions.component.scss']
})
export class AdminPrescriptionsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'pathologyName', 'courseOfAction', 'medications', 'actions'];
  dataSource!: MatTableDataSource<Prescription>;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPrescriptions();
  }

  loadPrescriptions(): void {
    this.isLoading = true;
    this.adminService.getAllPrescriptions().subscribe(
      (prescriptions) => {
        this.dataSource = new MatTableDataSource(prescriptions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading prescriptions', error);
        this.snackBar.open('Error loading prescriptions', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deletePrescription(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this prescription?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.deletePrescription(id).subscribe(
          () => {
            this.snackBar.open('Prescription deleted successfully', 'Close', { duration: 3000 });
            this.loadPrescriptions();
          },
          (error) => {
            console.error('Error deleting prescription', error);
            this.snackBar.open('Error deleting prescription', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }
}
