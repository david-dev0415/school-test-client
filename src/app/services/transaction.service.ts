import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

// Enviroment
import { environment } from '../../environments/environment.prod';

// Models
import { Group } from '../models/group.model'
import { QuestionModel } from '../models/question.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  private firebaseApi = environment.firebaseApi.url;

  constructor(private http: HttpClient) { }

  async newGroup(group: Group) {

    const groupBody = {
      groupName: group.groupName,
      description: group.description
    }

    return await this.http.post(`${this.firebaseApi}/group/new`, groupBody).toPromise();

  }

  groupsRecords() {
    return this.http.get<Group[]>(`${this.firebaseApi}/groups`);
  }

  async editGroup(group: Group) {
    return await this.http.put(`${this.firebaseApi}/group/edit`, group).toPromise();
  }

  async getGroup(id: string) {
    return await this.http.get(`${this.firebaseApi}/group/${id}`).toPromise();
  }

  async deleteGroup(id: string) {
    return await this.http.delete(`${this.firebaseApi}/group/delete/${id}`).toPromise();
  }

  async newQuestion(question: QuestionModel) {
    const questionModel = question;
    return await this.http.post(`${this.firebaseApi}/question/new`, questionModel).toPromise();
  }

  recordsQuestion(groupId: string, order?: string) {
    if (order) {
      return this.http.get<Group[]>(`${this.firebaseApi}/questions/${groupId}/${order}`);
    } else {
      return this.http.get<Group[]>(`${this.firebaseApi}/questions/${groupId}`);
    }
  }

  async updateQuestion(question: QuestionModel, id: string) {    
    return await this.http.put(`${this.firebaseApi}/question/update/${id}`, question).toPromise();
  }

  async deleteQuestion(id: string) {
    return await this.http.delete(`${this.firebaseApi}/question/delete/${id}`).toPromise();
  }

  saveAnswers(answer, userData, groupId) {

    const body = {
      answer: answer,
      userId: userData,   
      groupId: groupId,
      registrationDate: new Date()
    }

    const httpOptions = {
      headers: new HttpHeaders({
        responseType: 'blob',

      })
    };

    return this.http.post(`${this.firebaseApi}/question/save-answer`, body);
    // return this.http.post(`api/question/save-answer`, body, { headers: httpOptions.headers, responseType: 'blob' });
  }

  countsAnswers(body) {
    return this.http.post(`${this.firebaseApi}/counts/answers`, body).toPromise();
  }

  deleteAnswers(groupId, userId) {
    return this.http.delete(`${this.firebaseApi}/delete/answers/${groupId}/${userId}`).toPromise();
  }

  testResult(body) {    
    return this.http.post(`${this.firebaseApi}/test/result`, body);
  }

}
