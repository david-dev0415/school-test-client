import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { QuestionModel } from 'src/app/models/question.model';
import { TransactionService } from 'src/app/services/transaction.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {

  @Input() groupId: string;
  @Output() isModelShowQuestion = new EventEmitter<boolean>();
  @Output() reloadData = new EventEmitter<boolean>();

  showMultipleSelection: boolean = false;
  showTrueOrFalse: boolean = false;
  shape: FormGroup;
  labelSelectedFile: any;
  uploadedFileError: boolean = false;
  questionModel: QuestionModel;
  @Input() dataLength: number = 0;
  result: any;

  constructor(private formBuilder: FormBuilder, private transactionService: TransactionService, private router: Router) {
    this.createForm();
    this.isModelShowQuestion = new EventEmitter();
    this.isModelShowQuestion.emit(false);
    this.reloadData.emit(false);
  }

  modifyResponseType(value: any) {
    if (value == "0") {
      this.showMultipleSelection = true;
      this.showTrueOrFalse = false;

      this.shape.get('selectionTrueOrFalse').reset();
      this.shape.get('selectionTrueOrFalse').clearValidators();
      this.shape.get('selectionTrueOrFalse').updateValueAndValidity();


    } else {
      this.showMultipleSelection = false;
      this.showTrueOrFalse = true;

      this.shape.get('multipleChoiceAnswer').reset();
      this.shape.get('multipleChoiceAnswer').clearValidators();
      this.shape.get('multipleChoiceAnswer').updateValueAndValidity();
    }
  }

  get questionNoValid() {
    return this.shape.get('question').invalid && this.shape.get('question').touched
  }

  get typeOfQuestion() {
    return this.shape.get('typeOfQuestion').invalid && this.shape.get('typeOfQuestion').touched
  }

  createForm() {
    this.shape = this.formBuilder.group({
      question: ['', Validators.required],
      imagenFile: [''],
      typeOfQuestion: ['', Validators.required],
      multipleChoiceAnswer: this.formBuilder.group({
        answer_a: [''],
        answer_b: [''],
        answer_c: [''],
        answer_d: [''],
        correctAnswer: ['']
      }),
      selectionTrueOrFalse: this.formBuilder.group({
        trueOrFalseAnswer: ''
      }),
      showQuestion: ['true']
    });

    // Mensaje personalizado: ShowQuestionMessage

    this.shape.controls['showQuestion'].valueChanges.subscribe(v => {
      return (v == "true") ? '' : 'La pregunta no estará visible.'
    })

  }

  get showQuestionMessage() {
    return this.shape.get('showQuestion').value == "true"
      ? 'Las pregunta estará visible para todos.'
      : 'Solo el administrador podrá ver la pregunta.'
  }

  get requiredCheckAnswer() {
    return this.shape.get('multipleChoiceAnswer.correctAnswer').invalid
      ? 'Selecciona una respuesta como correcta.'
      : ''
  }

  get correctAnswer() {
    return this.shape.get('multipleChoiceAnswer.correctAnswer').value == null;
  }

  get validationSelectionTrueOrFalse() {
    return this.shape.get('selectionTrueOrFalse.trueOrFalseAnswer').value == "";
  }

  processForm() {
    // Validación de campos (style)
    if (this.shape.invalid) {
      console.log('Invalid')
      return Object.values(this.shape.controls).forEach(control => control.markAsTouched())
    }



    if (this.correctAnswer && this.showMultipleSelection)  {
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

    // Crear cuerpo de formulario para enviar.
    this.newQuestion()
      .then(data => {
        if (data['success']) {
          if (this.dataLength == 9) {
            Swal.fire({
              title: `Creado`,
              text: `El grupo fue creado con éxito.
              Ya no es posible crear más preguntas.`,
              icon: 'success',
              showConfirmButton: true,
              confirmButtonText: 'Bueno'
            }).then(r => {
              if (r.isConfirmed || r.isDismissed) {
                location.href = this.router.url;
              }            
            })            
          } else {
            Swal.fire({
              title: `Creado`,
              text: 'El grupo fue creado con éxito',
              icon: 'success',
              showConfirmButton: false,
              timer: 2500
            })
          }

        }
        // Emitir valor para que se cargué la nueva data
        this.reloadData.emit(true);

        if (this.dataLength == 10) {
          // console.log('LLegué a 10')

        }

        this.shape.reset();
        // Después de resetar un formulario por la creación, se vuelve a crear de "0"
        this.createForm();


      })
      .catch(err => {
        Swal.fire({
          title: `Error`,
          text: 'Ocurrió un error al crear la pregunta',
          icon: 'error',
          showConfirmButton: false,
          timer: 2500
        })
        // console.log(err)
      })
  }

  finishQuestions() {
    // Resetear valor a 0
    if (this.shape.valid) {
      this.isModelShowQuestion.emit(true)
    }
  }

  toReturnBack() {
    this.router.navigate([`groups/detail/${this.groupId}`]);
  }

  newQuestion() {
    const result = this.transactionService.newQuestion(this.bodyForm())
      .then(data => {
        return data;
      })
      .catch(err => {
        console.log(err)
      })
    return result;
  }

  bodyForm() {

    function setNumberRandom() {

      const numberRandom = (lower, upper) => {
        var numPosibilities = upper - lower;
        var random = Math.random() * (numPosibilities + 1);
        random = Math.floor(random);
        return lower + random;
      }

      const setLocalStorage = () => {
        let numberQuestion = numberRandom(1, 10);
        localStorage.setItem('numberQuestionRandom', numberQuestion);
        return numberQuestion;
      }


      if (localStorage.getItem('numberQuestionRandom') == setLocalStorage()) {
        setLocalStorage();
      }

    }

    setNumberRandom();

    this.questionModel = new QuestionModel();
    this.questionModel.question = this.shape.controls['question'].value;
    this.questionModel.numberQuestion = Number.parseInt(localStorage.getItem('numberQuestionRandom'));
    // this.questionModel.imagenFile = this.selectedFile.file.name;
    this.questionModel.showQuestion = this.shape.controls['showQuestion'].value;
    this.questionModel.typeOfQuestion = this.shape.controls['typeOfQuestion'].value;
    this.questionModel.groupId = this.groupId;

    // Enviar número de pregunta al padre (group-details), para presentar el número de pregunta.    

    if (this.shape.controls['typeOfQuestion'].value == "1") {
      this.questionModel.selectionTrueOrFalse = this.shape.controls['selectionTrueOrFalse'].get('trueOrFalseAnswer').value;
    } else {
      this.questionModel.multipleChoiceAnswer = this.shape.controls['multipleChoiceAnswer'].value;
    }

    return this.questionModel;
  }

  ngOnInit(): void {
    // Validar la cantidad de preguntas: si es igual a 10 no se pueden crear más.
  }




}
