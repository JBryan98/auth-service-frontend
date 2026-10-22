import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AlertSeverity, AlertVariant } from '../../interfaces/alert';

const ICONS: Record<AlertSeverity, string> = {
  success: 'check_circle',
  info: 'info',
  warning: 'report_problem',
  error: 'error',
};

@Component({
  selector: 'app-alert',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Alert {
  severity = input<AlertSeverity>('info');
  variant = input<AlertVariant>('standard');
  alertTitle = input<string>();
  closable = input(false);
  closed = output<void>();

  actionLabel = input<string>();
  action = output<void>();

  iconName = computed(() => ICONS[this.severity()]);
  rootClass = computed(() => `alert-${this.severity()} alert-${this.variant()}`);
}
