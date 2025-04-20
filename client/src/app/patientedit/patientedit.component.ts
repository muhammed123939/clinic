import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Patientmember } from '../_models/patientmember';
import { PatientService } from '../_services/patient.service';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountpatientService } from '../_services/accountpatient.service';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-patientedit',
  standalone: true,
  imports: [TabsModule, FormsModule, JsonPipe, NgIf],
  templateUrl: './patientedit.component.html',
  styleUrl: './patientedit.component.css'
})
export class PatienteditComponent implements OnInit{
  
  @ViewChild('editForm') editForm?: NgForm;
    @HostListener('window:beforeunload', ['event']) notify($event: any) {
      if (this.editForm?.dirty) {
        $event.returnValue = true;
      }
    }
  
  selecteduser? : Patientmember;
  patientid? : number ; 
  private toastr = inject(ToastrService);
  confirmPassword: string = '';
  passwordTouched: boolean = false;
  originalUser?: Patientmember;

    constructor(  public adminaccountservice :AccountService ,  public patientservice :PatientService , public patientaccountservice :AccountpatientService , 
       private router : Router  , private myroute: ActivatedRoute,  ) { }
 
    ngOnInit(): void {

      if(this.patientaccountservice.currentPatient()){
        this.patientid=this.patientaccountservice.currentPatient()?.id;
        this.loadpatient(this.patientid!);
       }
  
      else{
        this.patientid = this.myroute.snapshot.params['id'] ;
        if(this.patientid)
        this.loadpatient(this.patientid!);
      }
  }

  loadpatient(patientId: number): void {
    this.patientservice.getpatientbyid(patientId).subscribe({
      next: (x) => {
        this.selecteduser = { ...x };
        this.originalUser = { ...x }; // store original state for comparison
      },
      error: (err) => this.toastr.error(err.error),
     });
  }
   
  edit() {

    if (!this.hasChanges()) {
      this.toastr.info('No changes to save.');
      return;
    }
  
    if (this.passwordTouched && this.selecteduser?.password !== this.confirmPassword) {
      this.toastr.error('Passwords do not match');
      return;
    }
    
    const updatedUser: Patientmember = {
      id: this.selecteduser!.id!,
      name: this.selecteduser!.name!,
      dateOfBirth: this.selecteduser!.dateOfBirth!,
      
      age: this.selecteduser!.age!,
      gender: this.selecteduser!.gender!,
      mobileNumber : this.selecteduser!.mobileNumber! , 
      adminId: this.selecteduser!.adminId!,
      nationalNumber: this.selecteduser!.nationalNumber! , 
      password: this.selecteduser?.password   // will be deleted if needed
    };
    
  
    if (
      !this.passwordTouched ||
      !this.selecteduser?.password ||
      this.selecteduser.password.trim().length === 0
    ) {
      delete updatedUser.password;
    }
      
    this.patientservice.updatePatient(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Patient edited successfully');
        this.editForm?.reset(this.editForm?.value);
        this.confirmPassword = '';
        this.passwordTouched = false;
  
        this.originalUser = { ...updatedUser }; // refresh original
      },
      error: err => this.toastr.error('Update failed')
    });

  }

      hasChanges(): boolean {
        if (!this.selecteduser || !this.originalUser) return false;
      
      
        const keys: (keyof Patientmember)[] = ['id', 'name','dateOfBirth','age','gender','mobileNumber','adminId' , 'nationalNumber'];
    
        return keys.some((key) => this.selecteduser![key] !== this.originalUser![key]) ||
        (this.passwordTouched && this.selecteduser?.password?.trim().length > 0);
      }

    onMemberChange(event: Patientmember) {
    this.selecteduser = event;
    }


}
