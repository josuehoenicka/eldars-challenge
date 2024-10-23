import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MenubarModule } from 'primeng/menubar';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../auth/services/auth.service';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { MessagesModule } from 'primeng/messages';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [
    MenubarModule,
    CommonModule,
    ToolbarModule,
    ButtonModule,
    MessagesModule,
  ],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css',
})
export class NavComponent implements OnInit {
  /* Booleans */
  isAdmin!: boolean;

  constructor(readonly router: Router, readonly authService: AuthService) {}

  ngOnInit() {
    this.setAdminAccount();
  }

  setAdminAccount() {
    this.isAdmin = this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
