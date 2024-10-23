import { NgIf } from '@angular/common';
import { Component, Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { NavComponent } from './common/components/nav/nav.component';
import { AuthService } from './auth/services/auth.service';
import { FooterComponent } from './common/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, NavComponent, NgIf, FooterComponent],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  isAuth!: Signal<boolean>;

  constructor(readonly authService: AuthService) {}
}
