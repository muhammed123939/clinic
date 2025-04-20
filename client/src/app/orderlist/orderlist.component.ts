import { Component, OnInit } from '@angular/core';
import { Order } from '../_models/order';
import { NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../_services/order.service';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orderlist',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './orderlist.component.html',
  styleUrl: './orderlist.component.css'
})
export class OrderlistComponent implements OnInit {
  orders: Array<Order> = [];

  constructor(public accountservice: AccountService, private router: Router, private orderservice: OrderService) {
  }

  ngOnInit(): void {
    if(this.accountservice.currentAdmin()?.cando)
    {
      this.orderservice.getorders().subscribe(x => {
        this.orders = x;
      });  
    }

    else{
      this.orderservice.getorders2(this.accountservice.currentAdmin()?.id!).subscribe(x => {
        this.orders = x;
      }); 

    }
  }
    signup() {
      this.router.navigateByUrl("/OrderRegister");
    }
  
    edititem(order: Order) {
      this.router.navigateByUrl(`editorder/${order.id}`);
    }
  
    deleteitem(order: Order) {
      this.orderservice.deleteorder(order.id);
      this.orders = this.orders.filter(a => a.id !== order.id);
    }
  
}
