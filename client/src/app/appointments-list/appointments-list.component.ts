import { Component, inject, OnInit } from '@angular/core';
import { Appointment } from '../_models/appointment';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import { AppointmentService } from '../_services/appointment.service';
import { NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Adminaddeddoctor } from '../_models/adminaddeddoctor';

@Component({
  selector: 'app-appointments-list',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './appointments-list.component.html',
  styleUrl: './appointments-list.component.css'
})
export class AppointmentsListComponent implements OnInit {
  appointments: Array<Appointment> = [];
  
  adminname: Array<Adminaddeddoctor> = [];
  patientname: Array<Adminaddeddoctor> = [];
  doctorname: Array<Adminaddeddoctor> = [];
  

  private fb = inject(FormBuilder); //using reactive forms
  registerForm: FormGroup = new FormGroup({});
  private toastr = inject(ToastrService);
  constructor(public accountservice: AccountService, private router: Router, private AppointmentService: AppointmentService) {
  }

  ngOnInit(): void {
    this.initializeForm();

    this.AppointmentService.getAdmins().subscribe(x => {
      this.adminname = x;
    });

    this.AppointmentService.getPatients().subscribe(y => {
      this.patientname = y;
    });

    this.AppointmentService.getDoctors().subscribe(z => {
      this.doctorname = z;
    });

  }

  initializeForm() {
    this.registerForm = this.fb.group({
      date: ['', Validators.required]
    });
  }


  getappointments() {
    const date = this.registerForm.value.date;
    console.log(date);
    this.AppointmentService.getappointments(date).subscribe({
      next: (x) => (this.appointments = x),
      error: (err) => this.toastr.error(err.error)
    });

  }

  signup() {
    this.router.navigateByUrl("/AppointmentRegister");
  }

  edititem(appointment: Appointment) {

    this.router.navigateByUrl(`editappointment/${appointment.id}`);

  }

  deleteitem(appointment: Appointment) {
    this.AppointmentService.deleteappointment(appointment.id);
    this.appointments = this.appointments.filter(a => a.id !== appointment.id);
  }

}
