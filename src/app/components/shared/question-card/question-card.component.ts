import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionModel } from 'src/app/models/question.model';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-question-card',
  templateUrl: './question-card.component.html',
  styleUrls: ['./question-card.component.css']
})
export class QuestionCardComponent implements OnInit, OnDestroy {

  @Input() questions: QuestionModel;
  questionModelCard: any;
  @Input() index: number;
  @Output() reloadData = new EventEmitter<boolean>();
  dataInput: any

  ismodelShow: boolean = false;

  constructor(private transactionService: TransactionService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.reloadData.emit(false);   
  }

  ngOnInit(): void {   
  }

  deleteQuestion(id: string) {
    Swal.fire({
      allowOutsideClick: false,
      title: `¿Estás seguro de eliminar la pregunta`,
      icon: 'info',
      focusConfirm: false,
      confirmButtonText: 'Sí, estoy de acuerdo',
      showCloseButton: true,
    }).then((res) => {
      if (res.isConfirmed) {
        this.transactionService.deleteQuestion(id)
          .then(res => {
            if (res['success']) {
              Swal.fire({
                title: `la pregunta fue borrada`,
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
                timer: 2500
              })
            }
            // Volver a cargar datos
            this.reloadData.emit(true);
          })
      }
    });
  }

  closeModal(value?: boolean) {
    if (value) {
      this.ismodelShow = !this.ismodelShow;
      document.querySelector('.modal-backdrop').remove();
    }
  }

  updateQuestionModal(questions: any) {    
    localStorage.question = JSON.stringify(questions);    
    this.router.navigate([`question/${questions.questionId}`], { relativeTo: this.activatedRoute });
    // console.log(questions)
  }

  ngOnDestroy() {
    // this.sub.unsubscribe();
  }

}
