import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AnswerService } from '../../../services/answer-service';
import { QuestionService } from '../../../services/question-service';

@Component({
  selector: 'app-add-answer',
  standalone: false,
  templateUrl: './add-answer.html',
  styleUrl: './add-answer.css'
})
export class AddAnswer {
  addAnswer!: FormGroup;
  questionId!: number;
  message = '';
  questionDetail = {
    questionTitle:"",
    questionText:""
  }


  constructor(private route: ActivatedRoute, private fb: FormBuilder, private answerService: AnswerService, private questionServies: QuestionService) { }



  ngOnInit() {
    this.questionId = Number(this.route.snapshot.paramMap.get('id'));

    // ✅ Build form
    this.addAnswer = this.fb.group({
      answertext: ['', Validators.required]
    });

    this.questionServies.getQuestionById(this.questionId).subscribe(data=>{
      console.log(data);
      this.questionDetail.questionText = data.questionText
      this.questionDetail.questionTitle = data.questionTitle
      
    })
  }
  onSubmit(): void {
    if (this.addAnswer.invalid) return;

    // ✅ Prepare payload
    const payload = {
      answerText: this.addAnswer.value.answertext,
      questionId: this.questionId,
      // userId: Number(localStorage.getItem('userId')) // assuming stored at login
    };

    console.log('Submitting Answer: ', payload);

    // ✅ Call service to submit answer
    this.answerService.addanswer(payload).subscribe({
      next: () => {
        this.message = 'Answer submitted successfully! Awaiting admin approval.';
        this.addAnswer.reset();
      },
      error: (err) => {
        console.error('Error submitting answer', err);
        this.message = 'Failed to submit answer. Please try again.';
      }
    });
  }
}

