import { Component } from '@angular/core';
import { QuestionService } from '../../../services/question-service';

@Component({
  selector: 'app-question-status',
  standalone: false,
  templateUrl: './question-status.html',
  styleUrl: './question-status.css'
})
export class QuestionStatus {

  pendingQuestion: any = []
  constructor(private pendingQuestions: QuestionService) { }


  ngOnInit() {
    this.havePendingQuestions();
  }

  havePendingQuestions() {
    this.pendingQuestions.getPendingQuestions().subscribe(data => {
      this.pendingQuestion = data;
      console.log(data);
    });
  }

  approveQuestion(id: number) {
    this.pendingQuestions.approveQuestion(id).subscribe(() => {
      this.havePendingQuestions();
    })
  }
  removeQuestion(id: number) {
    this.pendingQuestions.removeQuestion(id).subscribe(() => {
      this.havePendingQuestions();
    })
  }

  // Do Reject Question
}
