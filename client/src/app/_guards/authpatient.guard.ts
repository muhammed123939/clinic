import { CanActivateFn } from '@angular/router';
import { AccountpatientService } from '../_services/accountpatient.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const authpatientGuard: CanActivateFn = (route, state) => {
  const accountpatientService = inject(AccountpatientService);
    const toastr = inject(ToastrService);
  
    if (accountpatientService.currentPatient()) {
      return true;
    }
    
    else {
      toastr.error('you shall not pass');
      return false;
    }
};
