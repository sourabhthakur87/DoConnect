import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-nav',
  standalone: false,
  templateUrl: './admin-nav.html',
  styleUrl: './admin-nav.css'
})
export class AdminNav {
  @Input() isOpen: boolean = false;
  @Output() closeMenu = new EventEmitter<void>();

  constructor(private authservice: AuthService, private router: Router) { }
  logout() {
    this.authservice.logout();
    this.router.navigate([""])
  }

  
}
