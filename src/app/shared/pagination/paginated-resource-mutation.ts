import { WritableResource } from '@angular/core';
import { PaginatedResponse } from '../../core/interface/api-response';
import { DeletePageAction } from '../interfaces/pagination';
import { addItem, removeItem, replaceItem } from './paginated-utilts';

export class PaginatedResourceMutation<T> {
  /**
   * Clase que encapsula la lógica de mutación de recursos paginados, como agregar, actualizar y eliminar elementos.
   * Proporciona métodos para modificar un recurso paginado y manejar la navegación de páginas según sea necesario.
   * @template T Tipo de elemento en el recurso paginado.
   * @param getKey Callback para obtener la clave única de un elemento.
   * @param navigateToPage Callback para navegar a una página específica, utilizado cuando se elimina un elemento y es necesario cambiar de página.
   */
  constructor(
    private readonly getKey: (item: T) => unknown,
    private readonly navigateToPage: (pageIndex: number) => void,
  ) {}

  add(resource: WritableResource<PaginatedResponse<T> | undefined>, item: T) {
    resource.update((current) => addItem(current, item));
  }

  update(resource: WritableResource<PaginatedResponse<T> | undefined>, item: T) {
    resource.update((current) => replaceItem(current, item, this.getKey));
  }

  remove(resource: WritableResource<PaginatedResponse<T> | undefined>, key: unknown) {
    const current = resource.value();
    if (!current) return;
    const action = this.resolveDeleteAction(current, current.page.number);
    switch (action.type) {
      case 'previous-page':
        this.navigateToPage(action.pageIndex);
        break;
      case 'reload':
        resource.reload();
        break;
      case 'update':
        resource.update((_) => removeItem(current, key, this.getKey));
    }
  }

  private resolveDeleteAction<T>(
    response: PaginatedResponse<T>,
    pageIndex: number,
  ): DeletePageAction {
    const { content, page } = response;
    const isFirstPage = pageIndex === 0;
    const hasOnlyOneItem = content.length === 1;

    if (!isFirstPage && hasOnlyOneItem) {
      return {
        type: 'previous-page',
        pageIndex: pageIndex - 1,
      };
    }

    // Si es una página intermedia (no es la primera ni la última) y tiene más de un elemento, se recarga la página actual
    const isLastPage = pageIndex === page.totalPages - 1;
    const reloadData = !isFirstPage && !isLastPage && content.length > 1;

    if (reloadData) {
      return {
        type: 'reload',
      };
    }

    return {
      type: 'update',
    };
  }
}
