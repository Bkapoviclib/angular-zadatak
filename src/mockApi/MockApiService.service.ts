import {
  InMemoryDbService,
  RequestInfo,
  STATUS,
  ResponseOptions,
} from 'angular-in-memory-web-api';
import korisnici from './korisnici.json';
import drzave from './drzave.json';
import { Injectable } from '@angular/core';
import { checkEndpoint } from './endpointSwitchRouting';

@Injectable({
  providedIn: 'root',
})

//Mock Api importa JSON i stvara kolekcije
export class MockApiService implements InMemoryDbService {
  createDb() {
    const drzaveData = [...drzave.drzave];
    const userData = [...korisnici.korisnici];
    return { userData, drzaveData };
  }

  //Override za post metodu
  post(requestInfo: RequestInfo) {
    //provjerava endpoint (login/oibValidator/userData)
    let options = checkEndpoint(requestInfo);
    if (options) {
      return requestInfo.utils.createResponse$(() => options);
    }
    //ako ne vrati opcije, koristi default post metodu
    return undefined;
  }
}
