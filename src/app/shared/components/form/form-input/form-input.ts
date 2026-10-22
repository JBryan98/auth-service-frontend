import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormValueControl, ValidationError, WithOptionalFieldTree } from '@angular/forms/signals';
import { MatButtonModule } from '@angular/material/button';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { SyncErrorState } from '../sync-error-state';

export type FormInputType = 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';

/**
 * Input reutilizable basado en Angular Material, compatible con Signal Forms.
 *
 * Uso:
 *   <app-form-input label="Correo" type="email" [formField]="form.email" />
 *
 * - Siempre ocupa el 100% del ancho de su contenedor.
 * - Siempre usa appearance="outline" y subscriptSizing="dynamic".
 */
@Component({
  selector: 'app-form-input',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, SyncErrorState],
  templateUrl: './form-input.html',
  styleUrl: './form-input.css',
})
export class FormInput implements FormValueControl<string> {
  // ── Requerido por FormValueControl ────────────────────────────────────────
  readonly value = model<string>('');

  // ── Estado de interacción (el control notifica con `touch`) ───────────────
  readonly touched = input<boolean>(false);
  readonly touch = output<void>();

  // ── Estado gestionado por el formulario ───────────────────────────────────
  readonly disabled = input<boolean>(false);
  readonly readonly = input<boolean>(false);
  readonly hidden = input<boolean>(false);
  readonly invalid = input<boolean>(false);
  readonly errors = input<readonly WithOptionalFieldTree<ValidationError>[]>([]);

  // ── Restricciones provenientes del schema ─────────────────────────────────
  readonly required = input<boolean>(false);
  readonly maxLength = input<number | undefined>(undefined);
  readonly name = input<string>('');

  // ── Configuración propia del componente ───────────────────────────────────
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly hint = input<string>('');
  readonly type = input<FormInputType>('text');
  readonly prefixIcon = input<string>('');
  readonly autocomplete = input<string>('off');

  protected readonly hidePassword = signal(true);

  protected readonly visibleErrors = computed(() =>
    this.touched() && this.invalid() ? this.errors() : [],
  );

  protected readonly inputType = computed<FormInputType>(() =>
    this.type() === 'password' && !this.hidePassword() ? 'text' : this.type(),
  );

  /**
   * Determina cuándo `matInput` entra en estado de error, a partir de las señales
   * que entrega Signal Forms (ignora el `control` porque no existe un NgControl).
   * `SyncErrorState` fuerza su reevaluación en cada ciclo de detección de cambios.
   */
  protected readonly errorMatcher: ErrorStateMatcher = {
    isErrorState: () => this.invalid() && this.touched(),
  };

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }

  protected togglePasswordVisibility(): void {
    this.hidePassword.update((hidden) => !hidden);
  }
}
