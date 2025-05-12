import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { Router } from '@angular/router';
import { JsonPipe, NgFor } from '@angular/common';
import { AccountdoctorService } from '../_services/accountdoctor.service';
import { ToastrService } from 'ngx-toastr';
import { DoctormemberService } from '../_services/doctormember.service';
import { Fields } from '../_models/fields';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctorregister',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, JsonPipe, FormsModule , NgFor],
  templateUrl: './doctorregister.component.html',
  styleUrl: './doctorregister.component.css'
})
export class DoctorregisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  registerForm!: FormGroup;
  fields: Array<Fields> = [];
  toastr = inject(ToastrService);

  constructor(
    public accountService: AccountdoctorService,
    private router: Router,
    public adminaccountService: AccountService,
    public doctormemberService: DoctormemberService
  ) {}

  ngOnInit(): void {
    this.accountService.getfields().subscribe(x => {
      this.fields = x;
    });
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      doctorname: ['', Validators.required],
      adminId: [this.adminaccountService.currentAdmin()?.id, Validators.required],
      fieldId: ['', Validators.required],
      doctorprice: ['', Validators.required],
      doctorpassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('doctorpassword')]],
      dateOfBirth: ['', Validators.required],
      availableDays: this.fb.array([]),  // <-- FormArray
      startTime: [''],
      endTime: ['']
    });

    this.registerForm.controls['doctorpassword'].valueChanges.subscribe(() => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    });
  }

  get availableDays(): FormArray {
    return this.registerForm.get('availableDays') as FormArray;
  }

  onDayCheckboxChange(event: any) {
    const value = +event.target.value;
    const control = this.availableDays;

    if (event.target.checked) {
      control.push(this.fb.control(value));
    } else {
      const index = control.controls.findIndex(x => x.value === value);
      if (index !== -1) control.removeAt(index);
    }
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : { isMatching: true };
    };
  }

  register() {
    if (this.registerForm.invalid) return;
  
    const availableDays = this.registerForm.get('availableDays')?.value;
    const startTime = this.registerForm.get('startTime')?.value;
    const endTime = this.registerForm.get('endTime')?.value;
  
    const isAvailableDaysEmpty = !availableDays || availableDays.length === 0;
    const isStartTimeEmpty = !startTime;
    const isEndTimeEmpty = !endTime;
  
    // Prevent submission if only one or two are filled
    const allEmpty = isAvailableDaysEmpty && isStartTimeEmpty && isEndTimeEmpty;
    const allFilled = !isAvailableDaysEmpty && !isStartTimeEmpty && !isEndTimeEmpty;
  
    if (!allEmpty && !allFilled) {
      this.toastr.error('Please fill all schedule fields or leave all empty');
      return;
    }
  
    this.accountService.register(this.registerForm.value).subscribe({
      next: _ => this.toastr.success('Doctor Added successfully'),
      error: err => this.toastr.error(err.error)
    });
  }
  
}
