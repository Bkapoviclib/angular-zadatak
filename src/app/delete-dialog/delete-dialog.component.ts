import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from './form-dialog-model';

@Component({
  selector: 'delete-dialog-component',
  templateUrl: 'delete-dialog.component.html',
})
export class DeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
