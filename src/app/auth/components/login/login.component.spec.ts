import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

class MockAuthService {
  setUserRole() {}
  setToken() {}
  isAuthSignal = { set: jasmine.createSpy('set') };
}

class MockUsersService {
  authenticate() {
    return { success: true, role: 'user', token: 'mock-token' };
  }
}

class MockMessageService {
  add() {}
}

class MockRouter {
  navigate() {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: UsersService, useClass: MockUsersService },
        { provide: MessageService, useClass: MockMessageService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería crear un formulario con controles de email y contraseña', () => {
    expect(component.loginForm.contains('email')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  it('debería requerir email y contraseña', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');
    component.validateForm();

    expect(emailControl?.errors?.['required']).toBeTruthy();
    expect(passwordControl?.errors?.['required']).toBeTruthy();
  });

  it('debería llamar al método login y navegar en caso de éxito', () => {
    spyOn(component['router'], 'navigate');
    component.loginForm.setValue({
      email: 'test@example.com',
      password: 'password123',
    });
    component.login();

    expect(component['router'].navigate).toHaveBeenCalledWith(['products']);
  });

  it('debería mostrar un mensaje de error con credenciales inválidas', () => {
    spyOn(component['usersService'], 'authenticate').and.returnValue({
      success: false,
    });
    spyOn(component, 'showMSG');

    component.loginForm.setValue({
      email: 'wrong@example.com',
      password: 'wrongpassword',
    });
    component.login();

    expect(component.showMSG).toHaveBeenCalledWith(
      'error',
      'ERROR',
      'El email y/o contraseña son incorrectos'
    );
  });
});
