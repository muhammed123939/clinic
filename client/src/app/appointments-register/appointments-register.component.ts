import { Component, inject, NgModule, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TextInputComponent } from '../_forms/text-input/text-input.component';
import { JsonPipe, NgIf } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from '../_services/appointment.service';
import { AccountService } from '../_services/account.service';
import { DoctormemberService } from '../_services/doctormember.service';
import { Doctormember } from '../_models/doctormember';
import { Patientmember } from '../_models/patientmember';
import { PatientService } from '../_services/patient.service';

@Component({
  selector: 'app-appointments-register',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, JsonPipe, FormsModule, NgIf],
  templateUrl: './appointments-register.component.html',
  styleUrl: './appointments-register.component.css'
})

export class AppointmentsRegisterComponent implements OnInit {

  fb = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  toastr = inject(ToastrService);
  doctors: Array<Doctormember> = [];
  patients: Array<Patientmember> = [];

  constructor(public appointmentService: AppointmentService, public adminaccountService: AccountService,
    public doctorService: DoctormemberService, public patientService: PatientService) { }

  ngOnInit(): void {
    this.doctorService.getMembers().subscribe(x => {
      this.doctors = x;
    });

    this.patientService.getPatients().subscribe(x => {
      this.patients = x;
    });

    this.initializeForm()
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      doctorId: ['', Validators.required],
      adminId: [this.adminaccountService.currentAdmin()?.id, Validators.required],
      patientId: ['', Validators.required],
      date: ['', [Validators.required, this.futureDateValidator]],
      time: ['', Validators.required],
    });
  }

  // Date must be today or in the future
  futureDateValidator(control: any) {
    const selectedDate = new Date(control.value);
    const today = new Date();

    // Reset time so we only compare dates
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate >= today ? null : { dateInPast: true };
  }

  register() {
    this.appointmentService.register(this.registerForm.value).subscribe({
      next: _ => {
        this.toastr.success('Appointment Added successfully');
      }
    })
  }

}