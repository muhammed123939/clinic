import { Component, inject, OnInit } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from '../_forms/text-input/text-input.component';
import { AccountService } from '../_services/account.service';
import { Store } from '../_models/store';
import { Product } from '../_models/product';

@Component({
  selector: 'app-orderregister',
  standalone: true,
      imports: [ReactiveFormsModule, TextInputComponent, JsonPipe, FormsModule],
  templateUrl: './orderregister.component.html',
  styleUrl: './orderregister.component.css'
})
export class OrderregisterComponent implements OnInit {

  fb = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  toastr = inject(ToastrService);
  products: Array<Product> = [];

  constructor(public accountService: AccountService, public orderService: OrderService) { }

  ngOnInit(): void {
    if (this.accountService.currentAdmin()) {
      
      this.orderService.getProduct(this.accountService.currentAdmin()?.store_Id!).subscribe(x => {
        this.products = x;
      });
     
      this.initializeForm()
    }
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      type: ['', Validators.required],    
      productId: ['', Validators.required],    
      adminId: [this.accountService.currentAdmin()?.id, Validators.required],  
      quantity: ['', Validators.required]
    });
  }

  register() {
  
    this.orderService.register(this.registerForm.value).subscribe({
      next: _ => {
        this.toastr.success('Order Added successfully');
      } , 
      error: (err) => this.toastr.error(err.error)
    })
  }
}
