import { computed, inject, Signal, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PagedQueryMapperService } from './paged-query-mapper';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { isEqual } from 'lodash-es';
import { PAGINATION } from '../../core/constants/constants';
import { DatatableState as DataTableState } from '../../core/interface/datatable';
import { HttpParams } from '@angular/common/http';

/**
 * Clase abstracta que proporciona la funcionalidad básica para manejar filtros paginados.
 * Esta clase encapsula la lógica de manejo de filtros, incluyendo la serialización de parámetros, limpieza de filtros y navegación entre páginas.
 * Las clases hijas deben implementar el método `parseQuery` para definir cómo se deben interpretar los parámetros de consulta específicos de su entidad.
 * @template T Tipo de filtro que se manejará (por ejemplo, UserFilter).
 */
export abstract class BasePagedFilterService<T extends DataTableState> {
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly queryMapperService = inject(PagedQueryMapperService);

  protected _filterState: WritableSignal<T>;
  readonly filterState: Signal<T>;

  canClean = computed(() => {
    return !isEqual(this._filterState(), this.defaultValues);
  });

  /**
   * @param defaultValues Valores por defecto del filtro, que se usarán para inicializar el estado y para determinar si los filtros están limpios.
   * @param sortColumns Columnas válidas para hacer sorting.
   */
  constructor(
    protected readonly defaultValues: T,
    protected readonly sortColumns: string[],
  ) {
    this._filterState = signal<T>(defaultValues);
    this.filterState = this._filterState.asReadonly();

    this.route.queryParamMap.pipe(takeUntilDestroyed()).subscribe((queryParams) => {
      const query = this.parseQuery(queryParams);
      this._filterState.set(query);
    });
  }

  /**
   * Serializa el estado actual a HttpParams (puede ser sobrescrito por clases hijas si hay filtros personalizados).
   */
  serializedParams = computed(() => {
    const currentState = this.filterState();
    return this.queryMapperService.getSerializedHttpParams(currentState as Record<string, any>);
  });

  /**
   * Limpia los filtros y navega a la ruta actual sin parámetros de consulta.
   * En consecuencia, esto restablece el estado del filtro a sus valores predeterminados.
   * Las clases hijas pueden sobrescribir este método si necesitan un comportamiento de limpieza específico.
   * Por ejemplo, si hay filtros que no deben ser eliminados al limpiar.
   */
  cleanFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }

  /**
   * Navega a una página específica en la paginación.
   * Este método se utiliza principalmente cuando se elimina un elemento y es necesario cambiar de página.
   * Las clases hijas pueden sobrescribir este método si necesitan un comportamiento de navegación específico.
   * @param pageIndex Índice de la página a la que se desea navegar.
   */
  navigateToPage(pageIndex: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        page: pageIndex === PAGINATION.DEFAULT_PAGE_INDEX ? null : pageIndex + 1,
      },
      queryParamsHandling: 'merge',
    });
  }

  /**
   * Obtiene el estado actual del datatable a partir de los query params de la URL.
   * @param params Map que representa los query params de la URL
   * @returns El estado actual del datatable (paginación, ordenamiento y búsqueda)
   */
  getDataTableQuery(params: ParamMap): DataTableState {
    return this.queryMapperService.parseQueryParams(params, this.sortColumns);
  }

  /**
   * Método que serializa el estado del datatable a HttpParams.
   * Esta serialización se encarga de limpiar los valores por defecto para que no se incluyan en la URL o en la API.
   * @param state Estado que se desea serializar
   * @returns Los parámetros serializados como HttpParams
   */
  getDatatableSerializedParams(state: T): HttpParams {
    return this.queryMapperService.getSerializedHttpParams(state);
  }

  /**
   * Método abstracto que obligatoriamente implementará cada entidad
   * para parsear los parámetros específicos de su URL.
   * @returns El estado del filtro correspondiente a los parámetros de consulta de la URL.
   */
  protected abstract parseQuery(params: ParamMap): T;
}
