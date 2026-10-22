import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, input, output, TemplateRef } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PAGINATION } from '../../../../core/constants/constants';
import { Alert } from '../../alert/alert';
import { SearchFilterInput } from '../search-filter-input/search-filter-input';

interface DatatableColumn<T> {
  key: string;
  label: string;
  sortable: boolean;
}

@Component({
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBar,
    NgTemplateOutlet,
    SearchFilterInput,
    MatIconModule,
    Alert,
  ],
  selector: 'app-datatable',
  styleUrl: './datatable.css',
  templateUrl: './datatable.html',
})
export class Datatable<T> {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  data = input.required<T[]>();
  columns = input.required<DatatableColumn<T>[]>();
  isLoading = input.required<boolean>();
  isRefetching = input.required<boolean>();
  error = input.required<Error | undefined>();
  reloadData = output<void>();
  totalItems = input.required<number>();
  pageIndex = input.required<number>();
  pageSize = input.required<number>();
  sort = input.required<Sort>();
  enableSearchFilter = input<boolean>(true);
  searchFilter = input<string>('');
  cellTemplates = input<Record<string, TemplateRef<unknown>>>({});
  pageSizeOptions = PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS;

  //Columnas y celdas
  displayedColumns = computed(() => this.columns().map((col) => col.key));
  skeletonRows = computed(() => Array.from({ length: this.pageSize() }));

  skeletonWidth(rowIndex: number, columnIndex: number): string {
    return `${55 + ((rowIndex + columnIndex) % 4) * 12}%`;
  }

  onPageChange(e: PageEvent) {
    const hasPageSizeChanged = e.pageSize !== this.pageSize();
    const targetPage = hasPageSizeChanged ? 0 : e.pageIndex;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: targetPage === 0 ? null : targetPage + 1,
        size: e.pageSize === 10 ? null : e.pageSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(e: Sort) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: e.direction === '' ? null : `${e.active},${e.direction}`,
        size: this.pageSize() === 10 ? null : this.pageSize(),
        page: null,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSearchChange(search: string) {
    if (search.length >= 3 || search.length === 0) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: {
          search: search.length >= 3 ? search : null,
          page: null,
        },
        queryParamsHandling: 'merge',
      });
    }
  }
}
