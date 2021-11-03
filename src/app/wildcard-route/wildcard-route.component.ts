import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-wildcard-route',
  templateUrl: './wildcard-route.component.html',
  styleUrls: ['./wildcard-route.component.css'],
})
export class WildcardRouteComponent implements OnInit {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/app-login']);
  }
  ngOnInit(): void {}
}
