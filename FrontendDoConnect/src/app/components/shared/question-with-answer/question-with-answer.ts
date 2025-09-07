import { Component } from '@angular/core';
import { AnswerService } from '../../../services/answer-service';
import { AuthService } from '../../../services/auth-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-question-with-answer',
  standalone: false,
  templateUrl: './question-with-answer.html',
  styleUrl: './question-with-answer.css'
})
export class QuestionWithAnswer {
  questionsWithAnswers: any[] = [];
  isMenuOpen = false;
  isBackendImage: boolean = true;
  role: string | null = '';
  selectedImage: string | null = null;
  addAnswer!: FormGroup;
  selectedFile: File | null = null;
  message = '';
  activeAnswerFormId: number | null = null;

  constructor(
    private answerService: AnswerService,
    private authservice: AuthService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addAnswer = this.fb.group({
      answertext: ['', Validators.required]
    });

    this.answerService.approvedQuestionWithAnswer().subscribe(data => {
      this.questionsWithAnswers = data.map((q: any) => ({
        ...q,
        showAnswers: false
      }));
    });

    const userData = this.authservice.getTokenData();
    if (userData) {
      this.role = userData.role;
      console.log(this.role);
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  showLargeImage(imagePath: string | null) {
    if (imagePath) {
      this.selectedImage = 'http://localhost:5122/images/' + imagePath;
      this.isBackendImage = true;
    } else {
      this.selectedImage = '/download.jpeg';
      this.isBackendImage = false;
    }
  }

  closeModal() {
    this.selectedImage = null;
  }

  giveAnswer(questionId: number) {
    this.activeAnswerFormId = questionId;
    this.addAnswer.reset(); // Reset form when opening
    this.message = '';
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(questionId: number) {
    if (this.addAnswer.invalid) {
      this.message = 'Please fill all required fields.';
      return;
    }

    const formData = new FormData();
    formData.append('answerText', this.addAnswer.value.answertext);
    formData.append('questionId', questionId.toString());

    if (this.selectedFile) {
      formData.append('Photo', this.selectedFile);
      formData.append('imageName', this.selectedFile.name);
    }

    this.answerService.addanswer(formData).subscribe({
      next: () => {
        this.message = '✅ Answer submitted successfully! Awaiting admin approval.';
        this.addAnswer.reset();
        this.selectedFile = null;
        this.activeAnswerFormId = null;

        // Refresh the list (optional)
        this.answerService.approvedQuestionWithAnswer().subscribe(data => {
          this.questionsWithAnswers = data.map((q: any) => ({
            ...q,
            showAnswers: false
          }));
        });
      },
      error: (err) => {
        console.error('Submission failed', err);
        this.message = '❌ Failed to submit answer. Please try again.';
      }
    });
  }
}
