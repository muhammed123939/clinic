import { Component, OnInit } from '@angular/core';
import { Patientmember } from '../_models/patientmember';
import { Router } from '@angular/router';
import { PatientService } from '../_services/patient.service';
import { AccountService } from '../_services/account.service';
import { Adminaddeddoctor } from '../_models/adminaddeddoctor';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  deleteitem(patient: Patientmember) {
    this.patientmemberservice.deletepatient(patient.id);
    this.patients = this.patients!.filter(a => a.id !== patient.id);
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
