import { Component, inject } from '@angular/core';
import { Store } from '../_models/store';
import { Group } from '../_models/group';
import { ProductService } from '../_services/product.service';
import { StoreService } from '../_services/store.service';
import { GroupService } from '../_services/group.service';
import { AccountService } from '../_services/account.service';
import { JsonPipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TextInputComponent } from '../_forms/text-input/text-input.component';

@Component({
  selector: 'app-productregister',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, JsonPipe, FormsModule],
  templateUrl: './productregister.component.html',
  styleUrl: './productregister.component.css'
})
export class ProductregisterComponent {

  fb = inject(FormBuilder);
  registerForm: FormGroup = new FormGroup({});
  validationErrors: string[] | undefined;
  toastr = inject(ToastrService);
  stores: Array<Store> = [];
  groups: Array<Group> = [];

  constructor(public StoreService: StoreService, public accountService: AccountService,
    public groupService: GroupService, public productService: ProductService) { }

  ngOnInit(): void {
    if (this.accountService.currentAdmin()?.cando) {
      this.StoreService.getstores().subscribe(x => {
        this.stores = x;
      });

      this.groupService.getgroups().subscribe(x => {
        this.groups = x;
      });

      this.initializeForm()
    }
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      storeId: ['', Validators.required],
      quantity: ['', Validators.required],
      groupId: ['', Validators.required],
    });
  }

  register() {
    this.productService.register(this.registerForm.value).subscribe({
      next: _ => {
        this.toastr.success('Product Added successfully');
      }
    })
  }

}
