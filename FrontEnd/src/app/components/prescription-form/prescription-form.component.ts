import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AdminService } from '../../services/admin.service';
import { Prescription } from '../../models/prescription.model';
import { Pathology } from '../../models/pathology.model';
import { Medication } from '../../models/medication.model';

@Component({
  selector: 'app-prescription-form',
  templateUrl: './prescription-form.component.html',
  styleUrls: ['./prescription-form.component.scss']
})
export class PrescriptionFormComponent implements OnInit {
  prescriptionForm!: FormGroup;
  isLoading = false;
  isEdit = false;
  prescriptionId!: number;

  pathologies: Pathology[] = [];
  medications: Medication[] = [];
  filteredMedications: Observable<Medication[]>[] = [];

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
    this.prescriptionId = +this.route.snapshot.params['id'];
    this.isEdit = !!this.prescriptionId;

    this.loadPathologies();
    this.loadMedications();

    if (this.isEdit) {
      this.loadPrescription(this.prescriptionId);
    }
  }

  createForm(): void {
    this.prescriptionForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      courseOfAction: ['', [Validators.required, Validators.maxLength(200)]],
      dosageInstructions: ['', Validators.maxLength(500)],
      duration: ['', Validators.maxLength(100)],
      pathologyId: ['', Validators.required],
      medications: this.fb.array([])
    });
  }

  get medicationsFormArray(): FormArray {
    return this.prescriptionForm.get('medications') as FormArray;
  }

  addMedication(): void {
    const medicationGroup = this.fb.group({
      id: ['', Validators.required]
    });

    this.medicationsFormArray.push(medicationGroup);

    // Setup filtering for the new medication field
    const index = this.medicationsFormArray.length - 1;
    this.setupMedicationFiltering(index);
  }

  removeMedication(index: number): void {
    this.medicationsFormArray.removeAt(index);
    this.filteredMedications.splice(index, 1);
  }

  setupMedicationFiltering(index: number): void {
    this.filteredMedications[index] = this.medicationsFormArray.at(index).get('id')!.valueChanges
      .pipe(
        startWith(''),
        map(value => {
          const medicationId = typeof value === 'number' ? value : null;
          const medicationName = typeof value === 'string' ? value : '';
          return medicationId ? this._filterMedicationsById(medicationId) : this._filterMedicationsByName(medicationName);
        })
      );
  }

  private _filterMedicationsByName(name: string): Medication[] {
    const filterValue = name.toLowerCase();
    return this.medications.filter(medication => medication.name.toLowerCase().includes(filterValue));
  }

  private _filterMedicationsById(id: number): Medication[] {
    return this.medications.filter(medication => medication.id === id);
  }

  displayMedication(medicationId: number): string {
    if (!medicationId) return '';
    const medication = this.medications.find(m => m.id === medicationId);
    return medication ? medication.name : '';
  }

  loadPathologies(): void {
    this.adminService.getAllPathologies().subscribe(
      (pathologies) => {
        this.pathologies = pathologies;
      },
      (error) => {
        console.error('Error loading pathologies', error);
        this.snackBar.open('Error loading pathologies', 'Close', { duration: 3000 });
      }
    );
  }

  loadMedications(): void {
    this.adminService.getAllMedications().subscribe(
      (medications) => {
        this.medications = medications;
      },
      (error) => {
        console.error('Error loading medications', error);
        this.snackBar.open('Error loading medications', 'Close', { duration: 3000 });
      }
    );
  }

  loadPrescription(id: number): void {
    this.isLoading = true;
    this.adminService.getPrescriptionById(id).subscribe(
      (prescription) => {
        // Basic fields
        this.prescriptionForm.patchValue({
          name: prescription.name,
          courseOfAction: prescription.courseOfAction,
          dosageInstructions: prescription.dosageInstructions,
          duration: prescription.duration,
          pathologyId: prescription.pathologyId
        });

        // Clear and repopulate medications
        while (this.medicationsFormArray.length) {
          this.medicationsFormArray.removeAt(0);
        }

        prescription.medications.forEach(medication => {
          const medicationGroup = this.fb.group({
            id: [medication.id, Validators.required]
          });
          this.medicationsFormArray.push(medicationGroup);

          // Setup filtering for each medication field
          this.setupMedicationFiltering(this.medicationsFormArray.length - 1);
        });

        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading prescription', error);
        this.snackBar.open('Error loading prescription', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/admin/prescriptions']);
      }
    );
  }

  onSubmit(): void {
    if (this.prescriptionForm.invalid) {
      return;
    }

    const formValue = this.prescriptionForm.value;

    // Transform medications to the format expected by the backend
    const medicationIds = formValue.medications.map((m: any) => m.id);

    const prescription: any = {
      name: formValue.name,
      courseOfAction: formValue.courseOfAction,
      dosageInstructions: formValue.dosageInstructions,
      duration: formValue.duration,
      pathologyId: formValue.pathologyId,
      medicationIds: medicationIds
    };

    this.isLoading = true;

    if (this.isEdit) {
      this.adminService.updatePrescription(this.prescriptionId, prescription).subscribe(
        () => {
          this.isLoading = false;
          this.snackBar.open('Prescription updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/prescriptions']);
        },
        (error) => {
          console.error('Error updating prescription', error);
          this.snackBar.open('Error updating prescription', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      );
    } else {
      this.adminService.createPrescription(prescription).subscribe(
        () => {
          this.isLoading = false;
          this.snackBar.open('Prescription created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/prescriptions']);
        },
        (error) => {
          console.error('Error creating prescription', error);
          this.snackBar.open('Error creating prescription', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      );
    }
  }
}
