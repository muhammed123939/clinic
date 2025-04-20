import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { map, Observable } from 'rxjs';
import { Doctormember } from '../_models/doctormember';
import { Fields } from '../_models/fields';
import { Adminaddeddoctor } from '../_models/adminaddeddoctor';
import { Photo } from '../_models/photo';
import { Appointment } from '../_models/appointment';

@Injectable({
  providedIn: 'root'
})
export class DoctormemberService {

  private http = inject(HttpClient);
  httpOptions={
    headers : new HttpHeaders({'Content-Type':'application/json; charset=utf-8'})
  };
  baseUrl = environment.apiUrl;
  
  deletephoto(id:number){
    return this.http.delete(this.baseUrl + `doctor/deletephoto/${id}` )
  }
  
   deleteadmin(id:number){
    return this.http.delete(this.baseUrl + `doctor/${id}` ).subscribe(x =>{
    console.log(x)   
    })
    }

    getphotos(): Observable <Photo[]> {
      return this.http.get<Photo[]>(this.baseUrl + `doctor/Getphotos` , this.httpOptions);
    }

    getappointments(doctorId:number) : Observable <Appointment[]> {
      return this.http.get<Appointment[]>(this.baseUrl + `doctor/Getappointments/${doctorId}`, this.httpOptions);
    }
    
    getphoto(doctorId:number) : Observable <Photo[]> {
      return this.http.get<Photo[]>(this.baseUrl + `doctor/Getdoctorphoto/${doctorId}`, this.httpOptions);
    }
    getuserbyid(id:number): Observable <Doctormember> {
      return this.http.get<Doctormember>(this.baseUrl + `doctor/${id}` , this.httpOptions);
    }

    getMembers() : Observable <Doctormember[]>{
      return this.http.get<Doctormember[]>(this.baseUrl + 'doctor/' , this.httpOptions);
      }

        
    getadmins() : Observable <Adminaddeddoctor[]>{
      return this.http.get<Adminaddeddoctor[]>(this.baseUrl + 'doctor/adminaddedthedoctor' , this.httpOptions);
      }

    getfields() : Observable <Fields[]>{
      return this.http.get<Fields[]>(this.baseUrl + 'doctor/fieldsofdoctor' , this.httpOptions);
      }
  
    updateAdmin(member:Doctormember){
      return this.http.put(this.baseUrl + 'doctor/' , member)
    }
      

}
