import { Component, Input } from '@angular/core';
import { Guideline } from '../../models/guideline.model';

@Component({
  selector: 'app-guideline-view',
  templateUrl: './guideline-view.component.html',
  styleUrls: ['./guideline-view.component.scss']
})
export class GuidelineViewComponent {
  @Input() guideline!: Guideline;
  isExpanded = false;

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }
}
