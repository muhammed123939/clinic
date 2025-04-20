import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { Router } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { AccountdoctorService } from '../_services/accountdoctor.service';
import { ToastrService } from 'ngx-toastr';
import { DoctormemberService } from '../_services/doctormember.service';
import { Fields } from '../_models/fields';
import { FormsModule, NgForm } from '@angular/forms';
@Component({
  selector: 'app-doctorregister',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, JsonPipe, FormsModule],
  templateUrl: './doctorregister.component.html',
  styleUrl: './doctorregister.component.css'
})
export class DoctorregisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  toastr = inject(ToastrService);
  fields: Array<Fields> = [];

  constructor(public accountService: AccountdoctorService, private router: Router,
    public adminaccountService: AccountService, public doctormemberService: DoctormemberService) { }

  ngOnInit(): void {

    this.accountService.getfields().subscribe(x => {
      this.fields = x;
    });
    this.initializeForm()
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      doctorname: ['', Validators.required],
      adminId : [this.adminaccountService.currentAdmin()?.id , Validators.required],
      fieldId : ['' , Validators.required],
      doctorprice : ['' , Validators.required],
      doctorpassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('doctorpassword')]],
      dateOfBirth : ['', Validators.required]
    });//next part to avoid changes in password text
    this.registerForm.controls['doctorpassword'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  }
  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { isMatching: true }
    }
  }
  register() {
    this.accountService.register(this.registerForm.value).subscribe({
      next:_ => this.toastr.success('Doctor Added successfully') , 
      error: (err) => this.toastr.error(err.error), // Display the error message
    });
  }

}
