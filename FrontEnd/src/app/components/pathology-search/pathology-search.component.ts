import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { Pathology } from '../../models/pathology.model';
import { PathologyService } from '../../services/pathology.service';

@Component({
  selector: 'app-pathology-search',
  templateUrl: './pathology-search.component.html',
  styleUrls: ['./pathology-search.component.scss']
})
export class PathologySearchComponent implements OnInit {
  searchControl = new FormControl();
  pathologies$: Observable<Pathology[]> = of([]);
  isLoading = false;

  constructor(
    private pathologyService: PathologyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pathologies$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (!term || term.length < 2) {
          return of([]);
        }
        this.isLoading = true;
        return this.pathologyService.searchPathologies(term);
      })
    );

    this.pathologies$.subscribe(() => {
      this.isLoading = false;
    });
  }

  viewPathologyDetails(id: number): void {
    this.router.navigate(['/pathology', id]);
  }
}
