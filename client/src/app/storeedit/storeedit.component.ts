import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { StoreService } from '../_services/store.service';
import { Store } from '../_models/store';
import { JsonPipe, NgIf } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';

@Component({
  selector: 'app-storeedit',
  standalone: true,
  imports: [FormsModule, JsonPipe, NgIf],
  templateUrl: './storeedit.component.html',
  styleUrl: './storeedit.component.css'
})
export class StoreeditComponent implements OnInit {

  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  private toastr = inject(ToastrService);
  selectedstore?: Store;
  storeid?: number;
  originalStore?: Store;

  constructor(public storeService: StoreService, public accountservice: AccountService,
    private myroute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    if (this.accountservice.currentAdmin()?.cando) {
      this.storeid = this.myroute.snapshot.params['id'];
      this.loadstore(this.storeid!);
    }

    else {
      this.toastr.error("you shall not pass")
    }

  }

  loadstore(storeid: number) {
    this.storeService.getstorebyid(storeid).subscribe({
      next: (x) => {
        this.selectedstore = { ...x };
        this.originalStore = { ...x }; // store original state for comparison
      },
      error: (err) => this.toastr.error(err.error),
    });

  }

  edit() {
    if (!this.hasChanges()) {
      this.toastr.info('No changes to save.');
      return;
    }

    const updatedStore: Store = {
      id: this.selectedstore!.id!,
      name: this.selectedstore!.name!
    };

    this.storeService.updatestore(updatedStore as Store).subscribe({
      next: _ => {
        this.toastr.success('Store edited successfully');
        this.editForm?.reset(this.editForm?.value);

        this.originalStore = { ...updatedStore }; // refresh original
      },
      error: err => this.toastr.error('Update failed')
    });
  }

  hasChanges(): boolean {
    if (!this.selectedstore || !this.originalStore) return false;

    const keys: (keyof Store)[] = ['id', 'name'];

    return keys.some((key) => this.selectedstore![key] !== this.originalStore![key]);
  }

}
