import { Component, OnInit, Output, SimpleChanges } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserData } from './userInterface';
import { Drzave } from './drzaveInterface';
import { observable, Observable, of } from 'rxjs';
import { DataSource } from '@angular/cdk/collections';
@Component({
  selector: 'app-crud-container',
  templateUrl: './crud-container.component.html',
  styleUrls: ['./crud-container.component.css'],
})

//Parent klasa master-detail dijela
export class CrudContainerComponent implements OnInit {
  constructor(private http: HttpClient) {}

  //Početni state
  dataSource: Array<UserData> = [];
  drzave: Array<Drzave> = [];
  formData: any = {
    id: '0',
    username: '',
    ime: '',
    prezime: '',
    lozinka: '',
    oib: '',
    drzava: '',
  };
  current_id: any = 0;

  //metode za komunikaciju među komponentama
  updateDataSource($event: any) {
    this.dataSource = [...$event];
  }
  updateForm($event: any) {
    this.formData = { ...$event };
  }
  updateCurrentId($event: any) {
    this.current_id = $event;
  }
  //dohvat početnog statea sa mock Api-ja
  ngOnInit(): void {
    this.http
      .get('/api/userData')
      .subscribe((users: any) => (this.dataSource = users));
    this.http
      .get('/api/drzaveData')
      .subscribe((drzave: any) => (this.drzave = drzave));
  }
}
