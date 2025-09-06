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
  selectedFile: File | null = null;
  message = '';

  questionDetail = {
    questionTitle: '',
    questionText: ''
  };




  constructor(private route: ActivatedRoute, private fb: FormBuilder, private answerService: AnswerService, private questionServies: QuestionService) { }


  ngOnInit() {
    this.questionId = Number(this.route.snapshot.paramMap.get('id'));

    this.addAnswer = this.fb.group({
      answertext: ['', Validators.required],
      imageName: [''] // Optional field for naming the image
    });

    this.questionServies.getQuestionById(this.questionId).subscribe(data => {
      this.questionDetail.questionTitle = data.questionTitle;
      this.questionDetail.questionText = data.questionText;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }
  onSubmit() {
    if (this.addAnswer.invalid) {
      this.message = 'Please fill all required fields.';
      return;
    }

    const formData = new FormData();
    formData.append('answerText', this.addAnswer.value.answertext);
    formData.append('questionId', this.questionId.toString());

    if (this.selectedFile) {
      formData.append('Photo', this.selectedFile);
      formData.append('imageName', this.addAnswer.value.imageName || this.selectedFile.name);
    }

    this.answerService.addanswer(formData).subscribe({
      next: (res) => {
        this.message = 'Answer submitted successfully! Awaiting admin approval.';
        this.addAnswer.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        console.error('Submission failed', err);
        this.message = 'Failed to submit answer. Please try again.';
      }
    });
  }
}

