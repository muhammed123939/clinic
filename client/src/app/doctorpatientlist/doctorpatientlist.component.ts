import { Component, OnInit } from '@angular/core';
import { Appointment } from '../_models/appointment';
import { AccountdoctorService } from '../_services/accountdoctor.service';
import { Router } from '@angular/router';
import { DoctormemberService } from '../_services/doctormember.service';
import { NgFor, NgIf } from '@angular/common';
import { PatientService } from '../_services/patient.service';
import { Adminaddeddoctor } from '../_models/adminaddeddoctor';
import { AccountpatientService } from '../_services/accountpatient.service';
import { AppointmentService } from '../_services/appointment.service';

@Component({
  selector: 'app-doctorpatientlist',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './doctorpatientlist.component.html',
  styleUrl: './doctorpatientlist.component.css'
})

export class DoctorpatientlistComponent implements OnInit {

  appointments: Array<Appointment> = [];
  patients: Array<Adminaddeddoctor> = [];

  constructor(public appointmentservice: AppointmentService,
    public doctormemberService: DoctormemberService,
    public accountPatientService: AccountpatientService,
    public patientmemberservice: PatientService, public accountService: AccountdoctorService,
    private router: Router) { }
  ngOnInit(): void {

    if (this.accountService.currentDoctor()?.id!) {

      this.doctormemberService.getappointments(this.accountService.currentDoctor()?.id!).subscribe(x => {
        this.appointments = x;
      });

      this.patientmemberservice.getpatientappointment(this.accountService.currentDoctor()?.id!).subscribe(x => {
        this.patients = x;
      });

    }

    if (this.accountPatientService.currentPatient()?.id!) {

      this.appointmentservice.getappointmentbypatient(this.accountPatientService.currentPatient()?.id!).subscribe(x => {
        this.appointments = x;
      });

    }
  }
  edititem(appointment: Appointment) {

    if(this.accountService.currentDoctor()){
      this.router.navigateByUrl(`doctorpatientedit/${appointment.id}`);
    }

    if(this.accountPatientService.currentPatient())
    {
      this.router.navigateByUrl(`patientappointmentedit/${appointment.id}`);
    }
  }

}
