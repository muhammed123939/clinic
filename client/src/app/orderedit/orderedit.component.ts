import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { OrderService } from '../_services/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Appointment } from '../_models/appointment';
import { FormsModule, NgForm } from '@angular/forms';
import { JsonPipe, NgIf } from '@angular/common';
import { Order } from '../_models/order';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-orderedit',
  standalone: true,
  imports: [FormsModule, JsonPipe, NgIf],
  templateUrl: './orderedit.component.html',
  styleUrl: './orderedit.component.css'
})
export class OrdereditComponent implements OnInit {

  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  private toastr = inject(ToastrService);
  selectedorder?: Order;
  orderid?: number;

  constructor(public orderService: OrderService, public accountservice: AccountService,
    private myroute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    if (this.accountservice.currentAdmin()?.cando) {
      this.orderid = this.myroute.snapshot.params['id'];
      this.loadorder(this.orderid!);
    }

else{
  this.orderService.authorder(this.myroute.snapshot.params['id']).subscribe((exists) => {
    if (exists) {
      this.orderid = this.myroute.snapshot.params['id'];
      this.loadorder(this.orderid!);
    }
    else{
    this.toastr.error("you shall not pass")
    }
  });

}
  

  }

  edit() {
    this.orderService.updateOrder(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success('order edited successfully');
        this.editForm?.reset(this.editForm?.value);
      }
    })

  }

  loadorder(orderid: number) {
    this.orderService.getorderbyid(orderid).subscribe({
      next: (x) => (this.selectedorder = x), // Assign the fetched patient data
      error: (err) => this.toastr.error(err.error), // Display the error message
    });

  }
}
