import { inject, Injectable, OnInit, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Patient } from '../_models/patient';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AccountpatientService implements OnInit{
private http = inject(HttpClient);
  baseurl = environment.apiUrl;
  currentPatient = signal<Patient | null>(null);
  httpOptions={
    headers : new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
  };

  ngOnInit(): void {
  }

  
  login(model: any) {
      return this.http.post<Patient>(this.baseurl + 'account/loginpatient', model).pipe(
        map(loggedpatient => {
          if (loggedpatient) {
            localStorage.setItem('patientloginstorage', JSON.stringify(loggedpatient));
            this.currentPatient.set(loggedpatient);
          }
        })
      )
    }
    
    register(model: any) {
      return this.http.post(this.baseurl + 'account/registerpatient', model)
    }
  
    
    setcurrentPatient(setpatient: Patient) {
      this.setcurrentPatient(setpatient);
    }
  
    logout() {
      localStorage.removeItem('patientloginstorage');
      this.currentPatient.set(null);
    }
}
