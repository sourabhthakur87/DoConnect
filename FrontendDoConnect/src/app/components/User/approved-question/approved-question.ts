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



  selectedImage: string | null = null;


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



  showLargeImage(imagePath: string) {
    this.selectedImage = imagePath;
  }

  // Function to close the modal
  closeModal() {
    this.selectedImage = null;
  }

  giveAnswer(questionId: string) {
    this.router.navigate(['/answer/addAnswer', questionId]);
  }
}
