import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Pathology } from '../../models/pathology.model';
import { AdminService } from '../../services/admin.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-pathologies',
  templateUrl: './admin-pathologies.component.html',
  styleUrls: ['./admin-pathologies.component.scss']
})
export class AdminPathologiesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'icdCode', 'description', 'actions'];
  dataSource!: MatTableDataSource<Pathology>;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadPathologies();
  }

  loadPathologies(): void {
    this.isLoading = true;
    this.adminService.getAllPathologies().subscribe(
      (pathologies) => {
        this.dataSource = new MatTableDataSource(pathologies);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading pathologies', error);
        this.snackBar.open('Error loading pathologies', 'Close', { duration: 3000 });
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

  deletePathology(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this pathology? This will also delete any associated prescriptions and guidelines.'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.deletePathology(id).subscribe(
          () => {
            this.snackBar.open('Pathology deleted successfully', 'Close', { duration: 3000 });
            this.loadPathologies();
          },
          (error) => {
            console.error('Error deleting pathology', error);
            this.snackBar.open('Error deleting pathology', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }
}
