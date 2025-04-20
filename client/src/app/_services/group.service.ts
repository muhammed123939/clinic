import { inject, Injectable } from '@angular/core';
import { Group } from '../_models/group';
import { Observable } from 'rxjs';
import { AccountService } from './account.service';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' })
  };

  constructor(public accountservice : AccountService ) { }

  getgroups(): Observable<Group[]> {
    return this.http.get<Group[]>(this.baseUrl + `group`, this.httpOptions);
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'group', model)
  }

  deleteGroup(id: number) {
    return this.http.delete(this.baseUrl + `group/${id}`).subscribe(x => {
      console.log(x)
    })
  }

  getGroupbyid(id: number): Observable<Group> {
    return this.http.get<Group>(this.baseUrl + `group/${id}`, this.httpOptions);
  } 
  
  updateGroup(member: Group) {
    return this.http.put(this.baseUrl + 'group/', member)
  }
  
}
