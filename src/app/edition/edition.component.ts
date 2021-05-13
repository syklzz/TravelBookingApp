import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators  } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {DataService} from '../services/data.service'
import { map } from 'rxjs/operators';

import { Output, EventEmitter} from '@angular/core';
import { datesValidator } from '../form/validation';


@Component({
  selector: 'app-edition',
  templateUrl: './edition.component.html',
  styleUrls: ['./edition.component.css']
})
export class EditionComponent implements OnInit {

  @Output() newTrip = new EventEmitter();

  id: string;
  tripList: any;
  trip = null;

  constructor(private actRoute: ActivatedRoute, public service: DataService) {
    this.id = this.actRoute.snapshot.params.id;
  }

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
      for(let trip of this.tripList){
        if(trip.key == this.id){
          this.trip = trip;
        }
      }
    });

  }

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
    this.service.updateData(this.id, {
        name: this.myForm.get('name').value,
        country: this.myForm.get('country').value,
        start: this.myForm.get('start').value,
        end: this.myForm.get('end').value,
        price: this.myForm.get('price').value,
        places: this.myForm.get('places').value,
        description: this.myForm.get('description').value,
        image: this.myForm.get('image').value,
        reserved: this.trip.reserved,
        rating: this.trip.rating
      });
    }

}
