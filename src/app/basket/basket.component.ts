import { Component, OnInit, Input} from '@angular/core';
import {DataService} from '../services/data.service';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { BoundDirectivePropertyAst } from '@angular/compiler';

@Component({
  selector: 'app-basket',
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  tripList = [];
  tripsBooked = [];
  show = false;

  constructor(public service: DataService, public authService: AuthService ) {}

  ngOnInit(): void {
    this.getTrips();
  }

  getTrips(): void{
    this.service.getData().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => { 
      this.tripList = data;
      this.getBookedTrips();
    });

  }

  getBookedTrips(){
    for(let key of this.authService.userDetails.trips){
      var exist = false;
      for(let trip of this.tripsBooked){
        if(trip.key === key){
          exist = true;
          trip.number += 1;
          break;
        }
      }
      if(!exist){
        for(let trip of this.tripList){
          if(trip.key === key){
            this.tripsBooked.push({
              key: trip.key,
              country: trip.country,
              price: trip.price,
              number: 1
            });
          }
        }
      }
    }
  }

  totalSum(){
    var sum = 0;
    for(let key of this.authService.userDetails.trips){
      for(let trip of this.tripList){
        if(trip.key === key){
          sum += Number(trip.price);
        }
      }
    }
    return sum;
  }

  buy(){

    for(let trip of this.tripsBooked){
      this.authService.userDetails.bought.push({
        key: trip.key,
        country: trip.country,
        number: trip.number,
        date: new Date()
      })

      var exist = false;
      for(let item of this.authService.userDetails.rating){
        if(item.key == trip.key){
          exist = true;
        }
      }
      if(!exist){
        this.authService.userDetails.rating.push({
          key: trip.key,
          stars: 0
        })
      }
    }

    this.authService.userDetails.trips = [];
    
    this.authService.updateUser(localStorage.getItem('user'),{
      name: this.authService.userDetails.name,
      email: this.authService.userDetails.email,
      role: this.authService.userDetails.role,
      trips: this.authService.userDetails.trips,
      bought: this.authService.userDetails.bought,
      rating: this.authService.userDetails.rating
    })

    this.tripsBooked = [];
  }

  showHistory(){
    this.show = !this.show;
  }

  getTrip(key){
    for(let trip of this.tripList){
      if(trip.key == key){
        return trip;
      }
    }
  }


}
