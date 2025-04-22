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
export class GroupeditComponent implements OnInit {

  @ViewChild('editForm') editForm?: NgForm;
  @HostListener('window:beforeunload', ['event']) notify($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  private toastr = inject(ToastrService);
  selectedgroup?: Group;
  groupid?: number;
  originalGroup?: Group;

  constructor(public groupService: GroupService, public accountservice: AccountService,
    private myroute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    if (this.accountservice.currentAdmin()?.cando) {
      this.groupid = this.myroute.snapshot.params['id'];
      this.loadgroup(this.groupid!);
    }


    else {
      this.toastr.error("you shall not pass")
    }

  }

  loadgroup(groupid: number) {
    this.groupService.getGroupbyid(groupid).subscribe({
      next: (x) => {
        this.selectedgroup = { ...x };
        this.originalGroup = { ...x }; // store original state for comparison
      },
      error: (err) => this.toastr.error(err.error),
    });

  }

  edit() {
    if (!this.hasChanges()) {
      this.toastr.info('No changes to save.');
      return;
    }

    const updatedGroup: Group = {
      id: this.selectedgroup!.id!,
      name: this.selectedgroup!.name!
    };


    this.groupService.updateGroup(updatedGroup as Group).subscribe({
      next: _ => {
        this.toastr.success('Group edited successfully');
        this.editForm?.reset(this.editForm?.value);

        this.originalGroup = { ...updatedGroup }; // refresh original
      },
      error: err => this.toastr.error('Update failed')
    });
  }

  hasChanges(): boolean {
    if (!this.selectedgroup || !this.originalGroup) return false;

    const keys: (keyof Group)[] = ['id', 'name'];

    return keys.some((key) => this.selectedgroup![key] !== this.originalGroup![key]);
  }

}
