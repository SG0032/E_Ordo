import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Guideline } from '../../models/guideline.model';
import { AdminService } from '../../services/admin.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-guidelines',
  templateUrl: './admin-guidelines.component.html',
  styleUrls: ['./admin-guidelines.component.scss']
})
export class AdminGuidelinesComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'pathology', 'source', 'publishDate', 'actions'];
  dataSource!: MatTableDataSource<Guideline>;
  isLoading = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private adminService: AdminService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadGuidelines();
  }

  loadGuidelines(): void {
    this.isLoading = true;
    this.adminService.getAllGuidelines().subscribe(
      (guidelines) => {
        this.dataSource = new MatTableDataSource(guidelines);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading guidelines', error);
        this.snackBar.open('Error loading guidelines', 'Close', { duration: 3000 });
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

  deleteGuideline(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Confirm Delete',
        message: 'Are you sure you want to delete this guideline?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.adminService.deleteGuideline(id).subscribe(
          () => {
            this.snackBar.open('Guideline deleted successfully', 'Close', { duration: 3000 });
            this.loadGuidelines();
          },
          (error) => {
            console.error('Error deleting guideline', error);
            this.snackBar.open('Error deleting guideline', 'Close', { duration: 3000 });
          }
        );
      }
    });
  }
}
