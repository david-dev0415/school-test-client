import { Component, OnDestroy, OnInit } from '@angular/core';
import * as jQuery from 'jquery';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  currentAuth: boolean = false;
  constructor() {    
  }

  ngOnInit(): void {
    const valueLocalStorage = localStorage.getItem('token');
    if (valueLocalStorage != null) {
      this.currentAuth = true;
    }
  }

  ngOnDestroy(): void {
    localStorage.clear();
  }
}
