import {
  InMemoryDbService,
  RequestInfo,
  STATUS,
  ResponseOptions,
} from 'angular-in-memory-web-api';
import korisnici from './korisnici.json';
import drzave from './drzave.json';
import { isOibValid } from './oibValidationScript';
import { Injectable } from '@angular/core';

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
    //Skuplja podatke iz requestInfo metode koja pruža request objekt
    const data = requestInfo.utils.getJsonBody(requestInfo.req);
    const collectionName = requestInfo.collectionName;
    const len = Object.keys(data).length;

    //Ako je login, provjeri postoji li kombinacija username/lozinka u bazi
    if (len == 2) {
      const collection = requestInfo.collection;
      let res: boolean;

      collection.some(
        (user: any) =>
          user.username == data.username && user.lozinka == data.password
      )
        ? (res = true)
        : (res = false);
      //Body responsa vraća boolean
      const options: ResponseOptions = {
        body: { res },
        status: STATUS.OK,
        headers: requestInfo.headers,
        url: requestInfo.url,
      };
      return requestInfo.utils.createResponse$(() => options);
      //Ako je zahtjev za asinkronu OIB validaciju
    } else if (collectionName === 'oibValidator') {
      const data = requestInfo.utils.getJsonBody(requestInfo.req);

      let res = isOibValid(data);
      const options: ResponseOptions = {
        body: { res },
        status: STATUS.OK,
        headers: requestInfo.headers,
        url: requestInfo.url,
      };
      return requestInfo.utils.createResponse$(() => options);
    }
    //Ako nije ni login, ni oib validacija, koristi default post metodu
    return undefined;
  }
}
