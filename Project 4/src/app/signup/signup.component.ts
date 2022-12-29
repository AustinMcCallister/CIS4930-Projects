import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

import { UserService } from "../core/services/user.service";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  registrationForm = new FormGroup({
    userName: new FormControl('', [Validators.required]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  createUser() {
    if (this.registrationForm.valid) {
      const userName = this.registrationForm.get('userName')?.value;
      const firstName = this.registrationForm.get('firstName')?.value;
      const lastName = this.registrationForm.get('lastName')?.value;
      const email = this.registrationForm.get('email')?.value;
      const password = this.registrationForm.get('password')?.value;
      if (userName && firstName && lastName && email && password) {
        this.userService.createUser(userName, firstName, lastName, email, password).subscribe({
          next: (): void => {
            this.router.navigate(['/']);
            console.log('User Created');
          },
          error: (err): void => {
            console.log(err);
            this.registrationForm.controls['userName'].setErrors({'incorrect': true});
            alert(`Error: ${err.error.message}\nStatus: ${err.error.status}`);
          }
        });
      }
    }
    else {
      alert('All fields are required');
    }
  }
}
