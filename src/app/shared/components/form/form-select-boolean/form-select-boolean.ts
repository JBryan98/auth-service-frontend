import { Component, computed, input, model, output } from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect, MatSelectChange, MatSelectModule } from '@angular/material/select';
import { SyncErrorState } from '../sync-error-state';

@Component({
  imports: [MatFormFieldModule, MatSelectModule, MatIconModule, SyncErrorState],
  selector: 'app-form-select-boolean',
  styleUrl: './form-select-boolean.css',
  templateUrl: './form-select-boolean.html',
})
export class FormSelectBoolean implements FormValueControl<boolean | null> {
  readonly value = model.required<boolean | null>();

  // ── Estado de interacción (el control notifica con `touch`) ───────────────
  readonly touched = input<boolean>(false);
  readonly touch = output<void>();

  // ── Estado gestionado por el formulario ───────────────────────────────────
  readonly disabled = input<boolean>(false);
  /** mat-select no soporta `readonly`; se muestra deshabilitado pero conserva el valor. */
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  // ── Restricciones provenientes del schema ─────────────────────────────────
  readonly required = input<boolean>(false);

  // ── Configuración propia del componente ───────────────────────────────────
  readonly label = input<string>('');
  readonly trueLabel = input<string>('Sí');
  readonly falseLabel = input<string>('No');
  readonly emptyLabel = input<string>('No especificado');
  readonly placeholder = input<string>('');
  readonly hint = input<string>('');
  readonly prefixIcon = input<string>('');

  /** Útil cuando los valores son objetos (p. ej. comparar por `id`). */
  readonly compareWith = input<(a: boolean | null, b: boolean | null) => boolean>(
    (a, b) => a === b,
  );

  protected readonly visibleErrors = computed(() =>
    this.touched() && this.invalid() ? this.errors() : [],
  );

  /** Opciones seleccionadas, en el mismo orden en que se muestran en el panel. */
  // protected readonly selectedOptions = computed(() => {
  //   const selected = this.value() ?? [];
  //   const compare = this.compareWith();
  //   return this.options().filter((option) => selected.some((v) => compare(option.value, v)));
  // });

  /**
   * Determina cuándo `mat-select` entra en estado de error, a partir de las señales
   * que entrega Signal Forms (ignora el `control` porque no existe un NgControl).
   * `SyncErrorState` fuerza su reevaluación en cada ciclo de detección de cambios.
   */
  protected readonly errorMatcher: ErrorStateMatcher = {
    isErrorState: () => this.invalid() && this.touched(),
  };

  protected onSelectionChange(event: MatSelectChange): void {
    this.value.set(event.value);
  }

  /** Se considera "tocado" cuando el panel se cierra. */
  protected onOpenedChange(opened: boolean): void {
    if (!opened) {
      this.touch.emit();
    }
  }

  /** Igual que Material: el blur no cuenta mientras el panel está abierto. */
  protected onBlur(select: MatSelect): void {
    if (!select.panelOpen) {
      this.touch.emit();
    }
  }
}
