import { Component, inject } from '@angular/core';
import { Product } from '../_models/product';
import { ProductService } from '../_services/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '../_models/store';
import { Group } from '../_models/group';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-productlist',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './productlist.component.html',
  styleUrl: './productlist.component.css'
})
export class ProductlistComponent {
products: Array<Product> = [];
stores: Array<Store> = [];
groups: Array<Group> = [];
private toastr = inject(ToastrService);

  constructor(public accountservice: AccountService, private router: Router, private productservice: ProductService) {
  }

  ngOnInit(): void {
    if(this.accountservice.currentAdmin()?.cando)
    {
      this.productservice.getProducts().subscribe(x => {
        this.products = x;
      });  
      this.productservice.getStores().subscribe(x => {
        this.stores = x;
      });  
      this.productservice.getGroups().subscribe(x => {
        this.groups = x;
      });  
    }

    else{
    this.toastr.error("you shall not pass")
    }
  }

    signup() {
      this.router.navigateByUrl("/productregister");
    }
  
    edititem(product: Product) {
      this.router.navigateByUrl(`editproduct/${product.id}`);
    }

    deleteitem(product: Product) {
        Swal.fire({
          title: 'Are you sure?',
          text: `You are about to delete Product whose ID =  ${product.id}. This action cannot be undone.`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.productservice.deleteProduct(product.id).subscribe(() => {
              this.products = this.products.filter(a => a.id !== product.id);
              Swal.fire('Deleted!', `${product.id} has been deleted.`, 'success');
            });
          }
        });
      }
}
