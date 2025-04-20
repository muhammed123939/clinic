import { Component, inject } from '@angular/core';
import { Store } from '../_models/store';
import { StoreService } from '../_services/store.service';
import { NgIf, NgFor } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

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
      if(this.accountservice.currentAdmin()?.cando)
      {
        this.storeservice.getstores().subscribe(x => {
          this.stores = x;
        });  
      }
  
      else{
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
        this.storeservice.deletestore(store.id);
        this.stores = this.stores.filter(a => a.id !== store.id);
      }
  
}

