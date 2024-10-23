import { Injectable } from '@angular/core';
import { iUser } from '../interfaces/iUser';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor() {}

  /* Nota: El token de test lo genere de "https://jwt.io/" */
  users: iUser[] = [
    {
      email: 'gabrielduque@mail.com',
      password: '12345678',
      role: 'user',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impvc3VlaG9lbmlja2FAbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Njc4Iiwicm9sZSI6InVzZXIifQ.w9IfFuQ7BBfIlhnXsuYeTT45w_PBroGF7c3dnhdUmcc',
    },
    {
      email: 'josuehoenicka@mail.com',
      password: '12345678',
      role: 'admin',
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Impvc3VlaG9lbmlja2FAbWFpbC5jb20iLCJwYXNzd29yZCI6IjEyMzQ1Njc4Iiwicm9sZSI6ImFkbWluIn0.76ybannM9g7R7dOFVk9PXBKM9AzHp8xrJTXkobjDT7g',
    },
  ];

  authenticate(email: string, password: string) {
    const user = this.users.find(
      (user) => user.email === email && user.password === password
    );
    return user
      ? { success: true, role: user.role, token: user.token }
      : { success: false };
  }
}
