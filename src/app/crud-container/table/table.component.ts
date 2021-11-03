import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserData } from '../userInterface';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})

//Komponenta koja drži master tablicu
export class TableComponent {
  //dataSource je izvor podataka za tablicu, dolazi iz JSON kolekcije sa mock Api-ja
  @Input() dataSource: Array<UserData> = [];
  //Bool za toggle creation moda
  @Input() isCreatingNewUser: boolean = false;
  //Id trenutno selektiranog korisnika
  @Input() current_id: number = 0;

  constructor(private http: HttpClient) {}
  @Output() newDataSourceEvent = new EventEmitter<Array<UserData>>();
  @Output() newDetailsFormUpdate = new EventEmitter();
  @Output() currentIdUpdate = new EventEmitter();

  url = '/api/userData';
  displayedColumns = ['username', 'ime', 'prezime'];

  //Outup metode
  updateDataSource(value: Array<UserData>) {
    this.newDataSourceEvent.emit(value);
  }
  updateFormValue(value: any) {
    console.log(value);
    this.newDetailsFormUpdate.emit(value);
  }
  updateCurrentId(value: any) {
    this.currentIdUpdate.emit(value);
  }

  //Dohvat objekta trenutno selektiranog korisnika
  getCurrentElement() {
    return this.dataSource.find((user: any) => user.id == this.current_id);
  }
  //Klikom na red tablice stavlja update-a formValue koji se odražava u form komponenti
  updateForm(id: number) {
    this.current_id = id;
    this.updateCurrentId(id);
    this.updateFormValue(this.getCurrentElement());
    this.http.get(this.url).subscribe((res: any) => (this.dataSource = res));
    this.isCreatingNewUser = false;
  }
}
