import { Pipe, PipeTransform } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  constructor(public authService: AuthService){}

  transform(trips: any[], stars, conditions, pom, ifPrice: boolean, role: string, isLogged: boolean){ 
    
    let result = trips;
    let taken = [];

    for (let i = 0; i < trips.length; i++){
      taken.push(true);
    }

    //sprawdzam czy filtry zostaly wybrane
    let countryFiltr = false;
    let ratingFiltr = false;
    let startDateFiltr = false;
    let endDateFiltr = false;
    let maxFiltr = false;
    let minFiltr = false;

    if( conditions.Date[0] != "" ){ startDateFiltr = true; }
    if( conditions.Date[1] != "" ){ endDateFiltr = true; }
    if( conditions.Price[0] != ""){ minFiltr = true; }
    if( conditions.Price[1] != ""){ maxFiltr = true; }
    

    for (let trip of trips){
      let index = trips.indexOf(trip);
      if (conditions.Destination[index]){
        countryFiltr = true;
      }
    }

    for(let i=0; i < conditions.Rating.length; i++){
      if(conditions.Rating[i]){
        ratingFiltr = true;
      }
    }

    //filtrowanie dla readera i uzytkownika niezalogowanego
    if(!isLogged || role === "reader"){
      var now = new Date();
      for (let trip of trips){
        let index = trips.indexOf(trip);
        let tripStart = new Date(trip.start);
        if (tripStart.getTime() < now.getTime() || (trip.reserved == trip.places && !this.authService.isReserved(trip.key))){
          taken[index] = false;
        }
      }
    }

    //filtrowaine dla vipa
    if(role === "vip"){
      var now = new Date();
      for (let trip of trips){
        let index = trips.indexOf(trip);
        let tripStart = new Date(trip.start);
        if (tripStart.getTime() < now.getTime()){
          taken[index] = false;
        }
      }
    }

    //sprawdzam kraje
    if (countryFiltr){ 
      for (let trip of trips){
        let index = trips.indexOf(trip);
        if (!conditions.Destination[index]){
          taken[index] = false;
        }
      }
    }

    //sprawdzam oceny
    if (ratingFiltr){ 
      for (let trip of trips){
        let index = trips.indexOf(trip);
        let star = stars[index];
        if (!conditions.Rating[star]){
          taken[index] = false;
        }
      }
    }

    //sprawdzam daty
    if (startDateFiltr){ 
      let start = new Date(conditions.Date[0]);
      for (let trip of trips){
        let index = trips.indexOf(trip);
        let tripStart = new Date(trip.start);
        if (tripStart.getTime() < start.getTime()){
          taken[index] = false;
        }
      }
    }

    if (endDateFiltr){ 
      let end = new Date(conditions.Date[1]);
      for (let trip of trips){
        let index = trips.indexOf(trip);
        let tripEnd = new Date(trip.end);
        if (tripEnd.getTime() > end.getTime()){
          taken[index] = false;
        }
      }
    }

    //sprawdzam ceny
    if (minFiltr && ifPrice){
      for (let trip of trips){
        let index = trips.indexOf(trip);
        if (trip.price < conditions.Price[0]){
          taken[index] = false;
        }
      }
    }

    if (maxFiltr  && ifPrice){ 
      for (let trip of trips){
        let index = trips.indexOf(trip);
        if (trip.price > conditions.Price[1]){
          taken[index] = false;
        }
      }
    }

    result = result.filter(trip => {
      let index = trips.indexOf(trip);
      return taken[index] ;
    })

    return result;
  }

}
