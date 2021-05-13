import { Component, OnInit } from '@angular/core';
import {DataService} from '../services/data.service'
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-trips',
  templateUrl: './trips.component.html',
  styleUrls: ['./trips.component.css']
})
export class TripsComponent implements OnInit {

  tripList = [];
  edition = false;
  stars = [];

  constructor(public service: DataService, public authService: AuthService ) {
  }

  ngOnInit(): void {
    this.getTrips();
  }

  editionMode(){
    this.edition = !this.edition;
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
      for(let trip of this.tripList){
        if(trip.rating.votes == 0){
          this.stars.push(0);
        }
        else{
          this.stars.push( trip.rating.stars/trip.rating.votes);
        }
      }
    });

  }

  maxPrice(){
    var maxPriceIndex = 0;
    var maxPriceValue = this.tripList[0].price;
    for (let i = 0; i < this.tripList.length; i++){
      if (Number(this.tripList[i].price) > Number(maxPriceValue)){
        maxPriceValue = this.tripList[i].price;
        maxPriceIndex = i;
      }
    }
    return maxPriceIndex;
  }

  minPrice(){
    var minPriceIndex = 0;
    var minPriceValue = this.tripList[0].price;
    for (let i = 0; i < this.tripList.length; i++){
      if (Number(this.tripList[i].price) < Number(minPriceValue)){
        minPriceValue = this.tripList[i].price;
        minPriceIndex = i;
      }
    }
    return minPriceIndex;
  }

  getBorder(i: number){
    if (i == this.maxPrice()){
      return {'border' : '2px solid rgb(201, 137, 137)'};
    }
    else if (i == this.minPrice()){
      return {'border' : '2px solid rgb(158, 224, 158)'};
    }
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



  addTrip(trip){ 
   this.Conditions.Destination.push(false); 
   this.pom += 1;
  }

  removeTrip(trip){ 
    let index = this.tripList.indexOf(trip); 
    this.service.removeData(trip.key);

    this.Conditions.Destination.splice(index,1); 
    this.pom += 1;
  }

  Conditions = {
    'Destination' : [], 
    'Price' : ["", ""],
    'Date' : ["", ""], 
    'Rating' : [false, false, false, false, false, false] 
  };

  pom = 0;
  changeConditions(C){
    this.Conditions = C;
    this.pom += 1;
  }

  getIndex(trip){
    return this.tripList.indexOf(trip);
  }

}
