import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  incorrectPassword: boolean = false;
  constructor(private formBuilder: FormBuilder, private router: Router, private userService: UserService) {} 

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.email, Validators.required]],
      password: ["", Validators.required],
    })
  }

  onLoginSubmit() {
    if(this.loginForm.invalid) {
      alert("Error with login information. Check login form.")
      return;
    }

    let user: User = new User(undefined, this.loginForm.controls['username'].value, this.loginForm.controls['password'].value, undefined);
    this.userService.loginUser(user).subscribe(authenticationResult => {
      if (authenticationResult['username']) {
        sessionStorage.setItem('login', 'true');
        sessionStorage.setItem('permission', authenticationResult['permissions'] as string);
        sessionStorage.setItem('username', authenticationResult['username'] as string);
        this.router.navigate(['home']);
      }
      else {
        console.log(authenticationResult);
        sessionStorage.setItem('login', 'false');
        this.incorrectPassword = true;
      }
    });    
  }

}
