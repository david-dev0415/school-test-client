import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';

// Model
import { Group } from 'src/app/models/group.model';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { TestResponseModel } from 'src/app/models/test.response.model';
import { QuestionModel } from 'src/app/models/question.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-question-section',
  templateUrl: './question-section.component.html',
  styleUrls: ['./question-section.component.css']
})
export class QuestionSectionComponent implements OnInit, OnDestroy {

  groupId: string;
  userId: string;
  questions: any[];
  private sub;
  showSpinner: boolean = true;
  groupData: Group;
  testResponse: TestResponseModel;
  questionModel: QuestionModel;
  invalid: boolean = false;
  formQuestion: FormGroup;
  responses: any[] = [];
  answerId: string;
  messageNoData: boolean = false;

  // Configuración de pagination
  public directionLinks: boolean = false;
  public autoHide: boolean = false;
  public responsive: boolean = true;

  public config = {
    itemsPerPage: 1,
    currentPage: 1
  };

  constructor(private activatedRoute: ActivatedRoute, private transactionService: TransactionService, private fb: FormBuilder, private router: Router) {

    this.groupData = {
      groupName: '',
      description: ''
    }

    this.testResponse = {
      userId: this.userId,
      groupId: this.groupId,
      result: ''
    }

    this.activatedRoute.params.subscribe(params => {
      this.groupId = params['id'];
    })

    this.getGroup(this.groupId)
    this.questionRecords();
    this.getData();

    this.createForm();

  }

  ngOnInit(): void {
  }

  absoluteIndex(indexOnPage: number): number {
    return this.config.itemsPerPage * (this.config.currentPage - 1) + indexOnPage;
  }

  createForm() {
    this.formQuestion = this.fb.group({
      trueOrFalse: this.fb.group({
        answer: new FormControl(null)
      }),
      multipleChoiceAnswer: this.fb.group({
        correctAnswer: new FormControl(null)
      }),
      questionId: ['']
    });

  }

  onSubmit() {
    const userId = JSON.parse(localStorage.getItem('data'));
    const body = {
      userId: userId['id'],
      groupId: this.groupId,
      totalQuestions: this.questions.length
    }
    this.transactionService.testResult(body).toPromise()
      .then(res => {
        if (res == null) {
          Swal.fire({
            title: 'Oops',
            text: `Ocurrió un error al traer los datos de la prueba.`,
            icon: 'error',
            showConfirmButton: false,
            timer: 2500
          })
          return false;
        }        
        const result = res;
        Swal.fire({
          title: 'Resultado',
          html: `
          ${result['nombre_de_estudiante']}, su nota es: <b>${result['resultado_de_prueba']}</b> 
          `,
          text: `Fecha: ${result['fecha_de_prueba']} | Hora: ${result['hora_de_prueba']}`,
          showConfirmButton: true,
          confirmButtonText: 'Salir'
        }).then((e => {
          if (e.isConfirmed) {
            this.router.navigateByUrl('/question-homepage');
          }
        }))
      })
      .catch(err => console.log(err))
  }

  nextPage(event) {
    if (event) {
      this.config.currentPage += 1;
    }

    if (this.config.currentPage > this.questions.length) {
      this.autoHide = true;
    }   
  }

  onPageChange(event) {
    this.config.currentPage = event;
    if (this.config.currentPage > this.questions.length) {
      this.autoHide = true;
    }    
  
  }

  getData() {
    const userData = localStorage.getItem('data'),
      userId = JSON.parse(userData)['id'];

    this.userId = userId;
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

  setGroupLocal(groupDataLocal?) {
    this.groupData = {
      groupName: groupDataLocal.groupName,
      description: groupDataLocal.description
    }
  }

  questionRecords() {
    this.sub = this.transactionService.recordsQuestion(this.groupId.toString()).subscribe(result => {
      if (result['success']) {
        this.questions = result['data'];
        this.showSpinner = false;
        this.messageNoData = false;
      } else {
        this.messageNoData = true;
      }
    })
  }

  setQuestionLocal(data) {
    localStorage.questions = JSON.stringify(data);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    localStorage.removeItem('group');
  }

}
