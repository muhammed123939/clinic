import { Routes } from '@angular/router';
import { DoctorregisterComponent } from './doctorregister/doctorregister.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AdminEditComponent } from './admin-edit/admin-edit.component';
import { RegisterComponent } from './register/register.component';
import { AppComponent } from './app.component';
import { authGuard } from './_guards/auth.guard';
import { SlideshowComponent } from './slideshow/slideshow.component';
import { DoctorListComponent } from './doctor-list/doctor-list.component';
import { DoctorEditComponent } from './doctor-edit/doctor-edit.component';
import { authdoctorGuard } from './_guards/authdoctor.guard';
import { PatientregisterComponent } from './patientregister/patientregister.component';
import { PatientlistComponent } from './patientlist/patientlist.component';
import { PatienteditComponent } from './patientedit/patientedit.component';
import { AppointmentsRegisterComponent } from './appointments-register/appointments-register.component';
import { AppointmentsListComponent } from './appointments-list/appointments-list.component';
import { AppointmentsEditComponent } from './appointments-edit/appointments-edit.component';
import { DoctorpatientlistComponent } from './doctorpatientlist/doctorpatientlist.component';
import { DoctorpatienteditComponent } from './doctorpatientedit/doctorpatientedit.component';
import { OrderregisterComponent } from './orderregister/orderregister.component';
import { OrdereditComponent } from './orderedit/orderedit.component';
import { OrderlistComponent } from './orderlist/orderlist.component';
import { GroupregisterComponent } from './groupregister/groupregister.component';
import { GroupeditComponent } from './groupedit/groupedit.component';
import { GrouplistComponent } from './grouplist/grouplist.component';
import { ProductlistComponent } from './productlist/productlist.component';
import { ProducteditComponent } from './productedit/productedit.component';
import { ProductregisterComponent } from './productregister/productregister.component';
import { StorelistComponent } from './storelist/storelist.component';
import { StoreeditComponent } from './storeedit/storeedit.component';
import { StoreregisterComponent } from './storeregister/storeregister.component';
import { authpatientGuard } from './_guards/authpatient.guard';

export const routes: Routes = [
     { path: '', component: SlideshowComponent },

     {
          path: '',
          runGuardsAndResolvers: 'always',
          canActivate: [authGuard],
          children: [
               { path: 'storelist', component: StorelistComponent },
               { path: 'grouplist', component: GrouplistComponent },
               { path: 'productlist', component: ProductlistComponent },
               { path: 'doctorlist', component: DoctorListComponent },
               { path: 'Adminlist', component: AdminListComponent },
               { path: 'patientlist', component: PatientlistComponent },
               { path: 'Orderlist', component: OrderlistComponent },
               { path: 'AppointmentList', component: AppointmentsListComponent },
               
               { path: 'editproduct/:id', component: ProducteditComponent },
               { path: 'editGroup/:id', component: GroupeditComponent },
               { path: 'editStore/:id', component: StoreeditComponent },
               { path: 'editadmin/:id', component: AdminEditComponent },
               { path: 'editdoctor/:id', component: DoctorEditComponent } ,
               { path: 'editorder/:id', component: OrdereditComponent } ,
               { path: 'editappointment/:id', component: AppointmentsEditComponent } ,
               { path: 'editpatient/:id', component: PatienteditComponent } ,

               { path: 'productregister', component: ProductregisterComponent },
               { path: 'storeregister', component: StoreregisterComponent },
               { path: 'patientregister', component: PatientregisterComponent },
               { path: 'GroupRegister', component: GroupregisterComponent },
               { path: 'doctorregister', component: DoctorregisterComponent },
               { path: 'AppointmentRegister', component: AppointmentsRegisterComponent },
               { path: 'OrderRegister', component: OrderregisterComponent },
               { path: 'AdminRegister', component: RegisterComponent },
          ]
     },

     {
          path: '',
          runGuardsAndResolvers: 'always',
          canActivate: [authdoctorGuard],
          children: [
               { path: 'editdoctor', component: DoctorEditComponent },
               { path: 'doctorpatientlist', component: DoctorpatientlistComponent } ,
               { path: 'doctorpatientedit/:id', component: DoctorpatienteditComponent } 
          ]
     }
     ,

     {
          path: '',
          runGuardsAndResolvers: 'always',
          canActivate: [authpatientGuard],
          children: [
               { path: 'editpatient', component: PatienteditComponent } ,
               { path: 'patientappointmentlist', component: DoctorpatientlistComponent } ,
               { path: 'patientappointmentedit/:id', component: DoctorpatienteditComponent } 
          ]

     }

,
     { path: '**', component: AppComponent, pathMatch: 'full' }];
