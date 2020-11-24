import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionModel } from 'src/app/models/question.model';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-question-update',
  templateUrl: './question-update.component.html',
  styleUrls: ['./question-update.component.css']
})
export class QuestionUpdateComponent implements OnInit, OnDestroy {

  private sub: any;
  id: string;
  groupId: string;
  shapeUpdate: FormGroup;
  showMultipleSelection: boolean = false;
  showTrueOrFalse: boolean = false;
  setData: QuestionModel;
  selectionTrueOrFalse: boolean;
  valueTrue: boolean = false;
  questionModel = new QuestionModel();
  // isLoading: boolean = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute, private transactionService: TransactionService) {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    })

    const question = JSON.parse(localStorage.question);

    if (question != null) {
      this.groupId = question['groupId'];
    } else {
      Swal.fire({
        title: 'Oops, ocurrió un error',
        text: 'No se pudo cargar la información de la pregunta',
        icon: 'error',
        showConfirmButton: false,
        timer: 2000,
      })
    }

    this.createForm();
    this.localStorageData(question);

    if (this.shapeUpdate.controls['typeOfQuestion'].value == "0") {
      this.showMultipleSelection = true;
      this.showTrueOrFalse = false;

      this.shapeUpdate.get('selectionTrueOrFalse').reset();
      this.shapeUpdate.get('selectionTrueOrFalse').clearValidators();
      this.shapeUpdate.get('selectionTrueOrFalse').updateValueAndValidity();

    } else {

      this.shapeUpdate.get('multipleChoiceAnswer').reset();
      this.shapeUpdate.get('multipleChoiceAnswer').clearValidators();
      this.shapeUpdate.get('multipleChoiceAnswer').updateValueAndValidity();

      this.showMultipleSelection = false;
      this.showTrueOrFalse = true;
    }

  }

  previousPage() {
    this.router.navigate([`/groups/detail/${this.groupId}`]);
  }

  modifyResponseType(value: any) {
    if (value == "0") {
      this.showMultipleSelection = true;
      this.showTrueOrFalse = false;

      // Vaciar los valores de campo (selección verdadero o falso)
      this.shapeUpdate.patchValue({
        selectionTrueOrFalse: {
          trueOrFalseAnswer: '',
        }
      })
    } else {
      this.showMultipleSelection = false;
      this.showTrueOrFalse = true;

      // Vaciar los valores de campo (selección múltiple)
      this.shapeUpdate.patchValue({
        multipleChoiceAnswer: {
          answer_a: '',
          answer_b: '',
          answer_c: '',
          answer_d: '',
          correctAnswer: ''
        }
      });
    }
  }

  ngOnInit(): void {   
  }

  update() {

    if (this.shapeUpdate.invalid) {
      return Object.values(this.shapeUpdate.controls).forEach(control => control.markAsTouched())
    }


    if (this.correctAnswer && this.showMultipleSelection) {
      Swal.fire({
        title: 'Formulario incorrecto',
        text: 'Debes de seleccionar la respuesta correcta',
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      })
      return false;
    }

    if (this.validationSelectionTrueOrFalse && this.showTrueOrFalse) {
      Swal.fire({
        title: 'Formulario incorrecto',
        text: 'Debes de seleccionar la respuesta correcta',
        icon: 'warning',
        showConfirmButton: false,
        timer: 2500
      })
      return false;
    }

    if (this.shapeUpdate.dirty) {

      if (this.shapeUpdate.controls['typeOfQuestion'].value == "0") {
        this.shapeUpdate.get('multipleChoiceAnswer').setValidators([Validators.required])
        // Remover validación del campo: (Verdadero o falso)       
        this.shapeUpdate.controls['selectionTrueOrFalse'].clearValidators();
        this.shapeUpdate.controls['selectionTrueOrFalse'].updateValueAndValidity();

        if (this.shapeUpdate.get('multipleChoiceAnswer.correctAnswer').value == null) {
          Swal.fire({
            title: 'Formulario incorrecto',
            text: 'Debes de seleccionar al menos una respuesta correcta',
            icon: 'warning',
            showConfirmButton: false,
            timer: 2500
          })
        }
      } else {
        this.shapeUpdate.get('selectionTrueOrFalse').setValidators([Validators.required])
        this.shapeUpdate.controls['multipleChoiceAnswer'].clearValidators();
        this.shapeUpdate.controls['multipleChoiceAnswer'].updateValueAndValidity();
      }

      const updatedData = this.shapeUpdate.value;    
      console.log(updatedData)

        this.transactionService.updateQuestion(this.setDataToSend(updatedData), this.id)
          .then(res => {
            
            Swal.fire({
              text: 'La pregunta se ha modificado',
              icon: 'success',
              showConfirmButton: false,
              timer: 2500            
            })
            // this.isLoading = true;
            this.previousPage();
          })
          .catch(err => {
          console.log(err)
        })


      } else {
        Swal.fire({
          text: 'No has modificado ningún dato',
          icon: 'info',
          showConfirmButton: false,
          timer: 2500
        })
    }
  }

  setDataToSend(question): QuestionModel {
    const questionModel = new QuestionModel();
    questionModel.question = question['question'];
    questionModel.showQuestion = question['showQuestion'];
    questionModel.typeOfQuestion = question['typeOfQuestion'];

    questionModel.multipleChoiceAnswer = question['multipleChoiceAnswer'];
    questionModel.selectionTrueOrFalse = question['selectionTrueOrFalse']['trueOrFalseAnswer'];

    return questionModel;
  }

  createForm() {
    this.shapeUpdate = this.formBuilder.group({
      question: ['', Validators.required],
      imagenFile: [''],
      typeOfQuestion: ['', Validators.required],
      multipleChoiceAnswer: this.formBuilder.group({
        answer_a: [,],
        answer_b: [,],
        answer_c: [,],
        answer_d: [,],
        correctAnswer: [,]
      }),
      selectionTrueOrFalse: this.formBuilder.group({
        trueOrFalseAnswer: []
      }),
      showQuestion: []
    });
  }

  get questionNoValid() {
    return this.shapeUpdate.get('question').invalid && this.shapeUpdate.get('question').touched;
  }

  get typeOfQuestion() {
    return this.shapeUpdate.get('typeOfQuestion').invalid && this.shapeUpdate.get('typeOfQuestion').touched;
  }

  get correctAnswer() {
    return this.shapeUpdate.get('multipleChoiceAnswer.correctAnswer').value == null;
  }

  get trueOrFalse() {
    return this.shapeUpdate.get('selectionTrueOrFalse.trueOrFalseAnswer').value;
  }

  get validationSelectionTrueOrFalse() {
    return this.shapeUpdate.get('selectionTrueOrFalse.trueOrFalseAnswer').value == "";
  }


  localStorageData(question: any) {
    this.questionModel.question = question['question'];
    this.questionModel.typeOfQuestion = question['typeOfQuestion'];
    this.questionModel.selectionTrueOrFalse = question['selectionTrueOrFalse'];
    this.questionModel.showQuestion = question['showQuestion'];

    // Setear valores en los campos
    this.shapeUpdate.controls['question'].setValue(this.questionModel.question);
    this.shapeUpdate.controls['typeOfQuestion'].setValue(this.questionModel.typeOfQuestion);
    this.shapeUpdate.controls['showQuestion'].setValue(this.questionModel.showQuestion);


    
    // Setear valores por path value
    this.setPathValue(this.questionModel.typeOfQuestion, question);

  }

  setPathValue(typeOfQuestion: string, data?: any) {
    if (typeOfQuestion == "0") {
      this.shapeUpdate.patchValue({
        multipleChoiceAnswer: {
          answer_a: data['multipleChoiceAnswer']['answer_a'],
          answer_b: data['multipleChoiceAnswer']['answer_b'],
          answer_c: data['multipleChoiceAnswer']['answer_c'],
          answer_d: data['multipleChoiceAnswer']['answer_d'],
          correctAnswer: data['multipleChoiceAnswer']['correctAnswer']
        }
      });

    } else {
      this.shapeUpdate.patchValue({
        selectionTrueOrFalse: {
          trueOrFalseAnswer: this.questionModel.selectionTrueOrFalse
        }
      })
    }

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    localStorage.removeItem('question');
  }

}
