import { Component, OnInit, Input, ViewChild } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DialogService } from '../delete-dialog/dialogService.service';
import { MatTable } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

// Asinkroni validator za OIB,
// radi poziv na mock Api, te dobija natrag boolean
const oibValidator = (http: HttpClient): AsyncValidatorFn => {
  return (control: AbstractControl) => {
    return http.post('/api/oibValidator', control.value).pipe(
      map((res: any) => {
        return res.res ? null : { oibError: 'true' };
      })
    );
  };
};

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})

//Komponenta za prikaz forme i tablice
export class FormComponent implements OnInit {
  @ViewChild(MatTable)
  table!: MatTable<any>;

  //Na initu dohvatiti podatke sa mock Api-ja,
  // puni lokalni izvor podataka koji emita promjene tablici
  ngOnInit(): void {
    this.http
      .get('/api/userData')
      .subscribe((users: any) => (this.dataSource = users));
    this.http
      .get('/api/drzaveData')
      .subscribe((drzave: any) => (this.drzave = drzave));
  }

  //Metoda za otvaranje potvrde brisanja korisnika
  openDialog() {
    return this.dialogService.confirmDialog({
      title: '',
      message: '',
      yesText: '',
      noText: '',
    });
  }

  //Kolumne za prikaz : id izostavljen
  displayedColumns: string[] = ['username', 'ime', 'prezime'];
  //Array spojen na tablicu kao izvor podataka
  dataSource: any = [];
  //Države dohvaćene sa mock Api-ja
  drzave: any = [];
  //Varijabla koja prati ID trenutno selektiranog korisnika
  current_id = 0;
  //Base url za većinu zahtjeva
  url = '/api/userData/';
  //Instanca httpHeadera
  httpOptions = {
    headers: new HttpHeaders({
      USER: "sessionStorage.getItem('username')",
    }),
  };
  //Za praćenje je li korisnik u create modu
  isCreatingNewUser: boolean = false;

  //Dohvaća error za asinkronu oib validaciju
  getError() {
    if (this.detailsForm.hasError('required', 'oib')) {
      return 'Molimo unesite OIB';
    }
    return this.detailsForm.hasError('oibError', 'oib')
      ? 'Neispravan OIB!'
      : '';
  }

  //Generira jedinstveni ID
  generateId() {
    let currentMax = 0;
    this.dataSource.map((user: any) => {
      if (user.id > currentMax) {
        currentMax = parseInt(user.id);
      } else {
      }
      return currentMax;
    });
    return currentMax + 1;
  }

  //Pokreće create mod, i stvara prazno polje na dnu tablice za preview podataka
  //(Ako se klikne van polja ono nestaje)
  createUser() {
    this.isCreatingNewUser = true;
    let id = this.generateId().toString();
    this.dataSource.push({
      id: id,
      username: '',
      ime: '',
      prezime: '',
      lozinka: '',
      oib: '',
      drzava: '',
    });
    this.detailsForm.setValue({
      id: id,
      username: '',
      ime: '',
      prezime: '',
      lozinka: '',
      oib: '',
      drzava: '',
    });
    this.current_id = parseInt(id);

    this.detailsForm.setValue(this.getCurrentElement());
    this.table.renderRows();
  }

  //Ako je forma validna, sprema podatke trenutno označenog korisnika u JSON,
  //Radi provjeru da je username unique
  saveUserDataToServer() {
    if (this.detailsForm.valid) {
      console.log(
        this.dataSource.some(
          (user: any) => user.username == this.detailsForm.value.username
        )
      );
      if (
        !this.dataSource.some(
          (user: any) =>
            user.username == this.detailsForm.value.username &&
            user.id !== this.detailsForm.value.id
        )
      ) {
        this.http
          .post(this.url, this.detailsForm.value, this.httpOptions)
          .subscribe((res) => res);
        this.http.get(this.url).subscribe((users: any) => {
          this.dataSource = users;
        });
        this.isCreatingNewUser = false;
      } else {
        alert('username must be unique!');
      }
    }
  }

  //Briše trenutno označenog korisnika nakon dijalog potvrde
  deleteRow() {
    this.openDialog().subscribe((res) => {
      if (res == true) {
        this.http
          .delete(`api/userData/${this.current_id}`, this.httpOptions)
          .subscribe((res) => res);
        this.http
          .get('/api/userData')
          .subscribe((users) => (this.dataSource = users));
        this.current_id = 0;
        this.detailsForm.reset();
      }
    });
  }

  //Form grupa za formu i pripadajuće kontrole
  detailsForm = new FormGroup({
    id: new FormControl(''),
    username: new FormControl(),
    ime: new FormControl(''),
    prezime: new FormControl(''),
    lozinka: new FormControl(''),
    oib: new FormControl('', { asyncValidators: oibValidator(this.http) }),
    drzava: new FormControl('', [Validators.required]),
  });

  //Dohvat objekta trenutno selektiranog korisnika iz lokalnog dataSourca
  getCurrentElement() {
    return this.dataSource.find((user: any) => user.id == this.current_id);
  }

  //Puni formu podatcima trenutno selektiranog korisnika
  updateForm(id: number) {
    this.current_id = id;
    this.http.get(this.url).subscribe((res) => (this.dataSource = res));
    this.detailsForm.setValue(this.getCurrentElement());
    this.isCreatingNewUser = false;
  }

  //Radi realtime promjene u lokalnom dataSourceu
  // (keyup event na poljima koja su vidljiva u tablici (username, ime, prezime))
  handleChange(atribute: string) {
    this.getCurrentElement()[atribute] = this.detailsForm.value[atribute];
    this.table.renderRows();
  }

  constructor(private http: HttpClient, private dialogService: DialogService) {}
}
