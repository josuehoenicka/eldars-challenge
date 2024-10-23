import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { UsersService } from '../../services/users.service';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { iToast } from '../../../common/interfaces/iToast';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FloatLabelModule,
    ReactiveFormsModule,
    NgIf,
    NgFor,
    ButtonModule,
    NgClass,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  /* Forms */
  loginForm!: UntypedFormGroup;

  constructor(
    readonly messageService: MessageService,
    readonly authService: AuthService,
    readonly router: Router,
    readonly usersService: UsersService
  ) {}

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  login(): void {
    this.validateForm();
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.value;
    const result = this.usersService.authenticate(email, password);
    if (result.success) {
      if (result.role) this.authService.setUserRole(result.role);
      if (result.token) this.authService.setToken(result.token);
      this.authService.isAuthSignal.set(true);
      this.router.navigate(['products']);
    } else {
      this.showMSG(
        iToast.error,
        'ERROR',
        'El email y/o contraseña son incorrectos'
      );
    }
  }

  validateForm() {
    if (
      this.email?.errors?.['required'] ||
      this.password?.errors?.['required']
    ) {
      this.showMSG(
        iToast.error,
        'ERROR',
        'El campo email y contraseña son requeridos'
      );
    } else if (this.email?.errors?.['email']) {
      this.showMSG(iToast.error, 'ERROR', 'El email no es válido');
    } else if (this.password?.errors?.['minlength']) {
      this.showMSG(
        iToast.error,
        'ERROR',
        'La contraseña debe tener 8 caracteres o más'
      );
    }
  }

  showMSG(
    severityShow: 'success' | 'info' | 'warn' | 'error' | 'custom',
    title: string,
    detail: string,
    sticky: boolean = false
  ) {
    this.messageService.add({
      severity: severityShow,
      summary: title,
      key: 'toast',
      detail: detail,
      sticky: sticky,
    });
  }
}
