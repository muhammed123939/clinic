import { Component, inject, OnInit } from '@angular/core';
import { GroupService } from '../_services/group.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { JsonPipe } from '@angular/common';
import { TextInputComponent } from '../_forms/text-input/text-input.component';

@Component({
  selector: 'app-groupregister',
  standalone: true,
    imports: [ReactiveFormsModule, TextInputComponent, JsonPipe, FormsModule],
  templateUrl: './groupregister.component.html',
  styleUrl: './groupregister.component.css'
})
export class GroupregisterComponent implements OnInit {

  fb = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  toastr = inject(ToastrService);


  constructor(public accountService: AccountService, public groupService: GroupService) { }

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
    this.groupService.register(this.registerForm.value).subscribe({
      next: _ => {
        this.toastr.success('Group Added successfully');
      }
    })
  }

}
