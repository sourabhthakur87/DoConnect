import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { QuestionService } from '../../../services/question-service';
import { AnswerService } from '../../../services/answer-service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  userName: string | null = '';
  role: string | null = '';
  email: string | null = '';


  pendingcount = {
    questionPending: 0,
    questionReject: 0,
    answerPending: 0,
    answerReject: 0
  }
  constructor(
    private authservice: AuthService,
    private questionservice: QuestionService,
    private answerservice: AnswerService,
  ) { }

  ngOnInit(): void {
    const userData = this.authservice.getTokenData();

    if (userData) {
      this.userName = userData.name;
      this.role = userData.role;
      this.email = userData.email;
    }
    // console.log(this.email);


    this.NoPendingAnswers()
    this.NoPendingQuestion()
    this.NoRejectedAnswers()
    this.NoRejectedQuestion()

  }
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }



  NoPendingQuestion() {
    this.questionservice.getPendingQuestions().subscribe(data => {
      console.log(" pending Answer" + data.length);
      this.pendingcount.questionPending = data.length

    });
  }
  NoPendingAnswers() {
    this.answerservice.getPendingAnswers().subscribe(data => {
      this.pendingcount.answerPending = data.length


    })
  }

  NoRejectedAnswers() {
    this.answerservice.getRejectedAnswers().subscribe(data => {
      this.pendingcount.answerReject = data.length


    })
  }
  NoRejectedQuestion() {
    this.questionservice.getRejectQuestion().subscribe(data => {
      this.pendingcount.questionReject = data.length


    })
  }
}
