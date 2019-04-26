import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-match',
  templateUrl: './dialog-match.component.html',
  styleUrls: ['./dialog-match.component.scss']
})
export class DialogMatchComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogMatchComponent>){}
    // ,@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
