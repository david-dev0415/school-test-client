import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthFirebase } from 'src/app/services/auth.service';

@Component({
  selector: 'app-navbar-brand',
  templateUrl: './navbar-brand.component.html',
  styleUrls: ['./navbar-brand.component.css']
})
export class NavbarBrandComponent implements OnInit {

  constructor(private auth: AuthFirebase,
    private router: Router) { }

  ngOnInit(): void {
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/index');
  }

}
