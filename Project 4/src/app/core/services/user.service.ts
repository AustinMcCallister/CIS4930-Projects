import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import jwt_decode from "jwt-decode";

import { environment } from "../../../environments/environment";
import { JWT } from "../models/jwt.model";
import { Token } from "../models/token.model";
import { User } from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  @Output() userLoggedIn = new EventEmitter<boolean>();
  session: Token | null;

  constructor(private httpClient: HttpClient) {
    const token = localStorage.getItem('token');
    this.session = token ? JSON.parse(token) : null;
    if (this.session) {
      if ((jwt_decode(JSON.stringify(this.session)) as JWT).exp.toString() < ((Date.now() / 1000).toString())) {
        this.logout();
      }
      console.log((jwt_decode(JSON.stringify(this.session)) as JWT).exp.toString());
      console.log((Date.now() / 1000).toString());
    }
  }

  getSession() {
    return this.session;
  }

  setSession(token: Token) {
    this.session = token;
    localStorage.setItem('token',JSON.stringify(token));
    this.userLoggedIn.emit(true);
  }

  getUser(): string {
    return this.session ? (jwt_decode(JSON.stringify(this.session)) as JWT).UserData.userId : '';
  }

  createUser(userId: string, firstName: string, lastName: string, emailAddress: string, password: string) {
    return this.httpClient.post<User>(`${environment.serverEndpoint}/Users/`, new User(userId, firstName, lastName, emailAddress, password));
  }

  login(userId: string, password: string) {
    return this.httpClient.get<Token>(`${environment.serverEndpoint}/Users/${userId}/${password}`);
  }

  logout() {
    this.session = null;
    localStorage.removeItem('token');
    this.userLoggedIn.emit(false);
  }
}
