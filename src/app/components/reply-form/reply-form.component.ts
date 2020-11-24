import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionModel } from 'src/app/models/question.model';
import { QuestionAnswerModel } from 'src/app/models/question.answer.model';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reply-form',
  templateUrl: './reply-form.component.html',
  styleUrls: ['./reply-form.component.css']
})
export class ReplyFormComponent implements OnInit {

  @Input() question: any;
  @Input() index: any;
  @Output() completed = new EventEmitter<number>();
  @Output() next = new EventEmitter<boolean>();

  private sub;
  formQuestion: FormGroup;
  questions: any[];
  groupId: string;
  showSpinner: boolean = true;
  responses: any[] = [];
  questionModel: QuestionModel;
  questionAnswerModel: QuestionAnswerModel;

  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder, private transactionService: TransactionService, private router: Router) {
    this.createForm();

    const body = {
      id: '',
      selectionTrueOrFalse: '',
      multipleChoiceAnswer: ''
    };

    this.responses.push(body)

    this.activatedRoute.params.subscribe(params => {
      this.groupId = params['id'];
    })

    this.next.emit(false);
    this.questionRecords();
  }

  ngOnInit(): void {
  }


  onSubmit() {
    // console.log(this.formQuestion)

    if (this.formStatus) {

      // Pasar de página
      this.next.emit(true);

      if (this.formQuestion.get('multipleChoiceAnswer.correctAnswer').value == '') {

        this.questionModel = new QuestionModel();
        this.questionModel.questionId = this.formQuestion.get('questionId').value;
        this.questionModel.selectionTrueOrFalse = this.formQuestion.get('trueOrFalse').value;
        this.sendReply(this.questionModel);
        delete this.questionModel;
        this.formQuestion.reset();
      } else {
        this.questionModel = new QuestionModel();
        this.questionModel.questionId = this.formQuestion.get('questionId').value;
        this.questionModel.multipleChoiceAnswer =
          this.formQuestion.get('multipleChoiceAnswer').value;
        this.sendReply(this.questionModel);
        delete this.questionModel;
        // Setear
        this.responses.push(this.questionModel);
        this.formQuestion.reset();
      }
    }
  }

  createForm() {
    this.formQuestion = this.fb.group({
      trueOrFalse: this.fb.group({
        answer: new FormControl('')
      }),
      multipleChoiceAnswer: this.fb.group({
        correctAnswer: new FormControl('')
      }),
      questionId: ['']
    });

    this.next.emit(true);
  }


  sendReply(bodyForm) {

    const userId = JSON.parse(localStorage.getItem('data'));

    const body = {
      userId: userId['id'],
      groupId: this.groupId
    }

    this.saveAnswers(bodyForm, body);
  }

  saveAnswers(response, body) {
    this.sub = this.transactionService.saveAnswers(response, body.userId, body.groupId).subscribe(res => {
      console.log(res)
    })
  }

  questionRecords() {
    this.sub = this.transactionService.recordsQuestion(this.groupId).subscribe(result => {
      if (result['success']) {
        this.questions = result['data'];
        this.showSpinner = false;
      }
    })
  }

  get formStatus() {
    return this.formQuestion.touched && this.formQuestion.controls['trueOrFalse'].dirty || this.formQuestion.get('multipleChoiceAnswer.correctAnswer').value != "";
  }

  get formValid() {
    return this.formQuestion.get('trueOrFalse').pristine || this.formQuestion.get('multipleChoiceAnswer.correctAnswer').pristine;
  }

}
