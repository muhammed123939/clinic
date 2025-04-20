import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from '../_forms/text-input/text-input.component';
import { AccountService } from '../_services/account.service';
import { GroupService } from '../_services/group.service';
import { StoreService } from '../_services/store.service';

@Component({
  selector: 'app-storeregister',
  standalone: true,
      imports: [ReactiveFormsModule, TextInputComponent, JsonPipe, FormsModule],
  templateUrl: './storeregister.component.html',
  styleUrl: './storeregister.component.css'
})
export class StoreregisterComponent implements OnInit {

  fb = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  toastr = inject(ToastrService);


  constructor(public accountService: AccountService, public storeService: StoreService) { }

  ngOnInit(): void {
    if (this.accountService.currentAdmin()?.cando) {
      this.initializeForm()
    }
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],    
    });
  }

  register() {
    this.storeService.register(this.registerForm.value).subscribe({
      next: _ => {
        this.toastr.success('Store Added successfully');
      }
    })
  }

}
