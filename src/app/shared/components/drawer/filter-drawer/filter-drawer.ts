import {
  Component,
  DOCUMENT,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-filter-drawer',
  imports: [MatSidenavModule, MatButtonModule, MatIconModule, MatIconModule],
  templateUrl: './filter-drawer.html',
  styleUrl: './filter-drawer.css',
})
export class FilterDrawer implements OnInit, OnDestroy {
  opened = model(false);

  title = input<string>('Filtros');
  width = input<string>('360px');

  disableFilterButton = input<boolean>(true);
  disableClearButton = input<boolean>(true);

  closeOnFilter = input<boolean>(true);

  clear = output<void>();
  filter = output<void>();

  /**
   * Elemento nativo del host (<app-filter-drawer>).
   *
   * Se necesita la referencia directa al nodo del DOM para poder moverlo
   * a otro lugar del árbol (ver ngOnInit).
   */
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;

  /**
   * Referencia al documento, inyectada con el token DOCUMENT de Angular
   * en lugar de usar el `document` global.
   *
   * Es la forma recomendada porque funciona también con SSR, donde
   * `document` global no existe.
   */
  private readonly document = inject(DOCUMENT);

  /**
   * Mueve el host del drawer a <body>.
   *
   * Por qué es necesario:
   * - Este componente se usa dentro de <router-outlet>, que está dentro de
   *   <mat-sidenav-content> del layout.
   * - mat-sidenav-content crea su propio contexto de apilamiento
   *   (stacking context), así que el z-index del drawer solo compite con
   *   los elementos de ese contexto.
   * - El toolbar del layout (position: fixed; z-index: 2) está fuera de ese
   *   contexto y por eso se pinta encima del drawer, sin importar el
   *   z-index que le pongamos.
   *
   * Al colgar el host directamente de <body>, el drawer sale de ese
   * contexto y compite al mismo nivel que el toolbar, por lo que lo cubre.
   *
   * Nota: Angular sigue gestionando el componente (bindings, eventos y
   * detección de cambios) aunque su nodo DOM esté en otro lugar.
   */
  ngOnInit(): void {
    this.document.body.appendChild(this.host);
  }

  /**
   * Retira el host de <body> al destruir el componente.
   *
   * Como el nodo se movió fuera de su posición original, Angular no lo
   * eliminaría del DOM por sí solo al destruir la vista, y quedaría un
   * drawer huérfano en <body> cada vez que se navega a otra ruta.
   */
  ngOnDestroy(): void {
    this.host.remove();
  }

  onFilter() {
    this.filter.emit();

    if (this.closeOnFilter()) {
      this.opened.set(false);
    }
  }

  onClear() {
    this.clear.emit();
  }

  onClose() {
    this.opened.set(false);
  }
}
