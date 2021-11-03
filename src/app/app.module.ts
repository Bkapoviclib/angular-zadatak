import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { MockApiService } from '../mockApi/MockApiService.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatCardModule } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { CrudContainerComponent } from './crud-container/crud-container.component';
import { TableComponent } from './crud-container/table/table.component';
import { FormComponent } from './crud-container/form/form.component';
import { WildcardRouteComponent } from './wildcard-route/wildcard-route.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DeleteDialogComponent,
    CrudContainerComponent,
    TableComponent,
    FormComponent,
    WildcardRouteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    HttpClientModule,
    HttpClientInMemoryWebApiModule.forRoot(MockApiService),
    MatDialogModule,
  ],
  providers: [],

  bootstrap: [AppComponent],
})
export class AppModule {}
