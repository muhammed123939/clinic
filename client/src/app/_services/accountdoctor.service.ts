import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Doctor } from '../_models/doctor';
import { Fields } from '../_models/fields';

@Injectable({
  providedIn: 'root'
})
export class AccountdoctorService implements OnInit {
  private http = inject(HttpClient);
  baseurl = environment.apiUrl;
  currentDoctor = signal<Doctor | null>(null);
  httpOptions={
    headers : new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
  };

  ngOnInit(): void {

  }

  login(model: any) {
    return this.http.post<Doctor>(this.baseurl + 'account/logindoctor', model).pipe(
      map(loggeddoctor => {
        if (loggeddoctor) {
          localStorage.setItem('doctorloginstorage', JSON.stringify(loggeddoctor));
          this.currentDoctor.set(loggeddoctor);
        }
      })
    )
  }
  
  getfields() : Observable <Fields[]>{
    return this.http.get<Fields[]>(this.baseurl + 'account/fields' , this.httpOptions);
    }

  register(model: any) {
    return this.http.post(this.baseurl + 'account/registerdoctor', model)
  }

  setcurrentDoctor(setdoctor: Doctor) {
    this.setcurrentDoctor(setdoctor);
  }

  logout() {
    localStorage.removeItem('doctorloginstorage');
    this.currentDoctor.set(null);
  }
}
