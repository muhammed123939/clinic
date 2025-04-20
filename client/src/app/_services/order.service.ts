import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Order } from '../_models/order';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';
import { Store } from '../_models/store';
import { Product } from '../_models/product';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(public accountservice : AccountService ) { }


  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  };

  authorder(id:number): Observable<boolean> {
    return this.http.get<boolean>(this.baseUrl + `order/authorder/${id}/${this.accountservice.currentAdmin()?.id}`, this.httpOptions);
  }

  
  getProduct(id:number): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl + `order/getproduct/${id}`, this.httpOptions);
  }

  getorders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl + `order/allorders`, this.httpOptions);
  }

  getorders2(id:number): Observable<Order[]> {
    return this.http.get<Order[]>(this.baseUrl + `order/someorders/${id}`, this.httpOptions);
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'order', model)
  }

  deleteorder(id: number) {
    return this.http.delete(this.baseUrl + `order/${id}`).subscribe(x => {
      console.log(x)
    })
  }

  getorderbyid(id: number): Observable<Order> {
    return this.http.get<Order>(this.baseUrl + `order/getorder/${id}`, this.httpOptions);
  } 
  
  updateOrder(member: Order) {
    return this.http.put(this.baseUrl + 'order/', member)
  }
  
}
