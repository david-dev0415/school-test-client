import { trigger } from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Group } from 'src/app/models/group.model';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';
// import * as jQuery from 'jquery';

@Component({
  selector: 'app-question-board',
  templateUrl: './test-board.component.html',
  styleUrls: ['./test-board.component.css']
})
export class TestBoardComponent implements OnInit, OnDestroy {

  ismodelShow: boolean = false;
  // Se podría crear un campo de tipo boolean sobre, mostrar el grupo.
  groups: Group[] = [];
  groupTemplate: Group = new Group();
  cardHeader: string = 'Grupo de pruebas';
  messageNoData: boolean = false;
  showSpinner: boolean = true;
  private sub: any;

  constructor(private transactionService: TransactionService, private router: Router) {
    setTimeout(() => {
      this.groupsRecords();
    }, 100)
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return false;

    const groupBody = {
      groupName: form.controls['groupName'].value,
      description: form.controls['descriptionGroup'].value || ''
    }

    this.newGroup(groupBody).then(data => {

      this.closeModal();  
      
      Swal.fire({
        allowOutsideClick: false,
        title: '¿Quieres continuar con la creación de preguntas?',
        icon: 'info',
        focusConfirm: false,
        showCancelButton: true,
        showCloseButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'Después'
      }).then((res) => {
        
        if (res.isConfirmed) {
          Swal.fire({
            title: `Creado`,
            text: 'El grupo fue creado con éxito',
            icon: 'success',
            showConfirmButton: false,
            timer: 2500,
          })         
          // Direccionamiento hacía el detalle
          this.router.navigate([`groups/detail/${data['id']}`]);
        } else {
          Swal.fire({
            title: `Creado`,
            text: 'El grupo fue creado con éxito',
            icon: 'success',
            showConfirmButton: false,
            timer: 2500,
          })
        }
        this.groupsRecords();
      })
    })
  }

  closeModal() {
    this.ismodelShow = !this.ismodelShow;
    document.querySelector('.modal-backdrop').remove();
  }

  newGroup(groupBody: Group) {

    const result = this.transactionService.newGroup(groupBody)
      .then(data => {
        if (data['success']) {         
          return data;
        }
      })
      .catch(err => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Error',
          text: err,
          showConfirmButton: false,
          timer: 1500
        })
      })
    return result;
  }

  groupsRecords() {
    this.sub = this.transactionService.groupsRecords().subscribe(groups => {
      if (groups['success']) {
        this.groups = groups['data'];
        this.showSpinner = false;
        this.messageNoData = false;
      }
            
      if (this.groups.length == 0) {
        this.messageNoData = true;
      }

    })
  }  

  ngOnInit(): void {
  }
  
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}


