import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgIf, TitleCasePipe } from '@angular/common';
import { AccountdoctorService } from '../_services/accountdoctor.service';
import { AccountpatientService } from '../_services/accountpatient.service';

//added
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive, TitleCasePipe , NgIf],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})

export class NavComponent implements OnInit {
  accountService = inject(AccountService);
  accountdoctorService = inject(AccountdoctorService);
  accountpatientService = inject(AccountpatientService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  selectedUserType: string = 'admin';
  model: any = {};
  modeldoctor: any = {};
  modelpatient: any = {};
  navname? : string ; 
  name? : string ; 

  ngOnInit() {
    this.setUser();
    if (this.isLoggedIn()) {
      this.navname = 'sidebar';
    } 
    else {
      this.navname = 'fixed-top';
    }
  }
  
  setUser() {
    if (this.accountService.currentAdmin()) {
      this.name = this.accountService.currentAdmin()?.username;
    } 
    else if (this.accountdoctorService.currentDoctor()) {
      this.name = this.accountdoctorService.currentDoctor()?.doctorname;
    } 
    else if (this.accountpatientService.currentPatient()) {
      this.name = this.accountpatientService.currentPatient()?.name;
    } 
    else {
      this.name = ''; // Reset the name if no user is logged in
    }
  }

  isLoggedIn(): boolean {
    return !!(
      this.accountService.currentAdmin() ||
      this.accountdoctorService.currentDoctor() ||
      this.accountpatientService.currentPatient()
    );
  }
  
  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('/'), 
        this.navname='sidebar' ;
        this.name = this.accountService.currentAdmin()?.username
      } ,
      error: error => this.toastr.error(error.error)
    }
    )
  }

  logindoctor() {
    this.accountdoctorService.login(this.modeldoctor).subscribe({
      next: _ => {
        this.router.navigateByUrl('/'), 
        this.navname='sidebar' ;
        this.name = this.accountdoctorService.currentDoctor()?.doctorname
      } ,
      error: error => this.toastr.error(error.error)
    }
    )
  }

  loginpatient() {
    this.accountpatientService.login(this.modelpatient).subscribe({
      next: _ => {
        this.router.navigateByUrl('/'), 
        this.navname='sidebar' ;
        this.name = this.accountpatientService.currentPatient()?.name
      } ,
      error: error => this.toastr.error(error.error)
    }
    )
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.navname='fixed-top' ;
    this.name = '';
  }

  logoutpatient() {
    this.accountpatientService.logout();
    this.router.navigateByUrl('/');
    this.navname='fixed-top' ;
    this.name = '';
  }


  logoutdoctor() {
    this.accountdoctorService.logout();
    this.router.navigateByUrl('/');
    this.navname='fixed-top';
    this.name = '';
  }

}
