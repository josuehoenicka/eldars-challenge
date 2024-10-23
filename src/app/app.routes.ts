import { Routes } from '@angular/router';
import { LoginComponent } from './auth/components/login/login.component';
import { ProductsComponent } from './products/components/products/products.component';
import { authGuard } from './common/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'products',
    component: ProductsComponent,
    canActivate: [authGuard],
  },
];
