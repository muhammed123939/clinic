import { inject, Injectable } from '@angular/core';
import { Product } from '../_models/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountService } from './account.service';
import { Store } from '../_models/store';
import { Group } from '../_models/group';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  };

  constructor(public accountservice : AccountService ) { }


  getStores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.baseUrl + `product/stores`, this.httpOptions);
  }

  getGroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseUrl + `product/groups`, this.httpOptions);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl + `product`, this.httpOptions);
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'product', model)
  }

  deleteProduct(id: number) {
    return this.http.delete(this.baseUrl + `product/${id}`);
  }

  getProductbyid(id: number): Observable<Product> {
    return this.http.get<Product>(this.baseUrl + `product/${id}`, this.httpOptions);
  } 
  
  updateProduct(member: Product) {
    return this.http.put(this.baseUrl + 'product', member)
  }
 
}
