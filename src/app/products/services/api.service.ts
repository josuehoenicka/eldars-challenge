import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable, of, tap } from 'rxjs';
import { iProduct } from '../interfaces/iProduct';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  readonly apiUrl = environment.apiUrl;
  readonly productsCookieName = 'productsCache';

  constructor(
    readonly http: HttpClient,
    readonly cookieService: CookieService
  ) {}

  getProducts(): Observable<iProduct[]> {
    const cachedProducts = this.cookieService.get(this.productsCookieName);

    if (cachedProducts) {
      return of(JSON.parse(cachedProducts));
    } else {
      return this.http.get<iProduct[]>(`${this.apiUrl}/posts`).pipe(
        tap((products) => {
          this.cookieService.set(
            this.productsCookieName,
            JSON.stringify(products),
            1
          );
        })
      );
    }
  }

  getProductByID(id: string): Observable<iProduct> {
    return this.http.get<iProduct>(`${this.apiUrl}/posts/${id}`);
  }

  createProduct(body: iProduct): Observable<iProduct> {
    return this.http.post<iProduct>(`${this.apiUrl}/posts`, body);
  }

  updateProduct(body: iProduct, id: number): Observable<iProduct> {
    return this.http.put<iProduct>(`${this.apiUrl}/posts/${id}`, body);
  }

  deleteProduct(id: number | undefined): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/posts/${id}`);
  }
}
