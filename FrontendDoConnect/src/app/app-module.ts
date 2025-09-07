import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './components/Auth/login/login';
import { Register } from './components/Auth/register/register';
import { ApprovedQuestion } from './components/User/approved-question/approved-question';
import { QuestionStatus } from './components/Admin/question-status/question-status';
import { AnswerStatus } from './components/Admin/answer-status/answer-status';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { UserDashboard } from './components/User/user-dashboard/user-dashboard';
import { AdminDashboard } from './components/Admin/admin-dashboard/admin-dashboard';
import { JwtInterceptor } from './SecureRoute/setHeader/jwt-header-interceptor';
import { RejectedQuestions } from './components/Admin/rejected-questions/rejected-questions';
import { RejectedAnswers } from './components/Admin/rejected-answers/rejected-answers';
import { AdminNav } from './components/shared/admin-nav/admin-nav';
import { QuestionWithAnswer } from './components/shared/question-with-answer/question-with-answer';
import { UserNav } from './components/shared/user-nav/user-nav';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    ApprovedQuestion,
    QuestionStatus,
    AnswerStatus,
    UserDashboard,
    AdminDashboard,
    RejectedQuestions,
    RejectedAnswers,
    AdminNav,
    QuestionWithAnswer,
    UserNav,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptor,
    multi: true,
  }
  ],
  bootstrap: [App]
})
export class AppModule { }
