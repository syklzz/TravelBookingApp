import { Component, Output, EventEmitter} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { datesValidator } from './validation';
import {DataService} from '../services/data.service'
import  Trip  from '../models/trip';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent {

  @Output() newTrip = new EventEmitter();

  constructor(private service: DataService) {}

  myForm = new FormGroup({
    name: new FormControl("", Validators.required),
    country: new FormControl("", Validators.required),
    start: new FormControl("", Validators.required),
    end: new FormControl("", Validators.required),
    price: new FormControl("", [Validators.required, Validators.pattern('^[0-9]*$')]),
    places: new FormControl("", [Validators.required, Validators.pattern('^[0-9]*$')]),
    description: new FormControl(),
    image: new FormControl(),
  }, {validators: datesValidator('start', 'end')})

  onSubmit(){
    var trip = new Trip();

    trip.name = this.myForm.get('name').value;
    trip.country = this.myForm.get('country').value;
    trip.start = this.myForm.get('start').value;
    trip.end = this.myForm.get('end').value;
    trip.price = this.myForm.get('price').value;
    trip.places = this.myForm.get('places').value;
    trip.description = this.myForm.get('description').value;
    trip.image = this.myForm.get('image').value;
    trip.reserved = 0;
    trip.rating = {
      stars: 0,
      votes: 0
    }
    
    this.service.addData(trip);

  }

}

