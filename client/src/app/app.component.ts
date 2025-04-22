import { Component, inject, NgModule, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./nav/nav.component";
import { AccountService } from './_services/account.service';
import { SlideshowComponent } from "./slideshow/slideshow.component";
import { NgxSpinnerComponent } from 'ngx-spinner';
import { AccountdoctorService } from './_services/accountdoctor.service';
import { AccountpatientService } from './_services/accountpatient.service';

@Component({
  selector: 'app-root'  , 
  standalone: true,
  imports: [RouterOutlet, NavComponent ,NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent  implements OnInit {

  public accountservice = inject(AccountService);
  public accountpatientservice = inject(AccountpatientService);
  public doctoraccountservice = inject(AccountdoctorService);
  title = 'client';
  
  ngOnInit(): void {
    this.setCurrentUser();
    this.setCurrentDoctor();
    this.setCurrentPatient();
  }

  setCurrentUser() {
    const adminString = localStorage.getItem('adminloginstorage');
    if (!adminString) return; // end and returning null 
    const admin = JSON.parse(adminString);
    this.accountservice.currentAdmin.set(admin);
  }
  
  setCurrentPatient() {
    const patientString = localStorage.getItem('patientloginstorage');
    if (!patientString) return; // end and returning null 
    const patient = JSON.parse(patientString);
    this.accountpatientservice.currentPatient.set(patient);
  }
  setCurrentDoctor() {
    const doctorString = localStorage.getItem('doctorloginstorage');
    if (!doctorString) return; // end and returning null 
    const doctor = JSON.parse(doctorString);
    this.doctoraccountservice.currentDoctor.set(doctor);
  }
  
}
