import { Component, inject } from '@angular/core';
import { Store } from '../_models/store';
import { StoreService } from '../_services/store.service';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-storelist',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './storelist.component.html',
  styleUrl: './storelist.component.css'
})

export class StorelistComponent {

  stores: Array<Store> = [];
  private toastr = inject(ToastrService);

  constructor(public accountservice: AccountService, private router: Router, private storeservice: StoreService) {
  }

  ngOnInit(): void {
    if (this.accountservice.currentAdmin()?.cando) {
      this.storeservice.getstores().subscribe(x => {
        this.stores = x;
      });
    }

    else {
      this.toastr.error("you shall not pass")
    }
  }

  signup() {
    this.router.navigateByUrl("/storeregister");
  }

  edititem(store: Store) {
    this.router.navigateByUrl(`editStore/${store.id}`);
  }

  deleteitem(store: Store) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete Store whose ID =  ${store.id}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.storeservice.deletestore(store.id).subscribe(() => {
          this.stores = this.stores.filter(a => a.id !== store.id);
          Swal.fire('Deleted!', `${store.id} has been deleted.`, 'success');
        });
      }
    });
  }
}

