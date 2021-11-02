import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

//Komponenta za login
export class LoginComponent {
  constructor(private router: Router, private http: HttpClient) {}

  //Form group za login formu
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  //Submit handler za formu
  handleSubmit(): void {
    //Ako je forma validna, post na mockApi sa vrijednostima iz forme
    if (this.loginForm.valid) {
      this.http
        .post('api/login/', {
          username: this.loginForm.value.username,
          lozinka: this.loginForm.value.password,
        })
        //Mock api vraća true ili false, po uspjehu stavi username u session storage
        // i route na formu
        .subscribe((message: any) => {
          if (message.res) {
            sessionStorage.setItem('username', this.loginForm.value.username);
            this.router.navigate(['/app-form']);
          } else {
            this.loginForm.setErrors({ invalidLogin: 'invalid login' });
          }
        });
    }
  }
  //setanje errora
  getError() {
    if (this.loginForm.hasError('required')) {
      return 'Molimo unesite username i lozinku';
    }
    return this.loginForm.hasError('invalidLogin') ? 'Krivi login podatci' : '';
  }
}
