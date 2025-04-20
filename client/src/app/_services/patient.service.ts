import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Patientmember } from '../_models/patientmember';
import { Observable } from 'rxjs';
import { Adminaddeddoctor } from '../_models/adminaddeddoctor';

@Injectable({
  providedIn: 'root'
})
export class PatientService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  };

  deletepatient(id: number) {
    return this.http.delete(this.baseUrl + `patient/${id}`).subscribe(x => {
      console.log(x)
    })
  }

  getpatientbyid(id: number): Observable<Patientmember> {
    return this.http.get<Patientmember>(this.baseUrl + `patient/${id}`, this.httpOptions);
  }

  getpatientappointment(doctorid:number): Observable<Adminaddeddoctor[]> {
    return this.http.get<Adminaddeddoctor[]>(this.baseUrl + `patient/appointmentsbypatient/${doctorid}`, this.httpOptions);
  }

  getadmins(): Observable<Adminaddeddoctor[]> {
    return this.http.get<Adminaddeddoctor[]>(this.baseUrl + 'patient/adminaddedthepatient', this.httpOptions);
  }

  updatePatient(member: Patientmember) {
    return this.http.put(this.baseUrl + 'patient/', member)
  }

  searchPatients(term: string): Observable<Patientmember[]> {
    return this.http.get<Patientmember[]>(this.baseUrl + `patient/search?term=${term}`);
  }
    
  getPatients(): Observable<Patientmember[]> {
    return this.http.get<Patientmember[]>(this.baseUrl +'patient/' , this.httpOptions);
  }


}
