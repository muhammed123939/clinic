import { Doctormember } from '../_models/doctormember';
import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe, NgIf } from '@angular/common';
import { AccountService } from '../_services/account.service';
import { DoctormemberService } from '../_services/doctormember.service';
import { PhotoEditorComponent } from '../photo-editor/photo-editor.component';
import { AccountdoctorService } from '../_services/accountdoctor.service';
import { Photo } from '../_models/photo';

@Component({
  selector: 'app-doctor-edit',
  standalone: true,
  imports: [TabsModule, FormsModule, JsonPipe, NgIf, PhotoEditorComponent],
  templateUrl: './doctor-edit.component.html',
  styleUrl: './doctor-edit.component.css'
})
export class DoctorEditComponent implements OnInit {

  @ViewChild('editForm') editForm?: NgForm;
  
  myphotos: Array<Photo> = [];  
  doctoridbydoctor? : number ; 
  doctoridbyadmin? : number ; 
  selecteduser? : Doctormember;
  confirmPassword: string = '';
  passwordTouched: boolean = false;
  originalUser?: Doctormember;

  private toastr = inject(ToastrService);
  
  
  @HostListener('window:beforeunload', ['event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(public accountservice :AccountService ,
     public accountdoctorservice :AccountdoctorService , private myroute: ActivatedRoute, 
     private router: Router, public doctormemberService: DoctormemberService) { }
  
  ngOnInit(): void {

  if(this.accountdoctorservice.currentDoctor()){
      this.doctoridbydoctor=this.accountdoctorservice.currentDoctor()?.id;
      this.loaddoctor(this.doctoridbydoctor!);
     }

    else{
      this.doctoridbyadmin = this.myroute.snapshot.params['id'] ;
      this.loaddoctor(this.doctoridbyadmin!);
    }
  }

  loaddoctor(doctorid:number){
    this.doctormemberService.getphoto(doctorid).subscribe(x => this.myphotos = x);
    this.doctormemberService.getuserbyid(doctorid).subscribe({
      
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
  
    const updatedUser: Doctormember = {
      id: this.selecteduser!.id!,
      name: this.selecteduser!.name!,
      dateOfBirth: this.selecteduser!.dateOfBirth!,
      
      age: this.selecteduser!.age!,
      fieldId: this.selecteduser!.fieldId!,
      adminId: this.selecteduser!.adminId!,
      password: this.selecteduser?.password ,  // will be deleted if needed
      doctorPrice: this.selecteduser!.doctorPrice!
    };
    
  
    if (
      !this.passwordTouched ||
      !this.selecteduser?.password ||
      this.selecteduser.password.trim().length === 0
    ) {
      delete updatedUser.password;
    }
      
    this.doctormemberService.updateAdmin(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Doctor edited successfully');
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
    
      const keys: (keyof Doctormember)[] = ['id', 'name','dateOfBirth','age','fieldId','adminId','doctorPrice'];
  
      return keys.some((key) => this.selecteduser![key] !== this.originalUser![key]) ||
      (this.passwordTouched && this.selecteduser?.password?.trim().length > 0);
    }

  onMemberChange(event: Doctormember) {
    this.selecteduser = event;
  }

}
