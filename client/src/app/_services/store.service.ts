import { inject, Injectable } from '@angular/core';
import { Store } from '../_models/store';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  };

  constructor(public accountservice : AccountService ) { }

  getstores(): Observable<Store[]> {
    return this.http.get<Store[]>(this.baseUrl + `store`, this.httpOptions);
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'store', model)
  }

  deletestore(id: number) {
    return this.http.delete(this.baseUrl + `store/${id}`);
  }

  getstorebyid(id: number): Observable<Store> {
    return this.http.get<Store>(this.baseUrl + `store/${id}`, this.httpOptions);
  } 
  
  updatestore(member: Store) {
    return this.http.put(this.baseUrl + 'store/', member)
  }

}
