import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { GroupService } from '../_services/group.service';
import { Group } from '../_models/group';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-grouplist',
  standalone: true,
  imports: [NgIf, NgFor, ReactiveFormsModule],
  templateUrl: './grouplist.component.html',
  styleUrl: './grouplist.component.css'
})
export class GrouplistComponent {
  groups: Array<Group> = [];
  private toastr = inject(ToastrService);

  constructor(public accountservice: AccountService, private router: Router, private groupservice: GroupService) {
  }

  ngOnInit(): void {
    if (this.accountservice.currentAdmin()?.cando) {
      this.groupservice.getgroups().subscribe(x => {
        this.groups = x;
      });
    }

    else {
      this.toastr.error("you shall not pass")
    }
  }

  signup() {
    this.router.navigateByUrl("/GroupRegister");
  }

  edititem(group: Group) {
    this.router.navigateByUrl(`editGroup/${group.id}`);
  }

  deleteitem(group: Group) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete Group whose ID =  ${group.id}. This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.groupservice.deleteGroup(group.id).subscribe(() => {
          this.groups = this.groups.filter(a => a.id !== group.id);
          Swal.fire('Deleted!', `${group.id} has been deleted.`, 'success');
        });
      }
    });
  }

}
