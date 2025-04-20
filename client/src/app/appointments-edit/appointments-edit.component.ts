import { JsonPipe, NgIf } from '@angular/common';
import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AppointmentService } from '../_services/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from '../_models/appointment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-appointments-edit',
  standalone: true,
  imports: [FormsModule, JsonPipe, NgIf],
  templateUrl: './appointments-edit.component.html',
  styleUrl: './appointments-edit.component.css'
})
export class AppointmentsEditComponent implements OnInit {
  
    @ViewChild('editForm') editForm?: NgForm;
    @HostListener('window:beforeunload', ['event']) notify($event: any) {
      if (this.editForm?.dirty) {
        $event.returnValue = true;
      }
    }
    private toastr = inject(ToastrService);
    selectedappointment? : Appointment;
    appointmentid? : number ; 

    constructor(public appointmentService :AppointmentService , private myroute: ActivatedRoute, 
       private router: Router) { }
    
  ngOnInit(): void {
    this.appointmentid = this.myroute.snapshot.params['id'] ;
    this.loadappointment(this.appointmentid!);
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
  this.appointmentService.getappointmentbyid(appointmentid).subscribe({
    next: (x) => (this.selectedappointment = x), // Assign the fetched patient data
    error: (err) => this.toastr.error(err.error), // Display the error message
  });

}
  
}
