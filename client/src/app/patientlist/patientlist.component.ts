import { Component, OnInit } from '@angular/core';
import { Patientmember } from '../_models/patientmember';
import { Router } from '@angular/router';
import { PatientService } from '../_services/patient.service';
import { AccountService } from '../_services/account.service';
import { Adminaddeddoctor } from '../_models/adminaddeddoctor';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-patientlist',
  standalone: true,
  imports: [NgIf, NgFor, FormsModule],
  templateUrl: './patientlist.component.html',
  styleUrl: './patientlist.component.css'
})

export class PatientlistComponent implements OnInit {

  adminadded: Array<Adminaddeddoctor> = [];
  patients: Patientmember[] | null = null;
  searchTerm: string = '';

  constructor(public accountservice: AccountService, private router: Router, private patientmemberservice: PatientService) {
  }

  ngOnInit(): void {

    // this.patientmemberservice.getPatients().subscribe(x => {
    //   this.patients = x;
    // });

    this.patientmemberservice.getadmins().subscribe(x => {
      this.adminadded = x;
    });
  }

  edititem(patient: Patientmember) {
    this.router.navigateByUrl(`editpatient/${patient.id}`);
  }

  signupPatient() {
    this.router.navigateByUrl("/patientregister");
  }


  deleteitem(patient: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${patient.name}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.patientmemberservice.deletepatient(patient.id).subscribe(() => {
          this.patients = this.patients!.filter(a => a.id !== patient.id);
          Swal.fire('Deleted!', `${patient.name} has been deleted.`, 'success');
        });
      }
    });
  }
    
  onSearchChange(): void {
    const term = this.searchTerm.trim();

    if (!term) {
      return;
    }

    this.patientmemberservice.searchPatients(term).subscribe(results => {
      this.patients = results;
    });
  }

}
