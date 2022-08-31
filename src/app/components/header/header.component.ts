import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  username: String;
  constructor(private router: Router) { }

  ngOnInit(): void {
    // sessionStorage.clear();
  }

  ifLoggedIn():boolean {
    if(sessionStorage.getItem("login") === "true") {
      this.username = sessionStorage.getItem("username");
      return true;
    }
    else {
      return false;
    }
  }

  logout() {
    console.log("logout");
    this.router.navigate(["login"]);
    sessionStorage.clear();
  }

}
