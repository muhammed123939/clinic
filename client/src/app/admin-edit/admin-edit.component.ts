import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Adminmember } from '../_models/adminmember';
import { AdminmemberService } from '../_services/adminmember.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonPipe, NgIf } from '@angular/common';
import { AccountService } from '../_services/account.service';

@Component({
  
  selector: 'app-admin-edit',
  standalone: true,
  imports: [TabsModule, FormsModule ,JsonPipe , NgIf ],
  templateUrl: './admin-edit.component.html',
  styleUrl: './admin-edit.component.css'
})

export class AdminEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  selecteduser?: Adminmember;
  confirmPassword: string = '';
  passwordTouched: boolean = false;
  originalUser?: Adminmember;

  private toastr = inject(ToastrService);

  @HostListener('window:beforeunload', ['event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    public accountservice: AccountService,
    private myroute: ActivatedRoute,
    private router: Router,
    private adminmemberService: AdminmemberService
  ) {}

  ngOnInit(): void {
    const adminid = this.myroute.snapshot.params['id'];
    this.loadadmin(adminid);
  }

  loadadmin(adminid: number) {
    this.adminmemberService.getuserbyid(adminid).subscribe({
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
  
    const updatedUser: Adminmember = {
      id: this.selecteduser!.id!,
      name: this.selecteduser!.name!,
      canDo: this.selecteduser!.canDo!,
      storeId: this.selecteduser!.storeId!,
      password: this.selecteduser?.password // will be deleted if needed
    };
    
  
    if (
      !this.passwordTouched ||
      !this.selecteduser?.password ||
      this.selecteduser.password.trim().length === 0
    ) {
      delete updatedUser.password;
    }
      
    this.adminmemberService.updateAdmin(updatedUser as Adminmember).subscribe({
      next: _ => {
        this.toastr.success('Admin edited successfully');
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
  
    const keys: (keyof Adminmember)[] = ['id', 'name', 'canDo', 'storeId'];
  
    return keys.some((key) => this.selecteduser![key] !== this.originalUser![key]) ||
           (this.passwordTouched && this.selecteduser?.password?.trim().length > 0);
  }
  
    onMemberChange(event: Adminmember) {
    this.selecteduser = event;
  }
}
