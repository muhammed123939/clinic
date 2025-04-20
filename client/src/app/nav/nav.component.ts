import { Component, Inject, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TitleCasePipe } from '@angular/common';
import { AccountdoctorService } from '../_services/accountdoctor.service';
import { AccountpatientService } from '../_services/accountpatient.service';

//added
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive, TitleCasePipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})

export class NavComponent {
  accountService = inject(AccountService);
  accountdoctorService = inject(AccountdoctorService);
  accountpatientService = inject(AccountpatientService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  model: any = {};
  modeldoctor: any = {};
  modelpatient: any = {};

  login() {
    this.accountService.login(this.model).subscribe({
      next: _ => {
        this.router.navigateByUrl('/')
      } ,
      error: error => this.toastr.error(error.error)
    }
    )
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
  

  loginpatient() {
    this.accountpatientService.login(this.modelpatient).subscribe({
      next: _ => {
        this.router.navigateByUrl('/')
      } ,
      error: error => this.toastr.error(error.error)
    }
    )
  }

  logoutpatient() {
    this.accountpatientService.logout();
    this.router.navigateByUrl('/');
  }


  logindoctor() {
    this.accountdoctorService.login(this.modeldoctor).subscribe({
      next: _ => {
        this.router.navigateByUrl('/')
      } ,
      error: error => this.toastr.error(error.error)
    }
    )
  }

  logoutdoctor() {
    this.accountdoctorService.logout();
    this.router.navigateByUrl('/');
  }

}
