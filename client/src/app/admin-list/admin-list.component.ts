import { Component, inject, input } from '@angular/core';
import { AdminmemberService } from '../_services/adminmember.service';
import { Adminmember } from '../_models/adminmember';
import { NgFor, NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

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
  this.AdminmemberService.deleteadmin(admin.id) ;
  this.admins = this.admins.filter(a => a.id !== admin.id); 
  
}

}