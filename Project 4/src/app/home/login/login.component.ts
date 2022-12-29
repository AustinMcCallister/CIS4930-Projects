import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";

import { UserService } from "../../core/services/user.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    userName: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    const userName = this.loginForm.get('userName')?.value;
    const password = this.loginForm.get('password')?.value;
    if (userName && password) {
      this.userService.login(userName, password).subscribe({
        next: (data) => {
          console.log(data);
          this.userService.setSession(data);
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.log(err);
          alert(`Error: ${err.error.message}\nStatus: ${err.error.status}`);
        }
      });
    }
    else {
      alert('All fields are required')
    }
  }
}
