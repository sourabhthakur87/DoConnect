import { Component } from '@angular/core';
import { QuestionService } from '../../../services/question-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rejected-questions',
  standalone: false,
  templateUrl: './rejected-questions.html',
  styleUrl: './rejected-questions.css'
})
export class RejectedQuestions {
  rejectedQuestions: any = []
  selectedImage: string | null = null;

  constructor(private questionservice: QuestionService, private router: Router) { }
  ngOnInit() {
    this.haveRejectedQuestions()
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


  haveRejectedQuestions() {
    this.questionservice.getRejectQuestion().subscribe(data => {
      this.rejectedQuestions = data;
      console.log(data);

    })
  }

  showLargeImage(imagePath: string) {
    this.selectedImage = imagePath;
  }

  // Function to close the modal
  closeModal() {
    this.selectedImage = null;
  }



  approveQuestion(id: number) {
    this.questionservice.approveQuestion(id).subscribe(() => {
      this.haveRejectedQuestions()
    })
  }

  removeQuestion(id: number) {
    const status = confirm("Are You sure to delete this question ?")
    if (status) {

      this.questionservice.removeQuestion(id).subscribe(() => {
        this.haveRejectedQuestions()
      })
    }
  }
}
