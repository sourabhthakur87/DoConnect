import { Component } from '@angular/core';
import { QuestionService } from '../../../services/question-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-ask-question',
  standalone: false,
  templateUrl: './ask-question.html',
  styleUrl: './ask-question.css'
})
export class AskQuestion {
  askForm: FormGroup;
  message = '';

  constructor(private fb: FormBuilder, private questionService: QuestionService) {
    this.askForm = this.fb.group({
      questionTitle: ['', Validators.required],
      questionText: ['', Validators.required],
    });
  }
  onSubmit() {
    if (this.askForm.invalid) return;

    this.questionService.askQuestion(this.askForm.value).subscribe({
      next: (res) => {
        this.message = res.message;
        this.askForm.reset();
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to submit question.';
      }
    });
  }
}
