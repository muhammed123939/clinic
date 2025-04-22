import { Component, OnInit } from '@angular/core';
import { DoctormemberService } from '../_services/doctormember.service';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { Doctormember } from '../_models/doctormember';
import { NgFor, NgIf } from '@angular/common';
import { Fields } from '../_models/fields';
import { Adminaddeddoctor } from '../_models/adminaddeddoctor';
import { Adminmember } from '../_models/adminmember';
import { Photo } from '../_models/photo';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './doctor-list.component.html',
  styleUrl: './doctor-list.component.css'
})
export class DoctorListComponent implements OnInit {
  doctors: Array<Doctormember> = [];
  fields: Array<Fields> = [];
  adminadded: Array<Adminaddeddoctor> = [];
  photos: Array<Photo> = [];
  constructor(public accountservice: AccountService, private router: Router, private doctormemberService: DoctormemberService) {
  }

  ngOnInit(): void {
    this.doctormemberService.getphotos().subscribe(x => {
      this.photos = x;
    });
    this.doctormemberService.getMembers().subscribe(x => {
      this.doctors = x;
    });

    this.doctormemberService.getfields().subscribe(x => {
      this.fields = x;
    });
  
    this.doctormemberService.getadmins().subscribe(x => {
      this.adminadded = x;
    });
  };

  edititem(doctor: Doctormember) {

    this.router.navigateByUrl(`editdoctor/${doctor.id}`);

  }
  
  signupDoctor(){
    this.router.navigateByUrl("/doctorregister"); 
  }

  
  deleteitem(doctor: Doctormember) {
      Swal.fire({
        title: 'Are you sure?',
        text: `You are about to delete ${doctor.name}. This action cannot be undone.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
          this.doctormemberService.deleteadmin(doctor.id).subscribe(() => {
            this.doctors = this.doctors.filter(a => a.id !== doctor.id); 
            Swal.fire('Deleted!', `${doctor.name} has been deleted.`, 'success');
          });
        }
      });
    }
}
