import { Component } from '@angular/core';
import { AnswerService } from '../../../services/answer-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rejected-answers',
  standalone: false,
  templateUrl: './rejected-answers.html',
  styleUrl: './rejected-answers.css'
})
export class RejectedAnswers {
  rejectedAnswers: any = []
  selectedImage: string | null = null;
  constructor(private answerService: AnswerService, private router: Router) { }
  ngOnInit() {
    this.getRejectedAnswers()
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


  getRejectedAnswers() {
    this.answerService.getRejectedAnswers().subscribe(data => {
      this.rejectedAnswers = data;
      console.log(data);

    })
  }
  ApproveAnswer(id: number) {
    this.answerService.approveAnswer(id).subscribe(data => {
      console.log(data);
      this.getRejectedAnswers();

    })
  }
  deleteAnswer(id: number) {
    const status = confirm("Are You sure to delete this question ?")
    if (status) {

      this.answerService.DeleteAnswer(id).subscribe(Date => {
        this.getRejectedAnswers();
      })
    }
  }




  showLargeImage(imagePath: string) {
    this.selectedImage = imagePath;
  }

  // Function to close the modal
  closeModal() {
    this.selectedImage = null;
  }

}
