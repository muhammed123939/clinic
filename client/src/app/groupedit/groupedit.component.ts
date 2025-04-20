import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Group } from '../_models/group';
import { GroupService } from '../_services/group.service';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../_services/account.service';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-groupedit',
  standalone: true,
  imports: [FormsModule, JsonPipe, NgIf],
  templateUrl: './groupedit.component.html',
  styleUrl: './groupedit.component.css'
})
export class GroupeditComponent implements OnInit{

   @ViewChild('editForm') editForm?: NgForm;
    @HostListener('window:beforeunload', ['event']) notify($event: any) {
      if (this.editForm?.dirty) {
        $event.returnValue = true;
      }
    }
    private toastr = inject(ToastrService);
    selectedgroup?: Group;
    groupid?: number;
  
    constructor(public groupService: GroupService, public accountservice: AccountService,
      private myroute: ActivatedRoute, private router: Router) { }
  
    ngOnInit(): void {
  
      if (this.accountservice.currentAdmin()?.cando) {
        this.groupid = this.myroute.snapshot.params['id'];
        this.loadgroup(this.groupid!);
      }
  
  
      else{
        this.toastr.error("you shall not pass")
        }
     
    }
        edit() {
      this.groupService.updateGroup(this.editForm?.value).subscribe({
        next: _ => {
          this.toastr.success('Group edited successfully');
          this.editForm?.reset(this.editForm?.value);
        }
      })
  
    }
  
    loadgroup(groupid: number) {
      this.groupService.getGroupbyid(groupid).subscribe({
        next: (x) => (this.selectedgroup = x),
        error: (err) => this.toastr.error(err.error),
      });
  
    }
}
