import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';



export interface QuestionRequest {
  questionTitle: string;
  questionText: string;
}

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private baseURL = "http://localhost:5122/api/Question"

  constructor(private http: HttpClient) { }

  // // for login user
  // askQuestion(data: QuestionRequest): Observable<any> {
  //   return this.http.post(`${this.baseURL}/ask`, data);
  // }



  // for login user
  askQuestion(data: FormData): Observable<any> {
    return this.http.post(`${this.baseURL}/ask`, data);
  }


  // for login admin
  getPendingQuestions(): Observable<any> {
    return this.http.get(`${this.baseURL}/pending`)
  }


  //for login user

  getApproveQuestion(): Observable<any> {
    return this.http.get(`${this.baseURL}/approved`)
  }

  //for only admin can approve

  approveQuestion(id: number): Observable<any> {
    return this.http.put(`${this.baseURL}/${id}/approve`, id)
  }

  // Get queston by id
  getQuestionById(id: number): Observable<any> {
    return this.http.get(`${this.baseURL}/getQuestionById/${id}`)
  }


  // get reject


  getRejectQuestion(): Observable<any> {
    return this.http.get(`${this.baseURL}/reject`)
  }

  // Do Reject Question
  rejectQuestion(id: number): Observable<any> {
    return this.http.put(`${this.baseURL}/${id}/reject`, id)
  }


  // only admin can delete 

  removeQuestion(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}`)
  }











  // ------------------------------------------

}
