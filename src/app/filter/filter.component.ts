import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})

export class FilterComponent implements OnInit {

  @Input() List: any[];
  @Input() currentList: any[];
  @Input() conditions;

  @Output() notify = new EventEmitter();

  active = false;

  maxP: number;
  minP: number;


  constructor() { }


  ngOnInit(): void {}

  changeActive(){
    this.active = !this.active;
  }

  maxPrice(){
    this.maxP = this.currentList[0].price;
    for (let i = 0; i < this.currentList.length; i++){
      if (Number(this.currentList[i].price) > Number(this.maxP)){
        this.maxP = this.currentList[i].price;
      }
    }
    return this.maxP;
  }

  minPrice(){
    this.minP = this.currentList[0].price;
    for (let i = 0; i < this.currentList.length; i++){
      if (Number(this.currentList[i].price) < Number(this.minP)){
        this.minP = this.currentList[i].price;
      }
    }
    return this.minP;
  }

  onDestinationChange(i: number){
    this.conditions.Destination[i] = !this.conditions.Destination[i];
    this.notify.emit(this.conditions);
  }

  onRatingChange(i: number){
    this.conditions.Rating[i] = !this.conditions.Rating[i];
    this.notify.emit(this.conditions);
  }


  selectedStart ="";
  selectedEnd ="";

  selectedMin;
  selectedMax;


  onDateChange(){
    this.conditions.Date[0] = this.selectedStart;
    this.conditions.Date[1] = this.selectedEnd;
    this.notify.emit(this.conditions);
  }

  onPriceChange(){
    this.conditions.Price[0] = this.selectedMin;
    this.conditions.Price[1] = this.selectedMax;
    this.notify.emit(this.conditions);

  }

}
