import { Component, OnInit, EventEmitter } from '@angular/core';
import { DialogMatchComponent } from '../dialog-match/dialog-match.component';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {

  matchDeleted = new EventEmitter();

  constructor(public dialogRef: MatDialogRef<DialogMatchComponent>) { }

  ngOnInit() {
  }

  backClick(): void {
    this.dialogRef.close();
  }

  confirmDelete() {
    this.matchDeleted.emit();
  }

}
