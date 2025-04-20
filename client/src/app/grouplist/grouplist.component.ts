import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { GroupService } from '../_services/group.service';
import { Group } from '../_models/group';
import { ToastrService } from 'ngx-toastr';

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
    if(this.accountservice.currentAdmin()?.cando)
    {
      this.groupservice.getgroups().subscribe(x => {
        this.groups = x;
      });  
    }

    else{
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
      this.groupservice.deleteGroup(group.id);
      this.groups = this.groups.filter(a => a.id !== group.id);
    }
}
