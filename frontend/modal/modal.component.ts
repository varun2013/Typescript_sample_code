import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../../services/api-callls/admin.service';
import { ToastrService } from 'ngx-toastr';
import { DataServiceService } from '../../../services/data-service.service';

@Component({
  selector: 'ngx-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  modalHeader:string;
   addUserForm: FormGroup;
   sendData: any;
  currentUser:any;
  title: any;
  isAdd:boolean;

  constructor(private activeModal: NgbActiveModal, 
    private fb: FormBuilder,
    private adminService: AdminService,
    private toastr: ToastrService,
    private dataService: DataServiceService
    ) { }

  ngOnInit(){
    this.createForm();
    if(this.currentUser){
      this.isAdd = false;
      this.title = "Update Staff Account";
      this.addUserForm.controls.fname.setValue(this.currentUser.firstName);
      this.addUserForm.controls.lname.setValue(this.currentUser.lastName);
      this.addUserForm.controls.email.setValue(this.currentUser.email);
      this.addUserForm.controls.role.setValue(this.currentUser.role);
      this.addUserForm.controls.email.disable();
    }
    else{
      this.title = "Add Staff Account";
      this.isAdd = true;
    }
  }

  createForm() {

    this.addUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9][a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}$')]],
      fname: ['', [Validators.required, Validators.pattern('^[ A-Za-z0-9_@./#&+-]*$')]],
      lname: ['', [Validators.required, Validators.pattern('^[ A-Za-z0-9_@./#&+-]*$')]],
      role: ['', [Validators.required]]
    })
  }

  closeModal() {
    this.activeModal.close();
  }

  onSubmit(){
    this.sendData={
      firstName: this.addUserForm.controls.fname.value,
      lastName: this.addUserForm.controls.lname.value,
      email: this.addUserForm.controls.email.value,
      role: this.addUserForm.controls.role.value,
    }

    this.adminService.addStaffAccount(this.sendData).subscribe((res: any) => {
      if (res && res.statusCode == 200) {
        this.dataService.sendUserListFlag(true);
      this.toastr.success(res.message,"Success");    
      } else {
        this.toastr.warning(res.message,"Warning");
      }
    }, error => {
      console.log(error,"erererer")
      this.toastr.error(error.error.message,"Error");
    });
  }

  onUpdate(){
    this.sendData = {
      userId: this.currentUser._id,
      firstName: this.addUserForm.controls.fname.value,
      lastName: this.addUserForm.controls.lname.value,
      role: this.addUserForm.controls.role.value,
    }

    this.adminService.updateStaffAccount(this.sendData).subscribe((res: any) => {
      if (res && res.statusCode == 200) {
        this.dataService.sendUserListFlag(true);
        this.toastr.success(res.message, "Success");
      } else {
        this.toastr.warning(res.message, "Warning");
      }
    }, error => {
      console.log(error, "erererer")
      this.toastr.error(error.error.message, "Error");
    });
  }
}
