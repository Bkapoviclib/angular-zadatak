import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { DeleteDialogComponent } from './delete-dialog.component';
import { DialogData } from './form-dialog-model';
@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  confirmDialog(data: DialogData): Observable<boolean> {
    return this.dialog
      .open(DeleteDialogComponent, {
        data,
      })
      .afterClosed();
  }
}
