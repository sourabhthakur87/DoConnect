import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-nav',
  standalone: false,
  templateUrl: './user-nav.html',
  styleUrl: './user-nav.css'
})
export class UserNav {
  @Input() isOpen: boolean = false;
  @Output() closeMenu = new EventEmitter<void>();

  constructor(private authservice: AuthService, private router: Router) { }
  logout() {
    this.authservice.logout();
    this.router.navigate([""])
  }


}
