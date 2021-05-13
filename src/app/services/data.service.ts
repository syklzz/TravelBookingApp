import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import  Trip  from '../models/trip';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private tripsPath = '/trips';
  tripsRef: AngularFirestoreCollection<Trip> = null;

  constructor(private db: AngularFirestore) {
    this.tripsRef = db.collection(this.tripsPath);
  }

  getData(): AngularFirestoreCollection<Trip> {
    return this.tripsRef;
  }

  addData(trip: Trip): any {
    return this.tripsRef.add({ ...trip });
  }

  removeData(key: string): Promise<void> {
    return this.tripsRef.doc(key).delete();
  }

  updateData(key: string, data: any): Promise<void> {
    return this.tripsRef.doc(key).update(data);
  }

}
