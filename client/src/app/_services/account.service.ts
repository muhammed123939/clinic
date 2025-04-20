import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { Admin } from '../_models/admin';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService implements OnInit{
  ngOnInit(): void {
    
  }

  private http = inject(HttpClient);
  baseurl = environment.apiUrl;
  currentAdmin = signal<Admin | null>(null);

  login(model: any) {
    return this.http.post<Admin>(this.baseurl + 'account/login', model).pipe(
      map(loggedadmin => {
        if (loggedadmin) {
          localStorage.setItem('adminloginstorage', JSON.stringify(loggedadmin));
          this.currentAdmin.set(loggedadmin);
        }
      })
    )
  }

  register(model: any) {
    return this.http.post<Admin>(this.baseurl + 'account/register', model)
  }
  
  setcurrentAdmin(setadmin: Admin) {
    this.setcurrentAdmin(setadmin);
  }

  logout() {
    localStorage.removeItem('adminloginstorage');
    this.currentAdmin.set(null);
  }
   
}
