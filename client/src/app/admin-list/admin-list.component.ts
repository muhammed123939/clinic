import { Component, inject, input } from '@angular/core';
import { AdminmemberService } from '../_services/adminmember.service';
import { Adminmember } from '../_models/adminmember';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-list',
  standalone: true,
  imports: [NgIf , NgFor ],
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent {

  admins : Array<Adminmember>=[];
  constructor(  public accountservice : AccountService ,  private router : Router  ,   private AdminmemberService  : AdminmemberService ){

  }

  ngOnInit(): void {
    this.AdminmemberService.getMembers().subscribe(x=>{
      this.admins=x;
    });
}


signup(){
  this.router.navigateByUrl("/AdminRegister"); 
  }
  
edititem(admin:Adminmember){
  
this.router.navigateByUrl(`editadmin/${admin.id}`);

}


deleteitem(admin:Adminmember){
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${admin.name}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.AdminmemberService.deleteadmin(admin.id).subscribe(() => {
          this.admins = this.admins!.filter(a => a.id !== admin.id);
          Swal.fire('Deleted!', `${admin.name} has been deleted.`, 'success');
        });
      }
    });
  }


}