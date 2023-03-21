import { Component } from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {Router} from "@angular/router";
import {UsersService} from "./services/users.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  user = this.usersService.getCurrentUserProfile();

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private usersService: UsersService
  ) {
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['']);
    });
  }
}
