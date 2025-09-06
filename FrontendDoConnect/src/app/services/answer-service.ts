import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  constructor(private http: HttpClient) { }
  private baseURL = "http://localhost:5122/api/Answer"



  //  User Specific
  addanswer(data: FormData): Observable<any> {
    return this.http.post(`${this.baseURL}/add`, data)
  }


  // Admin k liye 
  getPendingAnswers(): Observable<any> {
    return this.http.get(`${this.baseURL}/pending`);
  }

  getRejectedAnswers(): Observable<any> {
    return this.http.get(`${this.baseURL}/reject`);
  }


  rejectAnswer(answerId: number): Observable<any> {
    return this.http.put(`${this.baseURL}/${answerId}/reject`, {});
  }


  approveAnswer(answerId: number): Observable<any> {
    return this.http.put(`${this.baseURL}/${answerId}/approve`, {});
  }

  DeleteAnswer(id: number): Observable<any> {
    return this.http.delete(`${this.baseURL}/${id}`);
  }


  approvedQuestionWithAnswer(): Observable<any> {
    return this.http.get(`${this.baseURL}/final-question-answer`);
  }
}
