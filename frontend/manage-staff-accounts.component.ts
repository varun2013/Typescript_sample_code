/*
Import all required components, modules and services

*/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal/modal.component';
import { AdminService } from '../../services/api-callls/admin.service';
import { ToastrService } from 'ngx-toastr';
import { DataServiceService } from '../../services/data-service.service';
import { ISubscription } from "rxjs/Subscription";

@Component({
  selector: 'ngx-manage-staff-accounts',
  templateUrl: './manage-staff-accounts.component.html',
  styleUrls: ['./manage-staff-accounts.component.scss']
})
export class ManageStaffAccountsComponent implements OnInit, OnDestroy {
  /*
      Declare all neccessary Variables
  */
  subscription: ISubscription;
  sendData: any;
  staffList: any = [];
  skip = 0;
  prevDisable = true;
  nextDisable = false;
  limit = 10;
  user: any;
  currentPage: any = 0;
  pagination: any = [];
  count: any;
  totalPages: any;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  roleArray = [{ role: "Super Admin", value: 1 }, { role: "Loading Staff", value: 2 }]

  constructor(private modalService: NgbModal,
    private adminService: AdminService,
    private toastr: ToastrService,
    private dataService: DataServiceService
  ) {
    /*
      Subscribe to sevice that watch when to update staff list like while adding and updating new staff and 
    */
    this.subscription = this.dataService.getUsersListFlag.subscribe(data => {
      if (data == true) {
        this.dataService.sendUserListFlag(false);
        this.getStaffList();
      }
    });
  }

/*
  Page root function and call staff list to display
*/
  ngOnInit() {
    this.getStaffList();
  }

  /*
    Unsubscribe to observable on page destroy 
  */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /*
    Filter list on Enter key pressed if search key added and update staff list  
  */
  keyDownFunction(event) {
    if (event.keyCode == 13) {
      this.getStaffList();
    }
  }

  change() {
    this.getStaffList();
  }

  /*
    API to fetch data of staff list from backend with pagination and filter
  */

  getStaffList() {
    if (this.firstName && this.firstName.trim() == "" && this.lastName && this.lastName.trim() == "" && this.email && this.email.trim() == "" && this.role == "") {
      return;
    }
    this.pagination = [];
    this.totalPages = 0;
    this.sendData = {
      skip: this.skip,
      limit: this.limit
    }

    /*
        check if any search key added 
    */
    if (this.firstName && this.firstName != "") {
      this.sendData.firstName = this.firstName.trim();
    }
    if (this.lastName && this.lastName != "") {
      this.sendData.lastName = this.lastName.trim();
    }
    if (this.email && this.email != "") {
      this.sendData.email = this.email.trim();
    }
    if (this.role && this.role != "") {
      this.sendData.role = this.role;
    }
    this.adminService.getStaffList(this.sendData).subscribe((res: any) => {
      if (res && res.statusCode == 200) {
        /*
            on Success show staff list and implement pagination based on number of Users
        */
        this.staffList = res.data;
        this.count = res.totalCount;
        this.totalPages = Math.ceil(this.count / 10);
        if (this.totalPages > 1) {
          for (let i = 0; i < this.totalPages; i++) {
            this.pagination.push(i);
          }
        }
      } else {
        this.toastr.warning(res.message, "Warning");
      }
    }, error => {
      /*
          On Error Show particular message to User
      */
      this.toastr.error(error.error.message, "Error");
    });
  }

  /*
      Function for Pagination navigation Button
  */
  navigationBtn(event) {
    if (event == 'prev') {
      this.currentPage = 0;
      this.skip = 0;
      this.prevDisable = true;
      this.nextDisable = false;
    }
    else if (event == 'prevone') {
      this.skip = this.skip - 10;
      this.nextDisable = false;
      this.currentPage = this.currentPage - 1;
      if (this.skip == 0) {
        this.currentPage = 0;
        this.prevDisable = true;
      }
    }
    else if (event == 'nextone') {
      this.skip = this.skip + 10;
      this.prevDisable = false;
      this.currentPage = this.currentPage + 1;
      if (this.skip == (this.totalPages - 1) * 10) {
        this.nextDisable = true;
      }
    }
    else if (event == 'next') {
      this.currentPage = this.totalPages - 1;
      this.skip = (this.totalPages - 1) * 10;
      this.prevDisable = false;
      this.nextDisable = true;
    }
    this.getStaffList();
  }

  /*
    On Edit button modal will open and Admin can update prepopulated data of User
  */

  editUser(user) {

    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout', centered: true });
    activeModal.componentInstance.currentUser = user;
  }

  /*  
      On add button modal will open and admin can add new staff account
  */
  addNewItem() {
    const activeModal = this.modalService.open(ModalComponent, { size: 'lg', container: 'nb-layout', centered: true });
  }

  /*
      Function to get user data on delete button and open confirmation modal
  */
  deleteUserData(user) {
    this.user = user;
  }

  /*
      Implemented API to delete user
  */

  deleteUser() {
    this.sendData = {
      userId: this.user._id
    }
    this.adminService.deleteStaffAccount(this.sendData).subscribe((res: any) => {
      if (res && res.statusCode == 200) {
        this.getStaffList();
        this.toastr.success(res.message, "Success")
      } else {
        this.toastr.warning(res.message, "Warning");
      }
    }, error => {
      console.log(error, "erererer")
      this.toastr.error(error.error.message, "Error");
    });
  }

  /*
      Function to open modal
  */

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  /*
      Function to go to specific Page Number in Pagination
  */

  goToPage(i) {
    this.currentPage = i;
    this.skip = i * 10;
    if (this.skip == 0) {
      this.prevDisable = true;
      this.nextDisable = false;
    }
    else if (this.skip == (this.totalPages - 1) * 10) {
      this.prevDisable = false;
      this.nextDisable = true;
    }
    else {
      this.prevDisable = false;
      this.nextDisable = false;
    }
    this.getStaffList();
  }

  /*
    Admin can active/deactivate particular user
  */

  toggleStatus(user, status) {
    this.sendData = {
      userId: user._id,
      active: status
    }
    this.adminService.toggleStatusOfUser(this.sendData).subscribe((res: any) => {
      if (res && res.statusCode == 200) {
        this.getStaffList();
        this.toastr.success(res.message, "Success")
      } else {
        this.toastr.warning(res.message, "Warning");
      }
    }, error => {
      console.log(error, "erererer")
      this.toastr.error(error.error.message, "Error");
    });
  }
}
