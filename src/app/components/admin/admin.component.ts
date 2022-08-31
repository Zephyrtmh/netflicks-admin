import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  users: User[];
  toggleEdit: boolean[];
  addFormHidden: boolean = true;

  editForm: FormGroup;
  addForm: FormGroup;

  selected = {
    users: true,
    movies: false,
    actors: false,
    reviews: false,
  };

  constructor(private userService: UserService, private formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      // data.forEach((user) => {
      //   this.users.push(Object.assign(new User(), user));
      // })
      console.log(data);
      console.log(this.users);
      this.users[0].userId
      this.toggleEdit = Array.apply(false, Array(this.users.length as number));
    });

    this.editForm = this.formBuilder.group({
      username: ["", [Validators.email, Validators.required]],
      permissions: ["", [Validators.required]],
    })

    this.addForm = this.formBuilder.group({
      username: ["", [Validators.email, Validators.required]],
      password: ["", [Validators.required]],
      permissions: ["", [Validators.required]],
    })
  
  }

  addEditUserForm(userToEdit: User, index: number) {
    // this.toggleEdit = Array.apply(false, Array(this.users.length as number));
    let indexCurrEditted = this.toggleEdit.findIndex((index) => index==true);

    if(!this.toggleEdit.includes(true)) {
      this.toggleEdit[index] = !this.toggleEdit[index];
      this.editForm.controls['username'].setValue(userToEdit.username);
      this.editForm.controls['permissions'].setValue(userToEdit.permissions);
    }
    else if (index != indexCurrEditted){
      this.toggleEdit[indexCurrEditted] = !this.toggleEdit[indexCurrEditted];
      this.toggleEdit[index] = !this.toggleEdit[index];
      this.editForm.controls['username'].setValue(userToEdit.username);
      this.editForm.controls['permissions'].setValue(userToEdit.permissions);
    }
    else {
      this.toggleEdit[index] = !this.toggleEdit[index];
      this.editForm.controls['username'].setValue(userToEdit.username);
      this.editForm.controls['permissions'].setValue(userToEdit.permissions);
    }
    
  }

  toggleAddUserForm() {
    this.addFormHidden = !this.addFormHidden;
  }

  submitUserEdits(userToEdit: User, index: number) {
    //change in frontend
    let newUsername: string = this.editForm.controls['username'].value;
    let newPermissions: string = this.editForm.controls['permissions'].value;
    this.users[index].username = newUsername;
    this.users[index].permissions = newPermissions;
    console.log(index+ " "+newUsername + " " + newPermissions);
    this.userService.editUser(userToEdit, new User(userToEdit.userId, newUsername, undefined, newPermissions)).subscribe(data=>console.log(data));

    this.addEditUserForm(userToEdit, index);
    this.editForm.controls['username'].setValue("");
    this.editForm.controls['permissions'].setValue("");
  }

  deleteUser(userToDelete: User) {
    console.log("deleting user "+userToDelete.username);
    this.userService.deleteUser(userToDelete.userId);
    this.users = this.users?.filter((user)=> user != userToDelete)
    // this.userService.getUsers().subscribe(data=> console.log(data));
  }

  addNewUser() {
    console.log("adding new user");
    let userToAdd: User = new User(undefined, this.addForm.controls['username'].value, this.addForm.controls['password'].value, this.addForm.controls['permissions'].value)
    this.userService.addUser(userToAdd).subscribe(data=>console.log(data));
    this.addForm.controls['username'].setValue("");
    this.addForm.controls['password'].setValue("");
    this.addForm.controls['permissions'].setValue("");
    this.users.push(userToAdd);
    this.toggleAddUserForm();
  }

  //handles navigation of different management pages
  selectNav(selection: string) {

    //reset selection
    let selectionKeys = Object.keys(this.selected);
    selectionKeys.forEach(value => {
      this.selected[value] = false;
    })
    
    //set selection to turn on border style
    this.selected[selection] = true;
    
  }

}
