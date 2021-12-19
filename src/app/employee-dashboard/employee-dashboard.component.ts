import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../shared/api.service';
import { EmployeeModel } from './employee-model';
import {MessageService} from 'primeng/api';
import { FormArray, FormControl } from '@angular/forms';

@Component({
  selector: 'app-employee-dashboard',
  templateUrl: './employee-dashboard.component.html',
  styleUrls: ['./employee-dashboard.component.css'],
  providers: [MessageService]
})
export class EmployeeDashboardComponent implements OnInit {


  contactname:any
  hideAdd:boolean=false;
  hideUpdate:boolean=true;
  formvalue !:FormGroup;
  employeeData: EmployeeModel[] = [];
  employeeDataBackup: EmployeeModel[] = [];
  viewcontactdata:any;
  EmployeemodelObj:EmployeeModel = new EmployeeModel()
  userForm:any;
  formView: any;
  searchValue: string = ""
  
  constructor(private formbuild:FormBuilder , private _api:ApiService,private messageService: MessageService) { }

  showSuccess() {
    
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
}

  ngOnInit(): void {
    this.buildForm();
    this.addUser();
    this.formvalue=this.formbuild.group({

      firstName:['', Validators.required],
      lastName:['',Validators.required],
      email:['',Validators.required],
      mobile:['',Validators.required],
      DOB:['',Validators.required],
      i:[''],
      address:['',Validators.required]

    
    
  })


    this.getEmployeeData();

  }
  showAdd()
  {
    this.hideAdd=false;
  }

  postEmployeeDetails()
  {
    debugger
    this.EmployeemodelObj.firstName = this.formvalue.value.firstName;
    this.EmployeemodelObj.lastName = this.formvalue.value.lastName;
    this.EmployeemodelObj.email = this.formvalue.value.email;
    this.EmployeemodelObj.mobile = this.formvalue.value.mobile;
    this.EmployeemodelObj.i = this.userForm.value.users;
    this.EmployeemodelObj.DOB = this.formvalue.value.DOB;
    this.EmployeemodelObj.address = this.formvalue.value.address;

    this._api.postEmployee(this.EmployeemodelObj).subscribe(res=>{
      
      this.showSuccess();
      this.formvalue.reset();
    },err=>
    {
      alert("somthing went wrong");
    })
  }

  getEmployeeData()
  {
    this._api.getEmployee().subscribe(res=>{
       this.employeeData=res;  
       this.employeeDataBackup = res;
       console.log(res);     
    })
  }
  deleteEmployeeData(empdata:any)
  {
 
    this._api.deleteEmployee(empdata.id).subscribe(res=>
      {
        alert("Contact get deleted");
      })
  }
  

  editEmployeeData(row:any)
  {
    this.hideAdd = true; 
    this.hideUpdate=false;
    this.EmployeemodelObj.id=row.id;
    this.formvalue.controls['firstName'].setValue(row.firstName);
    this.formvalue.controls['lastName'].setValue(row.lastName);
    this.formvalue.controls['email'].setValue(row.email);
    this.formvalue.controls['mobile'].setValue(row.mobile);
    this.formvalue.controls['DOB'].setValue(row.DOB);
    this.formvalue.controls['address'].setValue(row.address);
    this.userForm.controls['i'].setValue(row.users);
  }
  showEmployeeData(row:any){
    this.hideAdd = true; 
    this.hideUpdate=false;
    this.EmployeemodelObj.id=row.id;
    this.formvalue.controls['firstName'].setValue(row.firstName);
    this.formvalue.controls['lastName'].setValue(row.lastName);
    this.formvalue.controls['email'].setValue(row.email);
    this.formvalue.controls['DOB'].setValue(row.DOB);
    this.formvalue.controls['address'].setValue(row.address);
    this.formvalue.controls['mobile'].setValue(row.mobile);
    this.userForm.controls['i'].setValue(row.users);
    console.log("show data",row.firstName)
  }
  UpdateEmployeeDetails()
  {
   
    this.EmployeemodelObj.firstName = this.formvalue.value.firstName;
    this.EmployeemodelObj.lastName = this.formvalue.value.lastName;
    this.EmployeemodelObj.email = this.formvalue.value.email;
    this.EmployeemodelObj.mobile = this.formvalue.value.mobile;
    this.EmployeemodelObj.i = this.userForm.value.users;
    this.EmployeemodelObj.DOB = this.formvalue.value.DOB;
    this.EmployeemodelObj.address = this.formvalue.value.address;
  
  this._api.updateEmployee(this.EmployeemodelObj.id,this.EmployeemodelObj).subscribe(res=>{
     alert("data updated successfully")
    })
    
  }
  buildForm() {
    this.userForm = new FormGroup({
      users: new FormArray([])
    })
  }

  addUser() {
    const add = this.userForm.get('users') as FormArray;
    add.push(new FormControl(''));
  }

  removeUser(i:any) {
    const remove = this.userForm.get('users') as FormArray;
    remove.removeAt(i);
  }
  get emailgetter(){

    return this.formvalue.get('email');
  }
  get mobilegetter(){

    return this.formvalue.get('mobile');
  }
  get firstnamegetter(){

    return this.formvalue.get('firstName');
  }
  get lastnamegetter(){

    return this.formvalue.get('lastName')
  }
  
  get addressgetter(){

    return this.formvalue.get('address')
  }
  searchfunction(event: any)
  {
    console.log(event);
    console.log(this.searchValue);
    this.employeeData = this.employeeData.filter(empData => empData.firstName.includes(this.searchValue)||empData.lastName.includes(this.searchValue)||empData.email.includes(this.searchValue));
    
    if(this.searchValue.length == 0) {
      this.employeeData = this.employeeDataBackup;
    }
    if(event.keycode ==8){

      this.employeeData = this.employeeDataBackup;

    }
  }
}
