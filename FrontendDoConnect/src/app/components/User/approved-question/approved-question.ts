import { Component } from '@angular/core';
import { QuestionService } from '../../../services/question-service';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-approved-question',
  standalone: false,
  templateUrl: './approved-question.html',
  styleUrl: './approved-question.css'
})
export class ApprovedQuestion {
  approvedQ: any[] = [];


  constructor(
    private approveQuestion: QuestionService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.approveQuestion.getApproveQuestion().subscribe({
      next: (data) => {
        console.log(data);

        this.approvedQ = data;
      },

      error: (err) => {
        console.error('Error fetching approved questions', err);
      }
    });

  }

  giveAnswer(questionId: string) {
    this.router.navigate(['/answer/addAnswer', questionId]);
  }
}
