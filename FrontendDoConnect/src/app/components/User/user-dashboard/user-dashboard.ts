import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { AnswerService } from '../../../services/answer-service';

@Component({
  selector: 'app-user-dashboard',
  standalone: false,
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard {
  userName: string | null = '';
  role: string | null = '';
  email: string | null = '';
  questionsWithAnswers: any[] = [];
  constructor(private authservice: AuthService, private router: Router, private answerservice: AnswerService) { }

  ngOnInit(): void {
    const userData = this.authservice.getTokenData();

    if (userData) {
      this.userName = userData.name;
      this.role = userData.role;
      this.email = userData.email;
    }

    this.answerservice.approvedQuestionWithAnswer().subscribe(data => {
      console.log(data);
      this.questionsWithAnswers = data

    })

  }


  logout() {
    this.authservice.logout();
    this.router.navigate([""])
  }



}
