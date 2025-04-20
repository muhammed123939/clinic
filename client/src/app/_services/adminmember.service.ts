import { inject, Injectable, signal } from '@angular/core';
import { Adminmember } from '../_models/adminmember';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AdminmemberService {

  private http = inject(HttpClient);
  httpOptions={
    headers : new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
  };
  baseUrl = environment.apiUrl;

  deleteadmin(id:number){
  return this.http.delete(this.baseUrl + `admin/${id}` ).subscribe(x =>{
  console.log(x)   
  })
  }

  getMembers() : Observable <Adminmember[]>{
    return this.http.get<Adminmember[]>(this.baseUrl + 'admin/' , this.httpOptions);
    }
  
  updateAdmin(member:Adminmember){
    return this.http.put(this.baseUrl + 'admin/' , member)
  }
    
  getuserbyid(id:number): Observable <Adminmember> {
    return this.http.get<Adminmember>(this.baseUrl + `admin/${id}` , this.httpOptions);
  }    
}
