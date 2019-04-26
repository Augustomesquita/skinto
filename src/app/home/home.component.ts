import { Component, OnInit } from '@angular/core';
import {
  AnonymousCredential,
  RemoteMongoClient,
  Stitch
} from 'mongodb-stitch-browser-sdk';
import { Match } from './match.model';
import { MatTableDataSource, MatDialogRef, MatDialog, DialogPosition } from '@angular/material';
import { DialogMatchComponent } from './dialog-match/dialog-match.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  matchs: MatTableDataSource<Match>;

  displayedColumns: string[] = ['player', 'champion', 'date'];

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

  constructor(public matchDialog: MatDialog) {}

  ngOnInit() {
    const client = Stitch.initializeDefaultAppClient('skinto-irfcd');
    const db = client
      .getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas-skinto')
      .db('skinto');

    client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() =>
        db
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

    console.log(client);
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
      right: '0px'

    };

    console.log(dialogPosition)

    const dialogRef = this.matchDialog.open(DialogMatchComponent, {
      width: '250px',
      position: dialogPosition,
      data: { name: 'teste' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
