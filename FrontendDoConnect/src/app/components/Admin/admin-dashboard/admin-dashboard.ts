import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard {
  userName: string | null = '';
  role: string | null = '';
  email: string | null = '';

  constructor(private authservice: AuthService, private router: Router) { }

  ngOnInit(): void {
    const userData = this.authservice.getTokenData();

    if (userData) {
      this.userName = userData.name;
      this.role = userData.role;
      this.email = userData.email;
    }
    console.log(this.email);

  }

  logout() {
    this.authservice.logout();
    this.router.navigate([""])
  }
}
