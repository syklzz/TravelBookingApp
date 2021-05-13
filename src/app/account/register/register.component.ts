import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import  User  from '../../models/user';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  name: string;

  constructor(public authService: AuthService) {}

  ngOnInit(): void {
  }

  signup() {
    this.authService.signup(this.email, this.password);
    var user = new User();
    user.name = this.name;
    user.email = this.email;
    user.role = "reader";
    user.trips = [];
    user.bought = [];
    user.rating = [];

    this.authService.addUser(user);
    this.email = this.password = this.name = '';
  }

}
