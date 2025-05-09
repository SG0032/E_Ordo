import { Component, Input } from '@angular/core';
import { Medication } from '../../models/medication.model';

@Component({
  selector: 'app-medication-detail',
  templateUrl: './medication-detail.component.html',
  styleUrls: ['./medication-detail.component.scss']
})
export class MedicationDetailComponent {
  @Input() medication!: Medication;

  isPanelOpen = {
    medicationInfo: false,
    moleculeInfo: false
  };

  togglePanel(panel: 'medicationInfo' | 'moleculeInfo'): void {
    this.isPanelOpen[panel] = !this.isPanelOpen[panel];
  }
}
