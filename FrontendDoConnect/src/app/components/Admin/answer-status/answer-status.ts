import { Component } from '@angular/core';
import { AnswerService } from '../../../services/answer-service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-answer-status',
  standalone: false,
  templateUrl: './answer-status.html',
  styleUrl: './answer-status.css'
})
export class AnswerStatus {
  constructor(private answerService: AnswerService, private router: Router) { }
  pendingAnswers: any[] = []
  selectedImage: string | null = null;

  ngOnInit() {
    this.getPendingAnswers()
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

  showLargeImage(imagePath: string) {
    this.selectedImage = imagePath;
  }

  // Function to close the modal
  closeModal() {
    this.selectedImage = null;
  }

  getPendingAnswers() {
    this.answerService.getPendingAnswers().subscribe(data => {
      this.pendingAnswers = data
      console.log(data);

    })
  }

  ApproveAnswer(id: number) {
    this.answerService.approveAnswer(id).subscribe(data => {
      console.log(data);
      this.getPendingAnswers();

    })
  }
  rejectAnswer(id: number) {
    this.answerService.rejectAnswer(id).subscribe(data => {
      console.log(data);
      this.getPendingAnswers();

    })
  }

  deleteAnswer(id: number) {
    const status = confirm("Are You sure to delete this Answer ?")
    if (status) {

      this.answerService.DeleteAnswer(id).subscribe(Date => {
        this.getPendingAnswers();
      })
    }
  }
}
