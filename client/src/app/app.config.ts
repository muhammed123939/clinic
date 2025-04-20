import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { jwtInterceptor } from './_interceptor/jwt.interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors  } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { loadingInterceptor } from './_interceptor/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations() , 
    provideRouter(routes),
    provideHttpClient(withInterceptors([jwtInterceptor , loadingInterceptor ])) , 
    provideToastr({
      positionClass : 'toast-bottom-right'
    })  , 
    importProvidersFrom(NgxSpinnerModule)
    ]
};