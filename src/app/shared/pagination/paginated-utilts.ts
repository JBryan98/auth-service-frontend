import { PaginatedResponse } from '../../core/interface/api-response';

/**
 * Agregar un item a la respuesta paginada, si la pagina actual no esta llena, se agrega el item al final de la lista de items
 * y se actualiza el total de elementos y paginas, si la pagina actual esta llena, solo se actualiza el total de elementos y paginas
 * @param response respuesta paginada
 * @param item que se desea agregar
 * @returns Respuesta paginada actualizada con el item agregado
 */
export function addItem<T>(
  response: PaginatedResponse<T> | undefined,
  item: T,
): PaginatedResponse<T> | undefined {
  if (!response) return response;
  const totalElements = response.page.totalElements + 1;
  const totalPages = Math.ceil(totalElements / response.page.size);
  const appendToCurrentPage = response.content.length < response.page.size;

  return {
    ...response,
    content: appendToCurrentPage ? [...response.content, item] : response.content,
    page: {
      ...response.page,
      totalElements,
      totalPages,
    },
  };
}

/**
 * Reemplaza un item en la respuesta paginada, si el item existe en la lista de items, se reemplaza por el nuevo item,
 * si no existe, se retorna la respuesta original
 * @param response respuesta paginada
 * @param item que se desea reemplazar
 * @param getKey función que devuelve el key del item, para poder comparar si el item existe en la lista de items
 * @returns Respuesta paginada actualizada con el item reemplazado
 */
export function replaceItem<T, K>(
  response: PaginatedResponse<T> | undefined,
  item: T,
  getKey: (item: T) => K,
): PaginatedResponse<T> | undefined {
  if (!response) return response;
  return {
    ...response,
    content: response.content.map((currentItem) =>
      getKey(item) === getKey(currentItem) ? item : currentItem,
    ),
  };
}

/**
 * Elimina un item de la respuesta paginada, si el item existe en la lista de items,
 * se elimina de la lista y se actualiza el total de elementos y paginas
 * @param response respuesta paginada
 * @param filterKey key del item que se desea eliminar
 * @param getKey función que devuelve el key del item, necesario para realizar el filtrado de la lista de items
 * @returns Respuesta paginada actualizada con el item eliminado
 */
export function removeItem<T, K>(
  response: PaginatedResponse<T> | undefined,
  filterKey: K,
  getKey: (item: T) => K,
): PaginatedResponse<T> | undefined {
  if (!response) return response;
  const newContent = response.content.filter((currentItem) => getKey(currentItem) !== filterKey);
  return {
    ...response,
    content: newContent,
    page: {
      ...response.page,
      totalElements: Math.max(0, response.page.totalElements - 1),
    },
  };
}