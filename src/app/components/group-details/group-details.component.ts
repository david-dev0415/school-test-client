import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Group } from 'src/app/models/group.model';
import { QuestionModel } from 'src/app/models/question.model';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.css']
})
export class GroupDetailsComponent implements OnInit, OnDestroy {

  showSpinner: boolean = true;
  questions: QuestionModel[] = [];
  messageNoData: boolean = false;
  ismodelShow: boolean = false;
  parentRouteId: number;
  private sub: any;
  activateEditor: boolean;
  groupData: Group;
  valueLoadData: boolean = false;
  dataLength: number = 0;

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private transactionService: TransactionService) {
    this.groupData = {
      groupName: '',
      description: ''
    }

    this.sub = this.activatedRoute.params.subscribe(params =>
      this.parentRouteId = params['id']
    )

    this.getGroup(this.parentRouteId.toString());

    this.questionRecords();
  }

  ngOnInit(): void {
    this.activateEditor = false;
  }

  closeModal(value?: boolean) {
    if (value) {
      this.ismodelShow = !this.ismodelShow;
      document.querySelector('.modal-backdrop').remove();
    }
  }

  modifyActivateEditor() {
    this.activateEditor = true;
  }

  // Get Item: Dato local del grupo

  setGroupLocal(groupDataLocal?) {
    this.groupData = {
      groupName: groupDataLocal.groupName,
      description: groupDataLocal.description
    }
  }

  editGroup() {
    const group: Group = {
      id: this.parentRouteId.toString(),
      groupName: this.groupData.groupName,
      description: this.groupData.description
    }

    this.transactionService.editGroup(group)
      .then(result => {
        if (result['success']) {
          // Mostrar mensaje: Se han modificado los datos correctamente.
          this.activateEditor = false;
          this.getGroup(group.id);
          Swal.fire({
            text: 'La modificación fue éxitosa.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
  }

  async getGroup(id: string) {
    try {
      const result = await this.transactionService.getGroup(id);
      localStorage.setItem('group', JSON.stringify(result['data']));
      const groupDataLocal = JSON.parse(localStorage.getItem('group'));
      this.setGroupLocal(groupDataLocal);
    } catch (err) {
      console.log(err);
    }
  }

  deleteGroup() {

    Swal.fire({
      allowOutsideClick: false,
      title: `¿Estás seguro de eliminar el grupo ${this.groupData.groupName}?`,
      text: 'Después de eliminar el grupo no podrás recuperar las preguntas.',
      icon: 'info',
      focusConfirm: false,
      confirmButtonText: 'Sí, estoy de acuerdo',
      showCloseButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        this.transactionService.deleteGroup(this.parentRouteId.toString())
          .then(res => {
            if (res['success']) {
              Swal.fire({
                title: `El grupo ${this.groupData.groupName} fue borrado`,
                icon: 'success',
                showConfirmButton: false,
                timer: 2500,
              })
            } else {
              Swal.fire({
                title: 'Ocurrió un error',
                icon: 'error',
                text: 'Contacte con el servicio técnico.',
                showConfirmButton: false,
                timer: 3000
              })
            }
          })
        this.router.navigateByUrl('/groups')
          .then(() => localStorage.removeItem('group'))
      }
    });
  }

  questionRecords() {
    this.questions = [];
    this.sub = this.transactionService.recordsQuestion(this.parentRouteId.toString()).subscribe(result => {
      if (result['success']) {
        this.questions = result['data'];
        this.countData(this.questions.length)
        this.showSpinner = false;
      }

      if (this.questions.length == 0) {
        this.messageNoData = true;
      }
    })
  }

  countData(count: number) {
    this.dataLength = count;
  }

  loadData(e: boolean) {
    if (e) {
      this.questionRecords();
      this.messageNoData = false;
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }


}
