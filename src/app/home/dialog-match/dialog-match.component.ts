import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import {
  AnonymousCredential,
  RemoteMongoClient,
  RemoteMongoDatabase,
  Stitch,
  StitchAppClient,
} from 'mongodb-stitch-browser-sdk';

import { Globals } from '../globals.util';

@Component({
  selector: 'app-dialog-match',
  templateUrl: './dialog-match.component.html',
  styleUrls: ['./dialog-match.component.scss']
})
export class DialogMatchComponent {

  date = new FormControl(new Date(), Validators.required);

  client: StitchAppClient;
  db: RemoteMongoDatabase;

  matchForm = new FormGroup({
    player: new FormControl('Augusto', Validators.required),
    result: new FormControl('true', Validators.required),
    champion: new FormControl('', Validators.required),
    date: this.date,
  });

  constructor(public dialogRef: MatDialogRef<DialogMatchComponent>, private snackBar: MatSnackBar, private globals: Globals) { }
  // ,@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  backClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.matchForm.valid) {
      const matchToPost = this.matchForm.value;
      matchToPost.date = matchToPost.date.getTime(); // Passa para millis

      this.client = Stitch.getAppClient(this.globals.atlasClientIpId);
      this.db = this.client
        .getServiceClient(RemoteMongoClient.factory, this.globals.atlasServiceName)
        .db(this.globals.atlasDb);

      if (this.client && this.db) {
        this.client.auth
          .loginWithCredential(new AnonymousCredential())
          .then(() =>
            this.db
              .collection('historical')
              .insertOne(matchToPost)
          )
          .then(result => {
            if (result.insertedId) {
              this.snackBar.open('Partida adicionada com sucesso.', 'Pronto!');
              console.log('ADICIONADO COM SUCESSO!', result.insertedId);
            }
          })
          .finally(() => {
            this.dialogRef.close();
          })
          .catch(err => {
            this.snackBar.open('Falha no envio de dados.', 'Erro.');
            console.error('ERRO AO ADICIONAR REGISTRO.', err);
          });
      } else {
        this.snackBar.open('Comunicação com o CloudBD indisponível no momento. Recarregue a página ou tente mais tarde.', 'Ops!', {
          duration: 6000
        });
        this.dialogRef.close();
      }

    }
  }

}
