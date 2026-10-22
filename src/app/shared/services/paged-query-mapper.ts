import { HttpParams } from '@angular/common/http';
import { Service } from '@angular/core';
import { Sort, SortDirection } from '@angular/material/sort';
import { ParamMap } from '@angular/router';
import { PAGINATION } from '../../core/constants/constants';

/**
 * Servicio que se encarga de mapear los parámetros de la URL a un objeto de consulta paginada y viceversa.
 * Este servicio es útil para manejar la paginación, ordenamiento y búsqueda en el datatable.
 */
@Service()
export class PagedQueryMapperService {
  /**
   * Método que se encarga de parsear los parámetros {page, size, sort y search} de la URL
   * @param rawQueryParams Params de la url sin procesar
   * @param allowedSortColumns Columnas validas para hacer sorting
   * @returns
   */
  parseQueryParams(rawQueryParams: ParamMap, allowedSortColumns: string[]) {
    return {
      pageSize: this.parseSize(rawQueryParams.get('size')),
      pageIndex: this.parsePage(rawQueryParams.get('page')),
      sort: this.parseSort(rawQueryParams.get('sort'), allowedSortColumns),
      search: this.parseSearch(rawQueryParams.get('search')),
    };
  }

  /**
   * Serializa los parámetros de la tabla en un objeto HttpParams.
   * @param state
   * @returns Objeto HttpParams con los parámetros serializados listos para enviar a la API
   */
  getSerializedHttpParams(state: any): HttpParams {
    let params = new HttpParams();
    const { pageIndex, pageSize, sort, search } = state;
    if (pageIndex > PAGINATION.DEFAULT_PAGE_INDEX) {
      params = params.set('page', pageIndex.toString());
    }
    if (pageSize !== PAGINATION.DEFAULT_PAGE_SIZE) {
      params = params.set('size', pageSize.toString());
    }
    if (sort.active && sort.direction) {
      params = params.set('sort', `${sort.active},${sort.direction}`);
    }
    if (search.length >= 3) {
      params = params.set('search', search);
    }

    return params;
  }

  private parsePage(rawPage: string | null): number {
    if (!rawPage) return PAGINATION.DEFAULT_PAGE_INDEX;
    const page = +rawPage;
    return !isNaN(page) && page > PAGINATION.DEFAULT_PAGE_INDEX
      ? page - 1
      : PAGINATION.DEFAULT_PAGE_INDEX;
  }

  private parseSize(rawSize: string | null): number {
    if (!rawSize) return PAGINATION.DEFAULT_PAGE_SIZE;
    const size = +rawSize;
    if (isNaN(size) || size <= 0) return PAGINATION.DEFAULT_PAGE_SIZE;
    const allowedSizes = PAGINATION.DEFAULT_PAGE_SIZE_OPTIONS;
    return allowedSizes.includes(size) ? size : PAGINATION.DEFAULT_PAGE_SIZE;
  }

  private parseSort(rawSort: string | null, sortColumns: string[]): Sort {
    const sort: Sort = { active: '', direction: '' };
    if (!rawSort) return sort;
    const [field, direction] = rawSort.split(',');
    const isValidColumn = sortColumns.includes(field);
    const isValidDirection = ['asc', 'desc'].includes(direction);
    if (isValidColumn && isValidDirection) {
      sort.active = field;
      sort.direction = direction as SortDirection;
    }
    return sort;
  }

  private parseSearch(rawSearch: string | null): string {
    if (!rawSearch) return '';
    return rawSearch.length >= 3 ? rawSearch : '';
  }
}
