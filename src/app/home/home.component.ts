import { Component, OnChanges, OnInit } from '@angular/core';
import { MatDialog, MatTableDataSource, MatSnackBar } from '@angular/material';
import {
  AnonymousCredential,
  RemoteMongoClient,
  RemoteMongoDatabase,
  Stitch,
  StitchAppClient,
  RemoteDeleteResult
} from 'mongodb-stitch-browser-sdk';

import { Globals } from './globals.util';
import { Match } from './match.model';
import { DialogMatchComponent } from '../dialog-match/dialog-match.component';
import { DialogConfirmComponent } from '../dialog-confirm/dialog-confirm.component';
import { NgxSpinnerService } from 'ngx-spinner';

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

  playerOnHotStreak: string = null;

  cursorStyle = 'default';

  ranking: any[] = [
    {
      name: 'Augusto',
      score: 0,
      lastChampion: 'Nunu'
    },
    {
      name: 'Alexandre',
      score: 0,
      lastChampion: 'Caitlyn'
    },
    {
      name: 'André',
      score: 0,
      lastChampion: 'Morgana'
    }
  ];

  constructor(
    public matchDialog: MatDialog,
    private snackBar: MatSnackBar,
    private globals: Globals,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.client = Stitch.initializeDefaultAppClient(
      this.globals.atlasClientIpId
    );
    this.db = this.client
      .getServiceClient(
        RemoteMongoClient.factory,
        this.globals.atlasServiceName
      )
      .db(this.globals.atlasDb);
    this.updateAtFixTime();
  }

  ngOnChanges(): void {
    if (this.client && this.db) {
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
    // Limpa score
    this.ranking[0].score = 0;
    this.ranking[1].score = 0;
    this.ranking[2].score = 0;

    let firstThreeRegisters = 0;

    let lastPlayer = this.matchs.data[0].player;
    let streakCount = 0;
    const streakPlayer = this.matchs.data[0].player;


    const copyMatchToOrdering = this.matchs.data;
    copyMatchToOrdering.sort(this.sortByDateAsc);

    copyMatchToOrdering.forEach(element => {
      // Atualiza jogador em Hot Streak
      if (firstThreeRegisters < 3) {
        firstThreeRegisters++;
        if (lastPlayer === element.player) {
          streakCount++;
        } else {
          streakCount = 0;
        }
        lastPlayer = element.player;
      }

      // Atualiza ranking
      switch (element.player) {
        case this.ranking[0].name:
          this.ranking[0].score++;
          this.ranking[0].lastChampion = element.champion;
          break;

        case this.ranking[1].name:
          this.ranking[1].score++;
          this.ranking[1].lastChampion = element.champion;
          break;

        case this.ranking[2].name:
          this.ranking[2].score++;
          this.ranking[2].lastChampion = element.champion;
          break;
      }

    });

    // Caso tenha havido um hot streak
    // atualiza o mesmo na interface.
    if (streakCount > 2) {
      this.playerOnHotStreak = streakPlayer;
    } else {
      this.playerOnHotStreak = null;
    }

    copyMatchToOrdering.sort(this.sortByDateDesc);
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

  sortByDateAsc(a, b) {
    if (a.date > b.date) {
      return 1;
    }
    if (a.date < b.date) {
      return -1;
    }
    return 0;
  }

  sortByDateDesc(a, b) {
    if (a.date < b.date) {
      return 1;
    }
    if (a.date > b.date) {
      return -1;
    }
    return 0;
  }

  getWinnerClassName(): string {
    if (this.ranking && this.ranking.length > 0) {
      return this.ranking[0].name.toLowerCase() + '-winning';
    }
  }

  getLastChampionWinnerBG(): object {
    return {
      background: 'url("../../assets/img/background/' + this.ranking[0].lastChampion + '_0.jpg") repeat center top',
      '-webkit-transition': 'background-image 2s ease-in-out',
      '-moz-transition': 'background-image 2s ease-in-out',
      '-o-transition': 'background-image 2s ease-in-out',
      transition: 'background-image 2s ease-in-out'
    };
  }

  openDialogToCreateNewMatch(): void {
    const dialogRef = this.matchDialog.open(DialogMatchComponent, {
      width: '250px',
      data: { successOperationDone: true }
    });

    dialogRef.componentInstance.matchAdded.subscribe(() => {
      this.updateMatchsAndRanking();
    });
  }

  openDialogToDeleteMatch(match: Match): void {
    const dialogRef = this.matchDialog.open(DialogConfirmComponent, {
      width: '250px'
    });

    dialogRef.componentInstance.matchDeleted.subscribe(() => {
      this.client.auth.loginWithCredential(new AnonymousCredential()).then(() =>
        this.db
          .collection('historical')
          .deleteOne({ _id: match._id })
          .then((res: RemoteDeleteResult) => {
            if (res.deletedCount > 0) {
              this.updateMatchsAndRanking();
              this.snackBar.open('Partida removida com sucesso.', 'Pronto!', {
                duration: 3000
              });
              dialogRef.close();
            } else {
              this.updateMatchsAndRanking();
              this.snackBar.open('Partida não encontrada.', 'Ops!', {
                duration: 3000
              });
            }
          })
      );
    });
  }

  updateAtFixTime() {
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
      })
      .finally(() => {
        this.spinner.hide();
        setTimeout(() => this.updateAtFixTime(), 5000);
      });
  }

  deleteMatch(matchToDelete: Match) {
    this.openDialogToDeleteMatch(matchToDelete);
  }

  changeCursorStyle($event) {
    this.cursorStyle = $event.type === 'mouseenter' ? 'pointer' : 'default';
  }

  paintRow(match): object {
    return {
      victory: (match.result || match.result === 'true') && !match.perfect,
      'victory-perfect': (match.result || match.result === 'true') && match.perfect,
      defeat: (!match.result || match.result === 'false') && !match.perfect,
      'defeat-perfect': (!match.result || match.result === 'false') && match.perfect,
    };
  }
}
