import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AdminService } from '../../services/admin.service';
import { Guideline } from '../../models/guideline.model';
import { Pathology } from '../../models/pathology.model';

@Component({
  selector: 'app-guideline-form',
  templateUrl: './guideline-form.component.html',
  styleUrls: ['./guideline-form.component.scss']
})
export class GuidelineFormComponent implements OnInit {
  guidelineForm!: FormGroup;
  isLoading = false;
  isEdit = false;
  guidelineId!: number;

  pathologies: Pathology[] = [];

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
    this.guidelineId = +this.route.snapshot.params['id'];
    this.isEdit = !!this.guidelineId;

    this.loadPathologies();

    if (this.isEdit) {
      this.loadGuideline(this.guidelineId);
    }
  }

  createForm(): void {
    this.guidelineForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.maxLength(10000)]],
      source: ['', Validators.maxLength(100)],
      pathologyId: ['', Validators.required]
    });
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

  loadGuideline(id: number): void {
    this.isLoading = true;
    this.adminService.getGuidelineById(id).subscribe(
      (guideline) => {
        this.guidelineForm.patchValue({
          title: guideline.title,
          content: guideline.content,
          source: guideline.source,
          pathologyId: guideline.pathologyId
        });
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading guideline', error);
        this.snackBar.open('Error loading guideline', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.router.navigate(['/admin/guidelines']);
      }
    );
  }

  onSubmit(): void {
    if (this.guidelineForm.invalid) {
      return;
    }

    const guideline: Guideline = this.guidelineForm.value;
    this.isLoading = true;

    if (this.isEdit) {
      this.adminService.updateGuideline(this.guidelineId, guideline).subscribe(
        () => {
          this.isLoading = false;
          this.snackBar.open('Guideline updated successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/guidelines']);
        },
        (error) => {
          console.error('Error updating guideline', error);
          this.snackBar.open('Error updating guideline', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      );
    } else {
      this.adminService.createGuideline(guideline).subscribe(
        () => {
          this.isLoading = false;
          this.snackBar.open('Guideline created successfully', 'Close', { duration: 3000 });
          this.router.navigate(['/admin/guidelines']);
        },
        (error) => {
          console.error('Error creating guideline', error);
          this.snackBar.open('Error creating guideline', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      );
    }
  }
}
