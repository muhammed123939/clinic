import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Adminaddeddoctor } from '../_models/adminaddeddoctor';
import { Appointment } from '../_models/appointment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  };

  getappointments(date: Date): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl + `appointment/adminappointments/${date}`, this.httpOptions);
  }

  getDoctors(): Observable<Adminaddeddoctor[]> {
    return this.http.get<Adminaddeddoctor[]>(this.baseUrl + 'appointment/getDoctors', this.httpOptions);
  }

  getPatients(): Observable<Adminaddeddoctor[]> {
    return this.http.get<Adminaddeddoctor[]>(this.baseUrl + 'appointment/getPatients', this.httpOptions);
  }

  getAdmins(): Observable<Adminaddeddoctor[]> {
    return this.http.get<Adminaddeddoctor[]>(this.baseUrl + 'appointment/getAdmins', this.httpOptions);
  }


  register(model: any) {
    return this.http.post(this.baseUrl + 'appointment/registerappointment', model)
  }

  deleteappointment(id: number) {
    return this.http.delete(this.baseUrl + `appointment/${id}`).subscribe(x => {
      console.log(x)
    })
  }

  getappointmentbyid(id: number): Observable<Appointment> {
    return this.http.get<Appointment>(this.baseUrl + `appointment/getappointment/${id}`, this.httpOptions);
  } 

  getappointmentbypatient(idappointment: number ): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.baseUrl + `appointment/GetAppointmentsByPatient/${idappointment}`, this.httpOptions);
  } 

  getappointmentbypatientedit(idappointment: number , idpatient: number): Observable<Appointment> {
    return this.http.get<Appointment>(this.baseUrl + `appointment/GetAppointmentsByPatientedit/${idappointment}/${idpatient}`, this.httpOptions);
  } 

  getappointmentbyid2(idappointment: number , iddoctor: number): Observable<Appointment> {
    return this.http.get<Appointment>(this.baseUrl + `appointment/getappointment2/${idappointment}/${iddoctor}`, this.httpOptions);
  }
  
  updateAppointment(member: Appointment) {
    return this.http.put(this.baseUrl + 'appointment/', member)
  }


}
