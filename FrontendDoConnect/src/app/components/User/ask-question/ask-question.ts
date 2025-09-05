// import { Component } from '@angular/core';
// import { QuestionService } from '../../../services/question-service';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// @Component({
//   selector: 'app-ask-question',
//   standalone: false,
//   templateUrl: './ask-question.html',
//   styleUrl: './ask-question.css'
// })
// export class AskQuestion {
//   askForm: FormGroup;
//   message = '';

//   constructor(private fb: FormBuilder, private questionService: QuestionService) {
//     this.askForm = this.fb.group({
//       questionTitle: ['', Validators.required],
//       questionText: ['', Validators.required],
//     });
//   }
//   onSubmit() {
//     if (this.askForm.invalid) return;

//     this.questionService.askQuestion(this.askForm.value).subscribe({
//       next: (res) => {
//         this.message = res.message;
//         this.askForm.reset();
//       },
//       error: (err) => {
//         console.error(err);
//         this.message = 'Failed to submit question.';
//       }
//     });
//   }
// }











































import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuestionService } from '../../../services/question-service';

@Component({
  selector: 'app-ask-question',
  standalone: false,
  templateUrl: './ask-question.html',
  styleUrl: './ask-question.css'
})
export class AskQuestion {
  askForm: FormGroup;
  selectedFile: File | null = null;
  message = '';

  constructor(private fb: FormBuilder, private questionService: QuestionService) {
    this.askForm = this.fb.group({
      questionTitle: ['', Validators.required],
      questionText: ['', Validators.required]
    });
  }

  // ✅ Capture selected image
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  // ✅ Submit form
  // onSubmit() {
  //   if (this.askForm.invalid) {
  //     this.message = 'Please fill all fields!';
  //     return;
  //   }

  //   if (!this.selectedFile) {
  //     this.message = 'Please select an image!';
  //     return;
  //   }

  //   // ✅ Create FormData
  //   const formData = new FormData();
  //   formData.append('questionTitle', this.askForm.value.questionTitle);
  //   formData.append('questionText', this.askForm.value.questionText);
  //   formData.append('Photo', this.selectedFile);
  //   formData.append('imageName', this.selectedFile.name);

  //   // ✅ Call service
  //   this.questionService.askQuestion(formData).subscribe({
  //     next: (res) => {
  //       this.message = 'Question added successfully!';
  //       this.askForm.reset();
  //       this.selectedFile = null;
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.message = 'Failed to submit question.';
  //     }
  //   });
  // }



  onSubmit() {
    if (this.askForm.invalid) {
      this.message = 'Please fill all fields!';
      return;
    }

    const formData = new FormData();
    formData.append('questionTitle', this.askForm.value.questionTitle);
    formData.append('questionText', this.askForm.value.questionText);

    // ✅ Only append image if selected
    if (this.selectedFile) {
      formData.append('Photo', this.selectedFile);
      formData.append('imageName', this.selectedFile.name);
    }

    this.questionService.askQuestion(formData).subscribe({
      next: (res) => {
        this.message = 'Question added successfully!';
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
