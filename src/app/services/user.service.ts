import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl: String = "http://netflicksbackend-env.eba-sgzsyqmb.ap-southeast-1.elasticbeanstalk.com/user";
  
  constructor(private httpClient: HttpClient, private router: Router) { }

  loginUser(user: User) {
    return this.httpClient.post(this.baseUrl+"/login", user)
  }

  registerUser(user: User) {
    console.log("registering")
    return this.httpClient.post(this.baseUrl+"/register", user);
  }

  getUsers() {
    console.log("getting users")
    return this.httpClient.get<User[]>(this.baseUrl+"/get/all");
  }

  getUserByUsername(username: String) {
    return this.httpClient.get<User>(this.baseUrl+"/get/byUsername/"+username);
  }

  editUser(userToEdit: User, newUser) {
    //send put request to change information in database
    let url = this.baseUrl+"/edit/"+userToEdit.userId;
    return this.httpClient.put<User[]>(url, newUser);
  }

  deleteUser(id: number) {
    let url = this.baseUrl+"/delete/"+id;
    this.httpClient.delete<User>(url).subscribe(data=>console.log(data));
  }

  addUser(userToAdd: User) {
    let url = this.baseUrl+"/add";
    return this.httpClient.post<User>(url, userToAdd);
  }

}
