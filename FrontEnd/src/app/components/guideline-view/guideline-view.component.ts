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

  getPreviewContent(): string {
    if (!this.guideline.content) {
      return '';
    }

    if (this.guideline.content.length <= 300) {
      return this.guideline.content;
    }

    return this.guideline.content.slice(0, 300) + '...';
  }
}
