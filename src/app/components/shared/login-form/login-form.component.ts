import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { UserModel } from 'src/app/models/user.model';
import { UserStudentModel } from 'src/app/models/user.student.model';

import { AuthFirebase } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css'],
})
export class LoginFormComponent implements OnInit, OnDestroy {
  formText: any = {};
  animatedFadeForm: 'animated fadeInLeft';
  buttonValue: number = 0; // Para el animated *
  formDefault: number = 0;
  private sub: any;
  user: UserModel = new UserModel();
  userStudent: UserStudentModel = new UserStudentModel();

  constructor(private auth: AuthFirebase, private router: Router) {
  }

  resetFormValues() {
    this.user.username = '';
    this.user.password = '';
    this.user.email = '';
    this.userStudent.fullName = '';
    this.userStudent.grade = '';
  }

  onSubmit(form: NgForm) {

    if (form.invalid) return;

    // Referencia: si el botón cambia a 'Ingresar', se puede realizar la petición.

    if (this.formDefault == 1) {

      Swal.fire({
        allowOutsideClick: false,
        text: 'Espere por favor...',
        icon: 'info'
      })

      Swal.showLoading();
        
      this.sub = this.auth.login(this.user)
        .subscribe(resp => {          
          Swal.close();
          this.router.navigateByUrl('/home');
        }, err => {
          Swal.fire({
            title: 'Error al autenticar',
            icon: 'error',
            text: 'Las credenciales no son correctas',
            showConfirmButton: false,
            timer: 2500
          })            
        })
      
      // if (this.sub.closed) this.sub.unsubscribe();

    } else {
      Swal.fire({
        allowOutsideClick: false,
        text: 'Espere por favor...',
        icon: 'info'
      });

      Swal.showLoading();      
          
      this.sub = this.auth.loginStudent(this.userStudent)
        .subscribe(resp => {
          const userStudent = {
            fullName: resp['data']['userStudent']['fullName'],
            grade: resp['data']['userStudent']['grade'],
            id: resp['id']
          }                  
          localStorage.setItem('data', JSON.stringify(userStudent));
          Swal.close();
          this.router.navigateByUrl('/question-homepage');
        }, err => {            
            Swal.fire({
              text: 'Lo sentimos, ha ocurrido un error. ',
              icon: 'error',
              showConfirmButton: false,
              timer: 2500
            });

        })
    }

  }

  ngOnInit(): void {
    localStorage.clear();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }


}
