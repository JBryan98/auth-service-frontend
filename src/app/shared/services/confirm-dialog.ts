import { inject, Service } from '@angular/core';
import { ConfirmDialog } from '../components/dialog/confirm-dialog/confirm-dialog';
import { ConfirmDialogData } from '../interfaces/dialog';
import { ModalService } from './modal';

@Service()
export class ConfirmDialogService {
  private readonly modalService = inject(ModalService);

  open(data: ConfirmDialogData) {
    return this.modalService.open(ConfirmDialog, data, {
      width: '720px',
      disableClose: true,
      autoFocus: false,
    });
  }
}
