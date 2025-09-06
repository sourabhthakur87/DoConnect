import { Component } from '@angular/core';
import { QuestionService } from '../../../services/question-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnswerService } from '../../../services/answer-service';

@Component({
  selector: 'app-approved-question',
  standalone: false,
  templateUrl: './approved-question.html',
  styleUrl: './approved-question.css'
})
export class ApprovedQuestion {
  approvedQ: any[] = [];
  isMenuOpen = false;
  selectedImage: string | null = null;
  addAnswer!: FormGroup;
  selectedFile: File | null = null;
  message = '';
  activeAnswerFormId: number | null = null;


  searchQuery = '';

  constructor(
    private approveQuestion: QuestionService,
    private answerService: AnswerService,
    private fb: FormBuilder,
    private router: Router,
    private questionService: QuestionService
  ) { }

  ngOnInit(): void {
    this.getapprovedQuestions()

    this.addAnswer = this.fb.group({
      answertext: ['', Validators.required],
      imageName: ['']
    });
  }


  getapprovedQuestions() {
    this.approveQuestion.getApproveQuestion().subscribe({
      next: (data) => {
        this.approvedQ = data;
      },
      error: (err) => {
        console.error('Error fetching approved questions', err);
      }
    });
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  showLargeImage(imagePath: string) {
    this.selectedImage = imagePath;
  }

  closeModal() {
    this.selectedImage = null;
  }

  giveAnswer(questionId: number) {
    this.activeAnswerFormId = questionId;
    this.addAnswer.reset(); // Clear form each time it's opened
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
      formData.append('imageName', this.addAnswer.value.imageName || this.selectedFile.name);
    }

    this.answerService.addanswer(formData).subscribe({
      next: () => {
        this.message = '✅ Answer submitted successfully! Awaiting admin approval.';
        this.addAnswer.reset();
        this.selectedFile = null;
        this.activeAnswerFormId = null;
      },
      error: (err) => {
        console.error('Submission failed', err);
        this.message = '❌ Failed to submit answer. Please try again.';
      }
    });
  }

  Notfound: string = ""

  onSearchChange() {
    if (!this.searchQuery.trim()) {
      this.getapprovedQuestions(); 
      return;
    }
    this.questionService.searchQuestions(this.searchQuery).subscribe((data: any) => {
      console.log(data.message);
      if (data.message) {
        this.Notfound = data.message
        setTimeout(() => {
          this.Notfound = ""
        }, 2000)
      }
      else {
        this.approvedQ = data
      }

    })

  }



}
