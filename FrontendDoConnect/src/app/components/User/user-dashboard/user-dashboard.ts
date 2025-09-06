import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';
import { AnswerService } from '../../../services/answer-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from '../../../services/question-service';

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




  askForm: FormGroup;
  selectedFile: File | null = null;
  message = '';
  isMenuOpen = false;
  constructor(private fb: FormBuilder, private authservice: AuthService, private router: Router, private questionservice: QuestionService) {
    this.askForm = this.fb.group({
      questionTitle: ['', Validators.required],
      questionText: ['', Validators.required]
    });
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  ngOnInit(): void {
    const userData = this.authservice.getTokenData();

    if (userData) {
      this.userName = userData.name;
      this.role = userData.role;
      this.email = userData.email;
    }

  }


  logout() {
    this.authservice.logout();
    this.router.navigate([""])
  }


  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  onSubmit() {
    if (this.askForm.invalid) {
      this.message = 'Please fill all fields!';
      return;
    }

    const formData = new FormData();
    formData.append('questionTitle', this.askForm.value.questionTitle);
    formData.append('questionText', this.askForm.value.questionText);

    if (this.selectedFile) {
      formData.append('Photo', this.selectedFile);
      formData.append('imageName', this.selectedFile.name);
    }

    this.questionservice.askQuestion(formData).subscribe({
      next: (res) => {
        this.message = 'Question added successfully!';
        setTimeout(() => {
          this.message = ""
        }, 1500);

        this.askForm.reset();
        this.selectedFile = null;
      },
      error: (err) => {
        console.error(err);
        this.message = 'Failed to submit question.';
      }
    });
  }
}
