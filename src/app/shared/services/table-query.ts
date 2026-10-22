import { inject, Service } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PAGINATION } from '../../core/constants/constants';
import { SortState } from '../../core/interface/datatable';

/**
 * Servicio que se encarga de manejar los eventos del datatable y
 * actualizar la URL con los parámetros correspondientes.
 */
@Service()
export class DataTableQueryService {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly DEFAULT_PAGE_INDEX = PAGINATION.DEFAULT_PAGE_INDEX;
  private readonly DEFAULT_PAGE_SIZE = PAGINATION.DEFAULT_PAGE_SIZE;

  onPageChange(newPageSize: number, newPageIndex: number, currentPageSize: number) {
    const hasPageSizeChanged = newPageSize !== currentPageSize;
    const targetPage = hasPageSizeChanged ? 0 : newPageIndex;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: targetPage === this.DEFAULT_PAGE_INDEX ? null : targetPage + 1,
        size: newPageSize === this.DEFAULT_PAGE_SIZE ? null : newPageSize,
      },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(e: SortState) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: e.direction === '' ? null : `${e.active},${e.direction}`,
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

  navigateToPage(pageIndex: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: pageIndex === 0 ? null : pageIndex + 1,
      },
      queryParamsHandling: 'merge',
    });
  }
}
