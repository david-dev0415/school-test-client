export class QuestionModel {
  questionId?: string;
  question: string;
  numberQuestion: number;
  imagenFile?: string;
  showQuestion: boolean;
  typeOfQuestion: any;
  multipleChoiceAnswer?: {};
  selectionTrueOrFalse?: any;
  groupId: string;
}