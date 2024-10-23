import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';
import { iProduct } from '../interfaces/iProduct';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  readonly apiUrl = environment.apiUrl;

  constructor(readonly http: HttpClient) {}

  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`);
  }

  getProductByID(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${id}`);
  }

  createProduct(body: iProduct): Observable<any> {
    return this.http.post(`${this.apiUrl}/posts`, body);
  }

  updateProduct(body: iProduct, id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/posts/${id}`, body);
  }

  deleteProduct(id: number | undefined): Observable<any> {
    return this.http.delete(`${this.apiUrl}/posts/${id}`);
  }
}
