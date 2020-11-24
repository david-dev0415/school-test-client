import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

// Environment
import { environment } from '../../environments/environment.prod';

// Models
import { UserModel } from '../models/user.model';
import { UserStudentModel } from '../models/user.student.model';

@Injectable({
  providedIn: 'root'
})
export class AuthFirebase {

  private url = environment.firebase.url;
  private apiKey = environment.firebase.apiKey;
  private firebaseApi = environment.firebaseApi.url;

  userToken: string;

  constructor(private http: HttpClient) { 
    this.getToken();
  }

  login(user: UserModel) {

    const authData = {
      email: user.email.trim(),
      password: user.password.trim(),
      returnSecureToken: true
    };

    return this.http.post(`${this.url}accounts:signInWithPassword?key=${this.apiKey}`, authData)
      .pipe(
        map(resp => {
          this.saveToken(resp['idToken'], 1);
          return resp;
        })
      )
  }

  loginStudent(user: UserStudentModel) {
    
    const bodyRequest = {
      fullName: user.fullName,
      grade: user.grade
    }

    return this.http.post(`${this.firebaseApi}/studentsLogin`, bodyRequest)
      .pipe(
        map(resp => {
          this.saveToken(resp['token'], 0);
          return resp;
        })
      )
  }

  private saveToken(token: string, type: number) {
    this.userToken = token;

    if (type == 0) {
      localStorage.setItem('token', token + "_student");
    } else {
      localStorage.setItem('token', token);
    }

    let today = new Date();
    today.setSeconds(3600);

    localStorage.setItem('expiresIn', today.getTime().toString());
  }

  getToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  currentAuth(): boolean {

    if (this.userToken.length < 2 || this.userToken.indexOf('_student') > 0) {
      return false;
    }

    const expiresIn = Number(localStorage.getItem('expiresIn'));
    const expiresDate = new Date();
    expiresDate.setTime(expiresIn);

    return expiresDate > new Date() ? true : false;

  }

  currentAuthStudent(): boolean {

    if (this.userToken.length < 2) {
      return false;
    }
    
    const expiresIn = Number(localStorage.getItem('expiresIn'));
    const expiresDate = new Date();
    expiresDate.setTime(expiresIn);

    return expiresDate > new Date() && this.getToken().indexOf('_student') > 0 ? true : false;

  }

  logout() {
    localStorage.clear();    
   }

}
