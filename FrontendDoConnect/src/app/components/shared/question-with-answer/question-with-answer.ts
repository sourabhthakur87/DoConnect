import { Component } from '@angular/core';
import { AnswerService } from '../../../services/answer-service';
import { AuthService } from '../../../services/auth-service';

@Component({
  selector: 'app-question-with-answer',
  standalone: false,
  templateUrl: './question-with-answer.html',
  styleUrl: './question-with-answer.css'
})
export class QuestionWithAnswer {

  questionsWithAnswers: any[] = [];
  isMenuOpen = false;
  selectedImage: string | null = null;
  isBackendImage: boolean = true;
  role: string | null = '';
  constructor(private answerService: AnswerService, private authservice: AuthService) { }

  ngOnInit(): void {
    this.answerService.approvedQuestionWithAnswer().subscribe(data => {
      this.questionsWithAnswers = data.map((q: any) => ({
        ...q,
        showAnswers: false
      }));
    });


    var userData = this.authservice.getTokenData();
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
      this.selectedImage = '/download.jpeg'; // from public folder
      this.isBackendImage = false;
    }
  }

  closeModal() {
    this.selectedImage = null;
  }
}
