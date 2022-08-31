import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {

  users: User[];
  toggleEdit: boolean[];
  addFormHidden: boolean = true;

  editForm: FormGroup;
  addForm: FormGroup;

  usersLength: number;

  //for pagination
  p: number = 1;

  constructor(private userService: UserService, private formBuilder: FormBuilder, public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe(data => {
      this.users = data;
      this.usersLength = data.length;
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
      password: ["", [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$"), Validators.minLength(8)]],
      permissions: ["", [Validators.required]],
    })

    
  }

  addEditUserForm(userToEdit: User, index: number) {
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
    this.addForm.reset();
  }

  submitUserEdits(userToEdit: User, index: number) {
     //edit index due to pagination
     index += (this.p-1)*10;
    
    //check if edits are valid
    if(this.editForm.invalid) {
      alert("Edit form invalid.")
      this.addEditUserForm(userToEdit, index);
      return;
    }

    //change in frontend
    let newUsername: string = this.editForm.controls['username'].value;
    let newPermissions: string = this.editForm.controls['permissions'].value;
    this.users[index].username = newUsername;
    this.users[index].permissions = newPermissions;
    console.log(index+ " "+newUsername + " " + newPermissions);
    this.userService.editUser(userToEdit, new User(userToEdit.userId, newUsername, undefined, newPermissions)).subscribe(
        editedUser => {
          if(editedUser) {
            console.log(editedUser);
            this.addEditUserForm(userToEdit, index);
            this.editForm.reset();
          }
        },
        err => {
          alert("Username already exists.")
        }
    );

    
  }

  deleteUser(userToDelete: User) {
    console.log("deleting user "+userToDelete.username);
    this.userService.deleteUser(userToDelete.userId); 
    this.users = this.users?.filter((user)=> user != userToDelete)
  }

  addNewUser() {
    //check if add form is valid
    if(this.addForm.invalid) {
      alert("Error in add form. Check inputs.")
      return;
    }
    else {
      console.log("adding new user");
      let userToAdd: User = new User(undefined, this.addForm.controls['username'].value, this.addForm.controls['password'].value, this.addForm.controls['permissions'].value)
      this.userService.registerUser(userToAdd).subscribe(registrationStatus=> {
        if (registrationStatus) {

          this.userService.getUserByUsername(userToAdd.username).subscribe(userAdded => {
            this.users.push(userAdded);
            this.addForm.reset();
            this.toggleAddUserForm();
          });
          
        }
        else {
          alert("Username already exists. Try a different username.")
        }
      });
      
    }
  }
}
