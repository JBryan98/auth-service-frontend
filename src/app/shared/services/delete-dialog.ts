import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { DeleteDialog } from '../components/dialog/delete-dialog/delete-dialog';
import { DeleteDialogData } from '../interfaces/dialog';
import { ModalService } from './modal';

@Service()
export class DeleteDialogService {
  private readonly modalService = inject(ModalService);

  open(data: DeleteDialogData): Observable<boolean | undefined> {
    return this.modalService.open(DeleteDialog, data, {
      width: '720px',
      disableClose: true,
      autoFocus: false,
    });
  }
}
