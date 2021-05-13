import { Injectable } from '@angular/core';
import  User  from '../models/user';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from "@angular/fire/auth";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  logged = false;
  user: any;
  userDetails: User ={
    email: null,
    name: null,
    role: null,
    trips: [],
    bought: [],
    rating: []
  };
  users: any;

  private userPath = '/users';
  usersRef: AngularFirestoreCollection<User> = null;

  constructor(private firebaseAuth: AngularFireAuth, private db: AngularFirestore) {

    this.user = firebaseAuth.authState;
    this.usersRef = db.collection(this.userPath);

    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        console.log(user.uid);
        localStorage.setItem('user', user.uid);
        this.logged = true;
      }
      else{
        console.log("nobody is logged in");
      }
    })

    this.setUserData();
  }

  setUserData(){
    this.usersRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.users = data;
        for(let i = 0; i < data.length; i++){
          if(data[i].key.includes(localStorage.getItem('user'))){
            this.userDetails.name = data[i].name;
            this.userDetails.email = data[i].email;
            this.userDetails.role = data[i].role;
            this.userDetails.trips = data[i].trips;
            this.userDetails.bought = data[i].bought;
            this.userDetails.rating = data[i].rating;
            localStorage.setItem('role', data[i].role);
          }
        }
    });
  }

  signup(email: string, password: string) {
    this.firebaseAuth
      //.auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
        localStorage.setItem('user', value.user.uid);
        this.setUserData();
        this.logged = true;
      })
      .catch(err => {
        console.log('Something went wrong:',err.message);
      });    
  }

  login(email: string, password: string) {
    this.firebaseAuth
      //.auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
        localStorage.setItem('user', value.user.uid);
        this.setUserData();
        this.logged = true;
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });

  }

  logout() {
    this.firebaseAuth
      //.auth
      .signOut();

    localStorage.removeItem('user');
    
    this.logged = false;
    this.userDetails = {
      email: null,
      name: null,
      role: null,
      trips: [],
      bought: [],
      rating: []
    };
  }

  isLoggedIn(): boolean {
    if(localStorage.getItem('user')){
      return true;
    }
    return false;
  }

  getUsers(): AngularFirestoreCollection<User>{
    return this.usersRef;
  }

  addUser(u: User) {
    this.firebaseAuth.authState.subscribe(user => {
      if (user) {
        this.usersRef.doc(user.uid).set({
          email: u.email,
          name: u.name,
          role: u.role,
          trips: u.trips,
          bought: u.bought,
          rating: u.rating
        });
      }
    })
  }

  removeUser(key: string): Promise<void> {
    return this.usersRef.doc(key).delete();
  }

  updateUser(key: string, data: any): Promise<void> {
    return this.usersRef.doc(key).update(data);
  }

  getReserved(){
    return this.userDetails.trips.length;
  }

  isReserved(key: string){
    for(let trip of this.userDetails.trips){
      if(key === trip){
        return true;
      }
    }
    return false;
  }

  isBought(key: string){
    for(let trip of this.userDetails.bought){
      if(trip.key == key){
        return true;
      }
    }
    return false;
  }

  isRated(key: string){
    for(let trip of this.userDetails.rating){
      if(trip.key == key && trip.stars != 0){
        return true;
      }
    }
    return false;
  }

  getStars(key: string){
    for(let trip of this.userDetails.rating){
      if(trip.key == key && trip.stars != 0){
        return trip.stars;
      }
    }
    return 0;
  
  }

}
