import { Component, OnInit } from '@angular/core';
import { Token } from "../core/models/token.model";
import { UserService } from "../core/services/user.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  session: Token | null;

  constructor(private userService: UserService) {
    this.session = this.userService.getSession();
  }

  ngOnInit(): void {
    this.userService.userLoggedIn.subscribe({
      next: (): void => {
        this.session = this.userService.getSession();
      }
    });
  }

  logout() {
    this.userService.logout();
  }
}
