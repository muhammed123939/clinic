import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PatientService } from '../_services/patient.service';
import { AccountService } from '../_services/account.service';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { JsonPipe, NgIf } from '@angular/common';
import { AccountpatientService } from '../_services/accountpatient.service';

@Component({
  selector: 'app-patientregister',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, JsonPipe, FormsModule  , NgIf],
  templateUrl: './patientregister.component.html',
  styleUrl: './patientregister.component.css'
})

export class PatientregisterComponent implements OnInit {
     fb = inject(FormBuilder);
    registerForm: FormGroup = new FormGroup({});
    validationErrors: string[] | undefined;
    toastr = inject(ToastrService);
    
    constructor(public patientservice: PatientService , public patientaccountservice: AccountpatientService , public adminaccountService: AccountService ) { }
  
  ngOnInit(): void {
    this.initializeForm()
  }
  
    initializeForm() {
      this.registerForm = this.fb.group({
        name: ['', Validators.required],
        gender : ['' , Validators.required], 
        mobile: ['', [Validators.required, Validators.maxLength(11)]],
        dateOfBirth : ['' , Validators.required] , 
        adminId : [this.adminaccountService.currentAdmin()?.id , Validators.required] ,
        nationalnumber : ['', [Validators.required , Validators.pattern(/^\d{14}$/) ,  this.simpleNationalIdValidator]]
      });
    }
    
    simpleNationalIdValidator(control: AbstractControl): ValidationErrors | null {
      const value = control.value;
  
      if (!value) return null;
  
      if (!/^\d{14}$/.test(value)) return { invalidFormat: true };
  
      const year = parseInt(value.substring(1, 3), 10);
      const month = parseInt(value.substring(3, 5), 10);
      const day = parseInt(value.substring(5, 7), 10);
      const century = value[0] === '2' ? 1900 : value[0] === '3' ? 2000 : null;
  
      if (!century) return { invalidCentury: true };
  
      const birthDate = new Date(century + year, month - 1, day);
      if (
        birthDate.getFullYear() !== century + year || 
        birthDate.getMonth() !== month - 1 || 
        birthDate.getDate() !== day
      ) {
        return { invalidDate: true };
      }
  
      return null;
    }
    register() {
      this.patientaccountservice.register(this.registerForm.value).subscribe({
        next:_ => this.toastr.success('Patient Added successfully') , 
        error: (err) => this.toastr.error(err.error), // Display the error message
      });
    }
}


