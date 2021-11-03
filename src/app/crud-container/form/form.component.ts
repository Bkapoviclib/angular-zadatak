import {
  Component,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DialogService } from '../../delete-dialog/dialogService.service';
import { MatTable } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UserData } from '../userInterface';
import { Drzave } from '../drzaveInterface';

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
export class FormComponent implements OnChanges {
  constructor(private http: HttpClient, private dialogService: DialogService) {}

  @Input() dataSource: Array<UserData> = [];
  @Input() drzave: Array<Drzave> = [];
  @Input() current_id: number = 0;
  @Input() formValue: any = {};

  @Output() newDataSourceEvent = new EventEmitter<Array<UserData>>();
  @Output() currentIdUpdate = new EventEmitter();

  //Output metode
  updateCurrentId(value: any) {
    this.currentIdUpdate.emit(value);
  }
  updateDataSource(value: Array<UserData>) {
    this.newDataSourceEvent.emit(value);
  }

  table!: MatTable<any>;

  isCreatingNewUser: boolean = false;

  detailsForm = new FormGroup({
    id: new FormControl(),
    username: new FormControl(),
    ime: new FormControl(''),
    prezime: new FormControl(''),
    lozinka: new FormControl(''),
    oib: new FormControl('', { asyncValidators: oibValidator(this.http) }),
    drzava: new FormControl('', [Validators.required]),
  });

  url = '/api/userData';

  httpOptions = {
    headers: new HttpHeaders({
      USER: "sessionStorage.getItem('username')",
    }),
  };

  //Generira jedinstveni ID
  generateId() {
    let currentMax = 0;
    this.dataSource.map((user: any) => {
      if (user.id > currentMax) {
        currentMax = parseInt(user.id);
      }
      return currentMax;
    });
    return currentMax + 1;
  }

  //Pokreće create mode, stavlja praznog korisnika u lokalni dataSource za preview unosa
  enableCreateMode() {
    this.isCreatingNewUser = true;
    let id = this.generateId().toString();
    let emptyUserWithFreshId = {
      id: id,
      username: '',
      ime: '',
      prezime: '',
      lozinka: '',
      oib: '',
      drzava: '',
    };

    this.dataSource.push(emptyUserWithFreshId);
    this.updateDataSource(this.dataSource);

    this.updateCurrentId(parseInt(id));
    this.current_id = parseInt(id);

    this.detailsForm.patchValue(emptyUserWithFreshId);

    this.detailsForm.setValue(this.getCurrentElement());
  }

  //Metode za popup dijalog (na brisanju ili spremanju)
  deleteDialog() {
    return this.dialogService.confirmDialog({
      title: 'Brisanje korisnika',
      message: 'Jeste li sigurni da želite izbrisati korisnika?',
      yesText: 'Da',
      noText: 'Ne',
    });
  }
  successDialog() {
    return this.dialogService.confirmDialog({
      title: 'Uspjeh!',
      message: 'Čestitam, uspješno ste spremili podatke za korisnika',
      yesText: 'Super!',
      noText: '',
    });
  }

  //Briše trenutno selektiranog korisnika
  deleteRow() {
    this.deleteDialog().subscribe((res: any) => {
      if (res == true) {
        this.http
          .delete(`api/userData/${this.current_id}`)
          .subscribe((res) => res);
        this.http
          .get('/api/userData')
          .subscribe((users: any) => this.updateDataSource(users));
        this.current_id = 0;
        this.detailsForm.reset();
      }
    });
  }
  //Za tipku Spremi, ako je forma validna i username unique, posta na mock Api
  saveUserDataToServer() {
    if (this.detailsForm.valid) {
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
        this.successDialog();
      } else {
        alert('username must be unique!');
      }
    }
  }

  //custom oib error
  getError() {
    if (this.detailsForm.hasError('required', 'oib')) {
      return 'Molimo unesite OIB';
    }
    return this.detailsForm.hasError('oibError', 'oib')
      ? 'Neispravan OIB!'
      : '';
  }

  //Dohvaća objekt trenutno selektiranog korisnika
  getCurrentElement(): any {
    return this.dataSource.find(
      (user: any) => user.id == this.current_id.toString()
    );
  }

  //Realtime promjene u preview-u tablice
  handleChange(arg: string) {
    this.getCurrentElement()
      ? (this.getCurrentElement()[arg] = this.detailsForm.value[arg])
      : null;
    this.updateDataSource(this.dataSource);
  }

  //Detektira promjene na formValue (npr. klikom na drugog korisnika)

  ngOnChanges(changes: SimpleChanges) {
    if (changes.formValue) {
      this.isCreatingNewUser = false;
      this.detailsForm.setValue(this.formValue);
    }
  }
}
