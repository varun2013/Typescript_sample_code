import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageStaffAccountsComponent } from './manage-staff-accounts.component';

const routes: Routes = [ 
  {path:'',redirectTo: 'manage-staff-account', pathMatch:'prefix'},
  {path: 'manage-staff-account', component: ManageStaffAccountsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageStaffAccountsRoutingModule { }
