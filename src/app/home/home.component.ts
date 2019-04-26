import { Component, OnInit } from '@angular/core';
import { AnonymousCredential, RemoteMongoClient, Stitch } from 'mongodb-stitch-browser-sdk';
import { Match } from './match.model';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  matchs: MatTableDataSource<Match>;
  displayedColumns: string[] = ['player', 'champion', 'date'];

  constructor() {}

  ngOnInit() {
    const client = Stitch.initializeDefaultAppClient('skinto-irfcd');
    const db = client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas-skinto').db('skinto');

    client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(() =>
        db
          .collection('historical')
          .find()
          .asArray()
      )
      .then(docs => {
        docs.forEach(element => {
          this.matchs = new MatTableDataSource(docs as Match[]);
        });
      })
      .catch(err => {
        console.error(err);
      });

    console.log(client);
  }

  getDateFromLong(dateLong: number): string {
    const dateString = new Date(dateLong).getDate().toLocaleString();
    console.log(dateString)
    return dateString;
  }

}
