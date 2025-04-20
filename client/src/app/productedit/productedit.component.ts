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

  edit() {
    this.productservice.updateProduct(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('Product edited successfully');
        this.editForm?.reset(this.editForm?.value);
      }
    })
  }

  loadproduct(groupid: number) {
    this.productservice.getProductbyid(groupid).subscribe({
      next: (x) => (this.selectedproduct = x),
      error: (err) => this.toastr.error(err.error),
    });
  }
}
