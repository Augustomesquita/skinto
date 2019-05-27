import { Component, Inject, EventEmitter, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import {
  AnonymousCredential,
  RemoteMongoClient,
  RemoteMongoDatabase,
  Stitch,
  StitchAppClient
} from 'mongodb-stitch-browser-sdk';
import { Globals } from '../home/globals.util';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dialog-match',
  templateUrl: './dialog-match.component.html',
  styleUrls: ['./dialog-match.component.scss']
})
export class DialogMatchComponent implements OnInit {
  matchAdded = new EventEmitter();
  lastDateChangedInMillis = new Date().getTime();

  championControl = new FormControl('', Validators.required);

  date = new FormControl(new Date(), Validators.required);
  client: StitchAppClient;
  db: RemoteMongoDatabase;
  matchForm = new FormGroup({
    player: new FormControl('Augusto', Validators.required),
    result: new FormControl('true', Validators.required),
    champion: this.championControl,
    perfect: new FormControl(false),
    date: this.date
  });

  championList: string[];
  filteredChampionList: Observable<string[]>;

  constructor(
    public dialogRef: MatDialogRef<DialogMatchComponent>,
    private snackBar: MatSnackBar,
    private globals: Globals,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.http
      .get<any>(
        'http://ddragon.leagueoflegends.com/cdn/9.10.1/data/pt_BR/champion.json'
      )
      .subscribe(data => {
        this.championList = Object.keys(data.data);
        this.filteredChampionList = this.championControl.valueChanges.pipe(
          startWith(''),
          map(value => this._filter(value))
        );
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.championList.filter(option =>
      option.toLowerCase().includes(filterValue)
    );
  }

  backClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    if (this.matchForm.valid) {
      const matchToPost = this.matchForm.value;
      matchToPost.date = this.lastDateChangedInMillis; // Passa para millis

      this.client = Stitch.getAppClient(this.globals.atlasClientIpId);
      this.db = this.client
        .getServiceClient(
          RemoteMongoClient.factory,
          this.globals.atlasServiceName
        )
        .db(this.globals.atlasDb);

      if (this.client && this.db) {
        this.client.auth
          .loginWithCredential(new AnonymousCredential())
          .then(() => this.db.collection('historical').insertOne(matchToPost))
          .then(result => {
            if (result.insertedId) {
              this.snackBar.open('Partida adicionada com sucesso.', 'Pronto!', {
                duration: 3000
              });
              this.matchAdded.emit();
              this.dialogRef.close();
            } else {
              this.snackBar.open(
                'Falha salvar dados no banco, tente novamente.',
                'Ops!'
              );
            }
          })
          .catch(err => {
            this.snackBar.open('Falha no envio de dados.', 'Erro.');
            console.error('ERRO AO ADICIONAR REGISTRO.', err);
          });
      } else {
        this.snackBar.open(
          'Comunicação com o CloudBD indisponível no momento. Recarregue a página ou tente mais tarde.',
          'Ops!',
          {
            duration: 6000
          }
        );

        this.dialogRef.close();
      }
    }
  }

  dateChanged(event) {
    this.lastDateChangedInMillis = event.target.value.getTime();

    const dateNow = new Date(); // Para adicionar horas, minutos e segundos ao milli da data.

    this.lastDateChangedInMillis += this.milisecondsFromHourMinutesAndSeconds(
      dateNow.getHours(),
      dateNow.getMinutes(),
      dateNow.getSeconds()
    );
  }

  milisecondsFromHourMinutesAndSeconds(hrs: number, min: number, sec: number) {
    return (hrs * 60 * 60 + min * 60 + sec) * 1000;
  }
}
