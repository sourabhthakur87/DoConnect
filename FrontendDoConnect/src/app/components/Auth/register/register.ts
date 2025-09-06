import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth-service';
import { IUser } from '../../../Model/user.model';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  registerForm!: FormGroup;
  message = '';
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
        ]
      ], role: [0, Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) return;

    const formData: IUser = {
      userName: this.registerForm.value.userName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      role: Number(this.registerForm.value.role)
    };

    this.authService.register(formData).subscribe({
      next: () => {
        this.message = '✅ Registration successful! Please login.';
        
        setTimeout(() => this.router.navigate(['/']), 1000);
      },
      error: () => {
        this.message = '❌ Registration failed. Try again.';
      }
    });
  }
}
