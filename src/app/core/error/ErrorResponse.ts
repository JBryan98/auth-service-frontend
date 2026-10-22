import { ErrorResponse, ErrorResponseErrors } from '../interface/api-response';

/**
 * Esta clase se encarga de manejar los errores que provienen del backend.
 * Los errores tienen el formato RFC 9457
 * Se extiende de la clase Error de JavaScript para poder ser manejada desde el código que llama a la API,
 * y también se puede mostrar en la UI.
 */
export class ApiError extends Error implements ErrorResponse {
  public readonly status: number;
  public readonly title: string;
  public readonly detail: string;
  public readonly code: string;
  public readonly errors?: ErrorResponseErrors[];

  /**
   * @param payload Respuesta del backend
   */
  constructor(payload: ErrorResponse) {
    const errorMessage = ApiError.handleErrorMessage(payload.code);
    // Se pasa el mensaje de error al constructor de Error para que pueda ser manejado 
    // desde el código que llama a la API, y también se puede mostrar en la UI.
    super(errorMessage);
    this.status = payload.status;
    this.title = payload.title;
    this.detail = payload.detail;
    this.code = payload.code;
    this.errors = payload.errors;
    this.name = 'ApiError';
  }

  /**
   * Método provisional para mapear los errores del backend al español.
   * El mensaje se elabora en base al código de error que devuelve el backend.
   */
  private static handleErrorMessage(code: string): string {
    switch (code) {
      case 'USER_NOT_FOUND':
        return 'El usuario no fue encontrado.';
      case 'DUPLICATED_EMAIL':
        return 'El correo electrónico ya está en uso. Por favor, elige otro.';
      case 'DUPLICATED_USERNAME':
        return 'El nombre de usuario ya está en uso. Por favor, elige otro.';
      case 'CHANGE_PASSWORD':
        return 'La nueva contraseña debe ser diferente a la contraseña actual.';
      case 'ROLE_NOT_FOUND':
        return 'El rol no fue encontrado.';
      case 'ROLE_HAS_ASSIGNED_USERS':
        return 'No se puede eliminar el rol porque tiene usuarios asignados.';
      case 'BAD_CREDENTIALS':
        return 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.';
      case 'ACCESS_DENIED':
        return 'Acceso denegado. Por favor, inicia sesión nuevamente.';
      case 'EXPIRED_JWT':
        return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
      case 'INVALID_JWT':
        return 'Token inválido. Por favor, inicia sesión nuevamente.';
      case 'USER_DISABLED':
        return 'Tu cuenta ha sido deshabilitada. Por favor, contacta con el administrador si crees que esto es un error.';
      case 'METHOD_ARGUMENT_NOT_VALID':
        return 'La solicitud contiene errores de validación. Por favor, verifica los datos ingresados.';
      case 'INTERNAL_SERVER_ERROR':
        return 'Hubo un error inesperado en el servidor. Por favor, intenta nuevamente más tarde o contacta con el administrador.';
      case 'NETWORK_ERROR':
        return 'No se pudo conectar con el servidor.';
      default:
        return 'Hubo un error inesperado. Por favor, intenta nuevamente más tarde o contacta con el administrador.';
    }
  }
}
