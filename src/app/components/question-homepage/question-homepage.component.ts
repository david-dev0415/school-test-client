import { Component, OnInit } from '@angular/core';
import { UserStudentModel } from 'src/app/models/user.student.model';

@Component({
  selector: 'app-question-homepage',
  templateUrl: './question-homepage.component.html',
  styleUrls: ['./question-homepage.component.css']
})
export class QuestionHomepageComponent implements OnInit {

  userStudent: UserStudentModel = new UserStudentModel();
  data: any = '';

  constructor() {
    const userStudent = localStorage.getItem('data');
    this.data = JSON.parse(userStudent);
  }

  ngOnInit(): void {
    this.userStudent.fullName = this.data['fullName'];
    this.userStudent.grade = this.data['grade'];
  }

}
//