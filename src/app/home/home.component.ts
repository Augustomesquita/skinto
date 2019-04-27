import { Component, OnChanges, OnInit } from '@angular/core';
import { DialogPosition, MatDialog, MatTableDataSource } from '@angular/material';
import {
  AnonymousCredential,
  RemoteMongoClient,
  RemoteMongoDatabase,
  Stitch,
  StitchAppClient,
} from 'mongodb-stitch-browser-sdk';

import { DialogMatchComponent } from './dialog-match/dialog-match.component';
import { Globals } from './globals.util';
import { Match } from './match.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnChanges {

  matchs: MatTableDataSource<Match>;

  displayedColumns: string[] = ['player', 'champion', 'date'];

  client: StitchAppClient;
  db: RemoteMongoDatabase;

  ranking: any[] = [
    {
      name: 'augusto',
      score: 0
    },
    {
      name: 'alexandre',
      score: 0
    },
    {
      name: 'andré',
      score: 0
    }
  ];

  constructor(public matchDialog: MatDialog, private globals: Globals) {}

  ngOnInit() {
    this.client = Stitch.initializeDefaultAppClient(this.globals.atlasClientIpId);
    this.db = this.client
      .getServiceClient(RemoteMongoClient.factory, this.globals.atlasServiceName)
      .db(this.globals.atlasDb);

    this.updateMatchsAndRanking();
  }

  ngOnChanges(): void {
    if (this.client && this.db){
      this.updateMatchsAndRanking();
    }
  }

  updateMatchsAndRanking() {
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() =>
        this.db
          .collection('historical')
          .aggregate([{ $sort: { date: -1 } }])
          .asArray()
      )
      .then(docs => {
        this.matchs = new MatTableDataSource(docs as Match[]);
        this.updateRanking();
      })
      .catch(err => {
        console.error(err);
      });
  }

  getDateFromLong(dateLong: number): string {
    const dateString = new Date(dateLong).getDate().toLocaleString();
    console.log(dateString);
    return dateString;
  }

  updateRanking() {
    this.matchs.data.forEach(element => {
      switch (element.player.toLowerCase()) {
        case this.ranking[0].name:
          this.ranking[0].score++;
          break;

        case this.ranking[1].name:
          this.ranking[1].score++;
          break;

        case this.ranking[2].name:
          this.ranking[2].score++;
          break;
      }
    });

    this.ranking.sort(this.sortByScore);
  }

  sortByScore(a, b) {
    if (a.score < b.score) {
      return 1;
    }
    if (a.score > b.score) {
      return -1;
    }
    return 0;
  }

  getWinnerClassName(): string {
    if (this.ranking && this.ranking.length > 0) {
      return this.ranking[0].name + '-winning';
    }
  }

  openDialogToCreateNewMatch(event): void {

    const dialogPosition: DialogPosition = {
      top: event.y + 'px',
      left: event.x + 'px',
    };

    console.log(dialogPosition)

    const dialogRef = this.matchDialog.open(DialogMatchComponent, {
      width: '250px',
      data: { name: 'teste' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
