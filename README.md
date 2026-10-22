# Auth Service FrontEnd

Aplicación web de administración de usuarios con Angular y Angular Material. Incluye inicio de sesión con JWT, refresh token reactivo y rutas protegidas por autenticación y roles, y una interfaz para consultar y administrar usuarios mediante una API REST.

## Funcionalidades

- Inicio y cierre de sesión; el token y el perfil se guardan en `localStorage`.
- Interceptores para el control del refresh token y manejo centralizado de errores.
- Envío del token como `Authorization: Bearer <token>` en las solicitudes HTTP utilizando interceptores.
- Rutas protegidas para usuarios autenticados y control de acceso con `ROLE_USER` y `ROLE_ADMIN`.
- Manejo de formularios utilizando `Signal Forms`.
- Carga de datos reactivos utilizando `HttpResource`
- Breadcrumb que soporta cargas asincronas para rutas dinámicas utilizando `Route Resources`.
- Página de inicio y menú que muestra las secciones permitidas según el rol.
- Administración de usuarios para administradores: listado paginado, búsqueda, ordenamiento, filtros por rol y estado, creación, edición, detalles, cambio y restablecimiento de contraseña, habilitar y deshabilitar usuarios.
- Estado de paginación, búsqueda, filtros y ordenamiento reflejado en los parámetros de la URL.
- Componentes reutilizables para tablas, formularios, diálogos, notificaciones y navegación adaptable.
- Manejo centralizado de errores HTTP, incluidos errores de autenticación, permisos y conexión.

## Tecnologías

- Angular 22 y TypeScript
- Angular Material y Angular CDK
- RxJS
- pnpm

## Requisitos

- Node.js compatible con Angular CLI 22
- pnpm 10
- Una instancia disponible de la API backend

Este frontend está preparado para integrarse con [demo-spring-security](https://github.com/JBryan98/auth-service).

## Instalación y ejecución

1. Instala las dependencias:

   ```bash
   pnpm install
   ```

2. Configura la URL de la API en `src/environments/environment.development.ts` para desarrollo. El valor inicial del proyecto es:

   ```ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api/v1',
   };
   ```

   La aplicación añade a esta URL los recursos `/auth`, `/users` y `/roles`. Para producción, configura también `apiUrl` en `src/environments/environment.ts` antes de compilar.

3. Inicia el servidor de desarrollo:

   ```bash
   pnpm start
   ```

   Angular CLI mostrará la dirección local, normalmente `http://localhost:4200`.

El frontend no incluye el backend ni credenciales de prueba. Se necesita un usuario válido de la API para iniciar sesión.

## Comandos disponibles

| Comando      | Descripción                                                         |
| ------------ | ------------------------------------------------------------------- |
| `pnpm start` | Inicia Angular en modo desarrollo.                                  |
| `pnpm build` | Genera la compilación de producción en `dist/`.                     |
| `pnpm watch` | Compila en modo desarrollo y vuelve a compilar al detectar cambios. |
| `pnpm test`  | Ejecuta las pruebas unitarias configuradas por Angular CLI.         |

## API esperada

Las rutas se construyen a partir de `apiUrl` y usan estos recursos:

| Método   | Ruta                         | Propósito                                                                           |
| -------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| `POST`   | `/auth/login`                | Iniciar sesión. Recibe `username` y `password`.                                     |
| `POST`   | `/auth/refresh-token`        | Generar un nuevo `accessToken` y `refreshToken`                                     |
| `POST`   | `/auth/logout`               | Revocar el refresh token al cerrar la sesión.                                       |
| `GET`    | `/users`                     | Listar usuarios; acepta parámetros de paginación, búsqueda, ordenamiento y filtros. |
| `GET`    | `/users/:id`                 | Consultar el detalle de un usuario.                                                 |
| `POST`   | `/users`                     | Crear un usuario.                                                                   |
| `PUT`    | `/users/:id`                 | Actualizar un usuario.                                                              |
| `PATCH`  | `/users/:id/change-password` | Cambiar la contraseña.                                                              |
| `PATCH`  | `/users/:id/reset-password`  | Restablecer la contraseña de un usuario.                                            |
| `PATCH`  | `/users/:id/enable`          | Habilitar un usuario.                                                               |
| `PATCH`  | `/users/:id/disable`         | Deshabilitar un usuario.                                                            |
| `GET`    | `/roles`                     | Consultar roles para formularios y filtros.                                         |

El inicio de sesión espera una respuesta con esta forma:

```json
{
  "token": {
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token",
    "tokenType": "Bearer",
  },
  "profile": {
    "id": 1,
    "email": "usuario@example.com",
    "firstName": "Nombre",
    "lastName": "Apellido",
    "roles": ["ROLE_USER"]
  }
}
```

El listado de usuarios y roles espera una respuesta paginada compatible con `PaginatedResponse`, con una colección `content` y metadatos `page.totalElements` y `page.totalPages`. Los nombres de parámetros para búsqueda y filtrado deben coincidir con los que acepte el backend; la interfaz envía, entre otros, `page`, `size`, `sort`, `search`, `roleIds` y `active`.

## Acceso por roles

- `ROLE_USER` puede acceder a **Inicio**.
- `ROLE_ADMIN` puede acceder a **Inicio** y **Usuarios**.
- Si no hay una sesión guardada, las rutas protegidas redirigen a `/login`.
- Si el usuario no tiene el rol requerido, se muestra la página de acceso denegado (`/403`).

La protección de las rutas se configura en `src/app/app.routes.ts` y `src/app/features/user/user.routes.ts`; las opciones del menú están en `src/app/core/layout/main-layout/sidenav-items.ts`.

## Estructura del código

```text
src/app/
├── core/       # Autenticación, guards, interceptores, layouts e interfaces comunes
├── features/   # Funcionalidades organizadas por área: auth, home, user, roles y errores
└── shared/     # Componentes y servicios reutilizables, como tablas, formularios y diálogos
```

## Compilación y despliegue

Genera la compilación de producción con:

```bash
pnpm build
```

Publica el contenido de `dist/` en un servidor web estático. Como Angular Router gestiona la navegación, configura el servidor para que las rutas de la aplicación devuelvan `index.html`. La URL del backend se toma de los archivos de entorno y queda incluida en la compilación del frontend.
