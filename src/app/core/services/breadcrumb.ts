import { computed, inject, Service } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { BreadcrumbDef, Crumb } from '../interface/breadcrumb';

@Service()
export class BreadcrumbService {
  private router = inject(Router);

  // Señal que cambia en cada navegación para recalcular el árbol
  private navEnd = toSignal(this.router.events.pipe(filter((e) => e instanceof NavigationEnd)), {
    initialValue: null,
  });

  readonly crumbs = computed<Crumb[]>(() => {
    this.navEnd();

    const crumbs: Crumb[] = [
      {
        label: 'Inicio',
        url: '/home',
        status: 'ready',
      },
    ];
    let route: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    let url = '';

    while (route) {
      url += route.url.map((s) => '/' + s.path).join('');

      // Ojo: routeConfig.data y NO route.data (ver nota abajo)
      const def = route.routeConfig?.data?.['breadcrumb'] as BreadcrumbDef | undefined;
      if (def) {
        crumbs.push(this.resolveCrumb(def, route, url || '/'));
      }
      route = route.firstChild;
    }
    return crumbs;
  });

  readonly pageTitle = computed(() => {
    this.navEnd();

    let route: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    let title = '';

    while (route) {
      if (route.title) title = route.title;
      route = route.firstChild;
    }

    return title;
  });

  private resolveCrumb(def: BreadcrumbDef, route: ActivatedRouteSnapshot, url: string): Crumb {
    if (typeof def.label === 'string') {
      return { label: def.label, url, status: 'ready' };
    }

    const res = def.resource ? route.resources?.[def.resource] : undefined;

    // 1. hasValue() primero: durante un reload() sigue mostrando el dato anterior
    if (res?.hasValue()) {
      return { label: def.label(res.value()), url, status: 'ready' };
    }
    // 2. error() antes que isLoading(); value() NO se toca (lanza en estado de error)
    if (res?.error()) {
      return { label: def.errorLabel ?? 'Error', url, status: 'error' };
    }
    // 3. el resto: cargando (o idle)
    return { label: '', url, status: 'loading' };
  }
}
