import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DataService} from '../services/data.service'
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-trips-details',
  templateUrl: './trips-details.component.html',
  styleUrls: ['./trips-details.component.css']
})
export class TripsDetailsComponent implements OnInit {

  id: string;
  tripList: any;
  trip: any;
  stars = 0;
  rated = false;
  bought = false;

  constructor(private actRoute: ActivatedRoute, public service: DataService, public authService: AuthService) {
    this.id = this.actRoute.snapshot.params.id;
    this.authService.setUserData();
    var x = this.authService.userDetails;
  }

  ngOnInit(): void {
    this.getTrips();
    this.getStar();
  }

  getStar(){
    this.authService.usersRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
        var tmp;
        for(let i = 0; i < data.length; i++){
          if(data[i].key.includes(localStorage.getItem('user'))){
            tmp = data[i].rating;
          }
        }
        for(let trip of tmp){
          if(trip.key == this.id && trip.stars != 0){
            this.stars = trip.stars;
          }
        }
    });
  }

  rate(){
    if(!this.authService.isRated(this.id) && this.authService.isBought(this.id)){
      this.rated = true;
      
      for(let trip of this.authService.userDetails.rating){
        if(trip.key == this.id){
          var index  = this.authService.userDetails.rating.indexOf(trip);
          this.authService.userDetails.rating[index].stars = this.stars;
        }
      }

      this.authService.updateUser(localStorage.getItem('user'),{
        name: this.authService.userDetails.name,
        email: this.authService.userDetails.email,
        role: this.authService.userDetails.role,
        trips: this.authService.userDetails.trips,
        bought: this.authService.userDetails.bought,
        rating: this.authService.userDetails.rating
      })

      var newRating = {
        stars: this.trip.rating.stars + this.stars,
        votes: this.trip.rating.votes + 1
      }

      this.service.updateData(this.id, {
        name: this.trip.name,
        country: this.trip.country,
        start: this.trip.start,
        end: this.trip.end,
        price: this.trip.price,
        places: this.trip.places,
        description: this.trip.description,
        image: this.trip.image,
        reserved: this.trip.reserved,
        rating: newRating
      });
    }
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
      for(let trip of data){
        if(trip.key == this.id){
          this.trip = trip;
        }
      }
    });
  }

  getIndex(trip){
    return this.tripList.indexOf(trip);
  }


  addReservation(i: number){

    this.tripList[i].reserved += 1;
    this.service.updateData(this.tripList[i].key, {
      name: this.tripList[i].name,
      country: this.tripList[i].country,
      start: this.tripList[i].start,
      end: this.tripList[i].end,
      price: this.tripList[i].price,
      places: this.tripList[i].places,
      description: this.tripList[i].description,
      image: this.tripList[i].image,
      reserved: this.tripList[i].reserved
    });

    this.authService.userDetails.trips.push(this.tripList[i].key);
    this.authService.updateUser(localStorage.getItem('user'),{
      name: this.authService.userDetails.name,
      email: this.authService.userDetails.email,
      role: this.authService.userDetails.role,
      trips: this.authService.userDetails.trips
    })


  }

  removeReservation(i: number){

    this.tripList[i].reserved -= 1;
    this.service.updateData(this.tripList[i].key, {
      name: this.tripList[i].name,
      country: this.tripList[i].country,
      start: this.tripList[i].start,
      end: this.tripList[i].end,
      price: this.tripList[i].price,
      places: this.tripList[i].places,
      description: this.tripList[i].description,
      image: this.tripList[i].image,
      reserved: this.tripList[i].reserved
    });

    var index = -1;
    for(let j=0; j < this.authService.userDetails.trips.length; j++){
      if(this.authService.userDetails.trips[j] === this.tripList[i].key){
        index = j;
      }
    }
    this.authService.userDetails.trips.splice(index, 1);

    this.authService.updateUser(localStorage.getItem('user'),{
      name: this.authService.userDetails.name,
      email: this.authService.userDetails.email,
      role: this.authService.userDetails.role,
      trips: this.authService.userDetails.trips
    })

  }

}
