import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { SearchResponse } from '../../models/search-response.model';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-pathology-detail',
  templateUrl: './pathology-detail.component.html',
  styleUrls: ['./pathology-detail.component.scss']
})
export class PathologyDetailComponent implements OnInit {

  searchResult$!: Observable<SearchResponse>;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.searchResult$ = this.route.paramMap.pipe(
      switchMap(params => {
        const pathologyId = Number(params.get('id'));
        return this.searchService.searchByPathologyId(pathologyId);
      })
    );

    this.searchResult$.subscribe(() => {
      this.isLoading = false;
    });
  }
}
