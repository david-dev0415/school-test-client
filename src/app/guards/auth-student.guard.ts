import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthFirebase } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStudentGuard implements CanActivate {
  constructor(private auth: AuthFirebase, private router: Router) { }

  canActivate(): boolean {
    if (this.auth.currentAuthStudent()) {    
      return true;
    } else {

      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un inconveniente al intentar acceder a la ruta.',
        icon: 'error',
        showConfirmButton: false,
        timer: 3000
      })

      this.router.navigateByUrl('/index');
      localStorage.clear();
      return false;         
    }
  }
  
}
