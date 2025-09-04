import { Component } from '@angular/core';
import { AnswerService } from '../../../services/answer-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-answer-status',
  standalone: false,
  templateUrl: './answer-status.html',
  styleUrl: './answer-status.css'
})
export class AnswerStatus {
  constructor(private answerService: AnswerService) { }
  pendingAnswers: any[] = []

  ngOnInit() {
    this.getPendingAnswers()
  }

  getPendingAnswers() {
    this.answerService.getPendingAnswers().subscribe(data => {
      this.pendingAnswers = data
      
    })
  }
  
  ApproveAnswer(id: number) {
    this.answerService.approveAnswer(id).subscribe(data => {
      console.log(data);
      this.getPendingAnswers();

    })
  }

  deleteAnswer(id:number){
    this.answerService.DeleteAnswer(id).subscribe(Date=>{
      this.getPendingAnswers();
    })
  }
}
