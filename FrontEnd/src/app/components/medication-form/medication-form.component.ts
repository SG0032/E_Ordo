import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
import { Medication } from '../../models/medication.model';

@Component({
  selector: 'app-medication-form',
  templateUrl: './medication-form.component.html',
  styleUrls: ['./medication-form.component.scss']
})
export class MedicationFormComponent implements OnInit {
  medicationForm!: FormGroup;
  isLoading = false;
  isEdit = false;
  medicationId!: number;

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
    this.medicationId = this.route.snapshot.params['id'];
    this.isEdit = !!this.medicationId;

    if (this.isEdit) {
      this.loadMedication(this.medicationId);
    }
  }

  createForm(): void {
    this.medicationForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      molecule: ['', [Validators.required, Validators.maxLength(100)]],
      posologie: ['', [Validators.required, Validators.maxLength(200)]],
      infosMedicament: ['', Validators.maxLength(2000)],
      infosMolecule: ['', Validators.maxLength(2000)],
      manufacturer: ['', Validators.maxLength(100)]
    });
  }

  loadMedication(id: number): void {
    this.isLoading = true;
    this.adminService.getMedicationById(id).subscribe(
      (medication) => {
        this.medicationForm.patchValue(medication);
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading medication', error);
        this.snackBar.open('Error loading medication', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/admin/medications']);
      }
    );
  }

  onSubmit(): void {
    if (this.medicationForm.invalid) {
      return;
    }

    const medication: Medication = this.medicationForm.value;
    this.isLoading = true;

    if (this.isEdit) {
      this.adminService.updateMedication(this.medicationId, medication).subscribe(
        () => {
          this.isLoading = false;
          this.snackBar.open('Medication updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/medications']);
        },
        (error) => {
          console.error('Error updating medication', error);
          this.snackBar.open('Error updating medication', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      );
    } else {
      this.adminService.createMedication(medication).subscribe(
        () => {
          this.isLoading = false;
          this.snackBar.open('Medication created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/medications']);
        },
        (error) => {
          console.error('Error creating medication', error);
          this.snackBar.open('Error creating medication', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      );
    }
  }
}
