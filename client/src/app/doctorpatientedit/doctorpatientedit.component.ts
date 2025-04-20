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

  constructor(public appointmentService :AppointmentService , public doctoraccountService :AccountdoctorService ,
    public patientaccountService :AccountpatientService , private myroute: ActivatedRoute, 
         private router: Router) { }
      
    ngOnInit(): void {
      this.loadappointment(this.myroute.snapshot.params['id']);

    }
    
    edit() {
      this.appointmentService.updateAppointment(this.editForm?.value).subscribe({
     next: _ => {
       this.toastr.success('appointment edited successfully');
       this.editForm?.reset(this.selectedappointment);     
     }
   })
  
  }
  
  loadappointment(appointmentid:number){
    
if(this.doctoraccountService.currentDoctor()?.id!)
  {
    this.appointmentService.getappointmentbyid2(appointmentid , this.doctoraccountService.currentDoctor()?.id!).subscribe({
      next: (x) => (this.selectedappointment = x),
      error: (err) => this.toastr.error(err.error)
    });
  }
  
  if(this.patientaccountService.currentPatient()?.id!)
    {
      this.appointmentService.getappointmentbypatientedit(appointmentid , this.patientaccountService.currentPatient()?.id!).subscribe({
        next: (x) => (this.selectedappointment = x),
        error: (err) => this.toastr.error(err.error)
      });
    }
     
  }
}
