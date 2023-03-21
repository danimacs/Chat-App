import {Component, OnInit} from '@angular/core';
import {UsersService} from "../../services/users.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user = this.usersService.getCurrentUserProfile();

  constructor(private usersService: UsersService) {
  }

  ngOnInit() {
  }

}
