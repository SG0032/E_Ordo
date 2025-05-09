import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
import { Pathology } from '../../models/pathology.model';

@Component({
  selector: 'app-pathology-form',
  templateUrl: './pathology-form.component.html',
  styleUrls: ['./pathology-form.component.scss']
})
export class PathologyFormComponent implements OnInit {
  pathologyForm!: FormGroup;
  isLoading = false;
  isEdit = false;
  pathologyId!: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.pathologyId = +this.route.snapshot.params['id'];
    this.isEdit = !!this.pathologyId;

    if (this.isEdit) {
      this.loadPathology(this.pathologyId);
    }
  }

  createForm(): void {
    this.pathologyForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(2000)]],
      icdCode: ['', [Validators.required, Validators.maxLength(20)]]
    });
  }

  loadPathology(id: number): void {
    this.isLoading = true;
    this.adminService.getPathologyById(id).subscribe(
      (pathology) => {
        this.pathologyForm.patchValue(pathology);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading pathology', error);
        this.snackBar.open('Error loading pathology', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/admin/pathologies']);
      }
    );
  }

  onSubmit(): void {
    if (this.pathologyForm.invalid) {
      return;
    }

    const pathology: Pathology = this.pathologyForm.value;
    this.isLoading = true;

    if (this.isEdit) {
      this.adminService.updatePathology(this.pathologyId, pathology).subscribe(
        () => {
          this.isLoading = false;
          this.snackBar.open('Pathology updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/pathologies']);
        },
        (error) => {
          console.error('Error updating pathology', error);
          this.snackBar.open('Error updating pathology', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      );
    } else {
      this.adminService.createPathology(pathology).subscribe(
        () => {
          this.isLoading = false;
          this.snackBar.open('Pathology created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/pathologies']);
        },
        (error) => {
          console.error('Error creating pathology', error);
          this.snackBar.open('Error creating pathology', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      );
    }
  }
}
