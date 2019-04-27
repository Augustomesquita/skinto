import { Component, OnInit, OnChanges } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-dialog-match',
  templateUrl: './dialog-match.component.html',
  styleUrls: ['./dialog-match.component.scss']
})
export class DialogMatchComponent implements OnInit {

  date = new FormControl(new Date(), Validators.required);

  matchForm = new FormGroup({
    player: new FormControl('Augusto', Validators.required),
    result: new FormControl('true', Validators.required),
    champion: new FormControl('', Validators.required),
    date: this.date,
  });

  constructor(public dialogRef: MatDialogRef<DialogMatchComponent>) { }
  // ,@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  ngOnInit(): void {

  }


  backClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.log(this.matchForm.status);
    console.log(this.matchForm.value);
  }

}
