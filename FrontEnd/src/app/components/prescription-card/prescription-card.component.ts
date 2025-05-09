import { Component, Input } from '@angular/core';
import { Prescription } from '../../models/prescription.model';

@Component({
  selector: 'app-prescription-card',
  templateUrl: './prescription-card.component.html',
  styleUrls: ['./prescription-card.component.scss']
})
export class PrescriptionCardComponent {
  @Input() prescription!: Prescription;
  isExpanded = false;

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
}
