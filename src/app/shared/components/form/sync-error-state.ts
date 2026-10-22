import { Directive, DoCheck, inject } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';

/**
 * `MatInput` y `MatSelect` solo recalculan su `errorState` en cada ciclo de detección
 * de cambios cuando tienen un `NgControl` (Reactive/Template-driven Forms). Con
 * Signal Forms no existe ese `NgControl`, así que su `errorState` se quedaría siempre
 * en `false` y `<mat-error>` nunca se mostraría.
 *
 * Esta directiva reevalúa el estado de error en cada ciclo llamando a la API pública
 * `updateErrorState()`, que consulta el `errorStateMatcher` del componente que la usa.
 *
 * Uso: <input matInput appSyncErrorState /> o <mat-select appSyncErrorState>.
 */
@Directive({
  selector: 'input[matInput][appSyncErrorState], mat-select[appSyncErrorState]',
})
export class SyncErrorState implements DoCheck {
  private readonly control =
    inject(MatInput, { self: true, optional: true }) ?? inject(MatSelect, { self: true });

  ngDoCheck(): void {
    this.control.updateErrorState();
  }
}
