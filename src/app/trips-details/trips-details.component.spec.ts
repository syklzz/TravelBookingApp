import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripsDetailsComponent } from './trips-details.component';

describe('TripsDetailsComponent', () => {
  let component: TripsDetailsComponent;
  let fixture: ComponentFixture<TripsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
