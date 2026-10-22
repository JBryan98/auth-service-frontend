import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, TitleStrategy, withRouterResources } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptor/auth-interceptor';
import { errorInterceptor } from './core/interceptor/error-interceptor';
import { AppTitleStrategy } from './core/services/app-title-strategy';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { SpanishPaginatorIntl } from './core/i18n/spanish-paginator-intl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withRouterResources()),
    provideHttpClient(withInterceptors([errorInterceptor, authInterceptor])),
    {
      provide: TitleStrategy,
      useClass: AppTitleStrategy,
    },
    {
      provide: MatPaginatorIntl,
      useClass: SpanishPaginatorIntl,
    },
  ],
};
