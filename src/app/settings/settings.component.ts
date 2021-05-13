import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import User from '../models/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  usersList = []
  constructor(public authService: AuthService) {}

  ngOnInit(): void {
    this.getData();
  }

  getData(){
    this.authService.getUsers().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.usersList = data;
    });
  }

  onSubmit(){
    for(let user of this.usersList){
      this.authService.updateUser(user.key, {
        name: user.name,
        email: user.email,
        role: user.role
      });
    }
  }

}
