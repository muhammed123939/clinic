import { JsonPipe, NgIf } from '@angular/common';
import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AppointmentService } from '../_services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Appointment } from '../_models/appointment';
import { AccountdoctorService } from '../_services/accountdoctor.service';
import { AccountpatientService } from '../_services/accountpatient.service';

@Component({
  selector: 'app-doctorpatientedit',
  standalone: true,
  imports: [FormsModule, JsonPipe, NgIf],
  templateUrl: './doctorpatientedit.component.html',
  styleUrl: './doctorpatientedit.component.css'
})
export class DoctorpatienteditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  private toastr = inject(ToastrService);
  selectedappointment?: Appointment;
  originalAppointment?: Appointment;

  constructor(public appointmentService: AppointmentService, public doctoraccountService: AccountdoctorService,
    public patientaccountService: AccountpatientService, private myroute: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.loadappointment(this.myroute.snapshot.params['id']);

  }

  loadappointment(appointmentid: number) {

    if (this.doctoraccountService.currentDoctor()?.id!) {
      this.appointmentService.getappointmentbyid2(appointmentid, this.doctoraccountService.currentDoctor()?.id!).subscribe({
        next: (x) => {
          this.selectedappointment = { ...x };
          this.originalAppointment = { ...x }; // store original state for comparison
        },
        error: (err) => this.toastr.error(err.error)
      });
    }

    if (this.patientaccountService.currentPatient()?.id!) {
      this.appointmentService.getappointmentbypatientedit(appointmentid, this.patientaccountService.currentPatient()?.id!).subscribe({
        next: (x) => (this.selectedappointment = x),
        error: (err) => this.toastr.error(err.error)
      });
    }

  }

  isFutureOrToday(date: string | Date): boolean {
    const selectedDate = new Date(date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate >= today;
  }

  edit() {

    if (!this.hasChanges()) {
      this.toastr.info('No changes to save.');
      return;
    }

    if (!this.isFutureOrToday(this.selectedappointment!.date!)) {
      this.toastr.error('You can’t choose a date in the past.');
      return;
    }

    const updatedAppointment: Appointment = {
      id: this.selectedappointment!.id!,
      date: this.selectedappointment!.date!,
      doctorId: this.selectedappointment!.doctorId!,
      adminId: this.selectedappointment!.adminId!,
      patientId: this.selectedappointment!.patientId!,
      patientcase: this.selectedappointment!.patientcase!,
      patientcomment: this.selectedappointment!.patientcomment!,
      time: this.selectedappointment!.time!
    };

    this.appointmentService.updateAppointment(updatedAppointment as Appointment).subscribe({
      next: _ => {
        this.toastr.success('Appointment edited successfully');
        this.editForm?.reset(this.editForm?.value);

        this.originalAppointment = { ...updatedAppointment }; // refresh original
      },
      error: err => this.toastr.error('Update failed')
    });
  }

  hasChanges(): boolean {
    if (!this.selectedappointment || !this.originalAppointment) return false;

    const keys: (keyof Appointment)[] = ['id', 'date', 'doctorId', 'adminId', 'patientId',
      'patientcase', 'patientcomment', 'time'];

    return keys.some((key) => this.selectedappointment![key] !== this.originalAppointment![key]);
  }
}
