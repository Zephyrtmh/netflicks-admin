import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup
  constructor(private formBuilder: FormBuilder, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$"), Validators.minLength(8)]],
      passwordRepeat: ["", [Validators.required]]
    })
  }

  onRegisterSubmit() {
    if (this.registerForm.invalid) {
      alert("Register form invalid. Check form inputs.")
      return;
    }

    if (this.checkPassword()) {
      console.log("registering")
      let userToRegister: User = new User(null, this.registerForm.controls['username'].value, this.registerForm.controls['password'].value, "user");
      this.userService.registerUser(userToRegister).subscribe(registrationStatus => {
        //check for error
        if(!registrationStatus) {
          alert("Username already exists. Try a different username.");
        }
        else {
          this.registerForm.reset();
          this.router.navigate(['login']);
        }
        
      });
      
    }
    else {
      alert("password mismatch. Check password.");
    }
  }

  public checkPassword() {
    let repeatedPassword = this.registerForm.value['passwordRepeat'];
    let password = this.registerForm.value['password'];
    if (repeatedPassword === password) {
      return true;
    }
    else {
      return false;
    }
  }

}
