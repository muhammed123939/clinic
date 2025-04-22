import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { JsonPipe, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from '../_models/product';
import { AccountService } from '../_services/account.service';
import { Store } from '../_models/store';
import { Group } from '../_models/group';

@Component({
  selector: 'app-productedit',
  standalone: true,
  imports: [FormsModule, JsonPipe, NgIf],
  templateUrl: './productedit.component.html',
  styleUrl: './productedit.component.css'
})
export class ProducteditComponent {

  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  private toastr = inject(ToastrService);
  selectedproduct?: Product;
  productid?: number;
  originalProduct?: Product;

  stores: Array<Store> = [];
  groups: Array<Group> = [];

  constructor(public productservice: ProductService, public accountservice: AccountService,
    private myroute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    if (this.accountservice.currentAdmin()?.cando) {
      this.productid = this.myroute.snapshot.params['id'];
      this.loadproduct(this.productid!);
      this.productservice.getStores().subscribe(x => {
        this.stores = x;
      });
      this.productservice.getGroups().subscribe(x => {
        this.groups = x;
      });
    }

    else {
      this.toastr.error("you shall not pass")
    }

  }

  loadproduct(productId: number) {
    this.productservice.getProductbyid(productId).subscribe({
      next: (x) => {
        this.selectedproduct = { ...x };
        this.originalProduct = { ...x }; // store original state for comparison
      },
      error: (err) => this.toastr.error(err.error),
    });
  }

  edit() {
    if (!this.hasChanges()) {
      this.toastr.info('No changes to save.');
      return;
    }

    const updatedProduct: Product = {
      id: this.selectedproduct!.id!,
      name: this.selectedproduct!.name!,
      price: this.selectedproduct!.price!,
      quantity: this.selectedproduct!.quantity!,
      storeId: this.selectedproduct!.storeId!,
      groupId: this.selectedproduct!.groupId!

    };

    this.productservice.updateProduct(updatedProduct as Product).subscribe({
      next: _ => {
        this.toastr.success('Product edited successfully');
        this.editForm?.reset(this.editForm?.value);

        this.originalProduct = { ...updatedProduct }; // refresh original
      },
      error: err => this.toastr.error('Update failed')
    });
  }

  hasChanges(): boolean {
    if (!this.selectedproduct || !this.originalProduct) return false;

    return (
      this.selectedproduct.id !== this.originalProduct.id ||
      this.selectedproduct.name?.trim() !== this.originalProduct.name?.trim() ||
      this.selectedproduct.price !== this.originalProduct.price ||
      this.selectedproduct.quantity !== this.originalProduct.quantity ||
      Number(this.selectedproduct.storeId) !== Number(this.originalProduct.storeId) ||
      Number(this.selectedproduct.groupId) !== Number(this.originalProduct.groupId)
    );
  }
}