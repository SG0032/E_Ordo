import { Component, Input } from '@angular/core';
import { Prescription } from '../../models/prescription.model';
import { Medication } from '../../models/medication.model';

@Component({
  selector: 'app-prescription-card',
  templateUrl: './prescription-card.component.html',
  styleUrls: ['./prescription-card.component.scss']
})
export class PrescriptionCardComponent {
  @Input() prescription!: Prescription;
  selectedMedication: Medication | null = null;
  showMedicationInfo = false;
  showMoleculeInfo = false;

  toggleMedicationInfo(medication: Medication): void {
    if (this.selectedMedication === medication && this.showMedicationInfo) {
      this.showMedicationInfo = false;
    } else {
      this.selectedMedication = medication;
      this.showMedicationInfo = true;
      this.showMoleculeInfo = false;
    }
  }

  toggleMoleculeInfo(medication: Medication): void {
    if (this.selectedMedication === medication && this.showMoleculeInfo) {
      this.showMoleculeInfo = false;
    } else {
      this.selectedMedication = medication;
      this.showMoleculeInfo = true;
      this.showMedicationInfo = false;
    }
  }
}
