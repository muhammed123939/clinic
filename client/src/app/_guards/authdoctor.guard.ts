import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AccountdoctorService } from '../_services/accountdoctor.service';
import { ToastrService } from 'ngx-toastr';

export const authdoctorGuard: CanActivateFn = (route, state) => {
  const accountdoctorService = inject(AccountdoctorService);
  const toastr = inject(ToastrService);

  if (accountdoctorService.currentDoctor()) {
    return true;
  }
  
  else {
    toastr.error('you shall not pass');
    return false;
  }
};

