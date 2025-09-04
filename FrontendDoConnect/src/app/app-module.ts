import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Login } from './components/Auth/login/login';
import { Register } from './components/Auth/register/register';
import { AskQuestion } from './components/User/ask-question/ask-question';
import { ApprovedQuestion } from './components/User/approved-question/approved-question';
import { QuestionStatus } from './components/Admin/question-status/question-status';
import { AnswerStatus } from './components/Admin/answer-status/answer-status';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AddAnswer } from './components/User/add-answer/add-answer';
import { UserDashboard } from './components/User/user-dashboard/user-dashboard';
import { AdminDashboard } from './components/Admin/admin-dashboard/admin-dashboard';
import { JwtInterceptor } from './SecureRoute/setHeader/jwt-header-interceptor';

@NgModule({
  declarations: [
    App,
    Login,
    Register,
    AskQuestion,
    ApprovedQuestion,
    QuestionStatus,
    AnswerStatus,
    AddAnswer,
    UserDashboard,
    AdminDashboard
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
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
