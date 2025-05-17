import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Medication } from '../../models/medication.model';
import { AdminService } from '../../services/admin.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-medications',
  templateUrl: './admin-medications.component.html',
  styleUrls: ['./admin-medications.component.scss']
})
export class AdminMedicationsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'molecule', 'posologie', 'manufacturer', 'actions'];
  dataSource!: MatTableDataSource<Medication>;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMedications();
  }

  loadMedications(): void {
    this.isLoading = true;
    this.adminService.getAllMedications().subscribe(
      (medications) => {
        this.dataSource = new MatTableDataSource(medications);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading medications', error);
        this.snackBar.open('Error loading medications', 'Close', { duration: 3000 });
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

  deleteMedication(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this medication?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.deleteMedication(id).subscribe(
          () => {
            this.snackBar.open('Medication deleted successfully', 'Close', { duration: 3000 });
            this.loadMedications();
          },
          (error) => {
            console.error('Error deleting medication', error);
            this.snackBar.open('Error deleting medication', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }
}
