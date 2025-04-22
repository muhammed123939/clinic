import { Component, OnInit } from '@angular/core';
import { Order } from '../_models/order';
import { NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { OrderService } from '../_services/order.service';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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
    if (this.accountservice.currentAdmin()?.cando) {
      this.orderservice.getorders().subscribe(x => {
        this.orders = x;
      });
    }

    else {
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
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete Order whose ID =  ${order.id}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderservice.deleteorder(order.id).subscribe(() => {
          this.orders = this.orders.filter(a => a.id !== order.id);
          Swal.fire('Deleted!', `${order.id} has been deleted.`, 'success');
        });
      }
    });
  }
}
