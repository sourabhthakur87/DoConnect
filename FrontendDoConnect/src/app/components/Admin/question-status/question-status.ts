import { Component } from '@angular/core';
import { QuestionService } from '../../../services/question-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-question-status',
  standalone: false,
  templateUrl: './question-status.html',
  styleUrl: './question-status.css'
})
export class QuestionStatus {

  pendingQuestion: any = []
  constructor(private pendingQuestions: QuestionService, private router: Router) { }
  selectedImage: string | null = null;

  ngOnInit() {
    this.havePendingQuestions();
  }



  showLargeImage(imagePath: string) {
    this.selectedImage = imagePath;
  }
  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }


  adminDashboard() {
    this.router.navigate(["/dashboard/admin"])
  }




  closeModal() {
    this.selectedImage = null;
  }

  havePendingQuestions() {
    this.pendingQuestions.getPendingQuestions().subscribe(data => {
      this.pendingQuestion = data;
    });
  }

  approveQuestion(id: number) {
    this.pendingQuestions.approveQuestion(id).subscribe(() => {
      this.havePendingQuestions();
    })
  }
  rejectQuestion(id: number) {
    this.pendingQuestions.rejectQuestion(id).subscribe(() => {
      this.havePendingQuestions();
    })
  }
  removeQuestion(id: number) {

    const status = confirm("Are You sure to delete this question ?")
    if (status) {
      this.pendingQuestions.removeQuestion(id).subscribe(() => {
          this.havePendingQuestions();
        })
      }
    }


}
