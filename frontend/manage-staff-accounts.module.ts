import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageStaffAccountsRoutingModule } from './manage-staff-accounts-routing.module';
import { ModalComponent } from './modal/modal.component';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const ENTRY_COMPONENTS = [
  ModalComponent,
];


@NgModule({
  declarations: [ModalComponent],
  /**
   * Import all Required Modules for Manage-Staff-Accounts
   * 
   */
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ManageStaffAccountsRoutingModule
  ],
  entryComponents: [
    ...ENTRY_COMPONENTS,
  ],
})
export class ManageStaffAccountsModule { }
