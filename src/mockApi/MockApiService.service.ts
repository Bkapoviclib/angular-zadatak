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
import { LoginData } from './login-form-interface';

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

    //Request body
    const data: any = requestInfo.utils.getJsonBody(requestInfo.req);
    //String imena kolekcije iz requesta (npr userData ili login)
    const endpoint: string = requestInfo.collectionName;
    //Objekt koji sadrži sve kolekcije
    const dbRef: any = requestInfo.utils.getDb();

    //Ako je login, provjeri postoji li kombinacija username/lozinka u userData kolekciji
    if (endpoint === 'login') {
      let res: boolean;
      dbRef.userData.some(
        (user: any) =>
          (user.username == data.username && user.lozinka == data.lozinka) ||
          (data.username == 'admin' && data.lozinka == 'admin')
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
    } else if (endpoint === 'oibValidator') {
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
