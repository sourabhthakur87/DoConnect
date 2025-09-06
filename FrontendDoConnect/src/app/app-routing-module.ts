import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './SecureRoute/Guards/auth-guard';
import { userGuard } from './SecureRoute/Guards/user-guard';
import { Login } from './components/Auth/login/login';
import { Register } from './components/Auth/register/register';
import { UserDashboard } from './components/User/user-dashboard/user-dashboard';
import { AdminDashboard } from './components/Admin/admin-dashboard/admin-dashboard';
import { ApprovedQuestion } from './components/User/approved-question/approved-question';
import { adminGuard } from './SecureRoute/Guards/admin-guard';
import { QuestionStatus } from './components/Admin/question-status/question-status';
import { AnswerStatus } from './components/Admin/answer-status/answer-status';
import { RejectedQuestions } from './components/Admin/rejected-questions/rejected-questions';
import { RejectedAnswers } from './components/Admin/rejected-answers/rejected-answers';
import { QuestionWithAnswer } from './components/shared/question-with-answer/question-with-answer';

const routes: Routes = [
   { path: "", component: Login },
  { path: "register", component: Register },


  // user
  { path: "dashboard/user", component: UserDashboard, canActivate: [authGuard, userGuard] },
  { path: "question/approved", component: ApprovedQuestion, canActivate: [authGuard, userGuard] },




  // Anyone
  { path: "question_with_answer", component: QuestionWithAnswer },






  // admin
  { path: "dashboard/admin", component: AdminDashboard, canActivate: [authGuard, adminGuard] },
  { path: "question/status", component: QuestionStatus, canActivate: [authGuard, adminGuard] },
  { path: "question/rejected", component: RejectedQuestions, canActivate: [authGuard, adminGuard] },
  { path: "answer/status", component: AnswerStatus, canActivate: [authGuard, adminGuard] },
  { path: "answer/reject", component: RejectedAnswers, canActivate: [authGuard, adminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
