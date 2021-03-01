import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { EventEmitter } from '@angular/core';
import { BehaviorSubject } from 'rxjs'
import * as firebase from 'firebase';

//import * as admin from 'firebase-admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /* user = firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      this.user$ = user;
    } else {
      // No user is signed in.
    }
  });
  
  private user$ = new BehaviorSubject<any>(''); 
  public shareUser$ = this.user$.asObservable();  */
   

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router
    ) {
      
    }

    
  logout() {
    this.firebaseAuth.auth.signOut().then(() => {
      //this.isLoggedIn$.emit(false);
      //this.user$.emit(null);
      this.router.navigate(['']);
   });
  }
  async loginUser(email: string, password: string){
    return await firebase.auth().signInWithEmailAndPassword(email, password);
  }

  registerUser(email: string, password: string ): Promise<any>{
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }
  deleteUser(uid: string){
   return firebase.auth().currentUser.delete();
  }
  getUser(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        /* this.user$.next(user); */
        return user;
      } else {
        // No user is signed in.
        this.router.navigate(['/login']);
      }
    });
  }


  getCurrentUser(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        // User is signed in.
        this.isLoggedIn$.emit(true);
        this.user$.emit(user);
      } else {
        // No user is signed in.
        this.router.navigate(['/login']);
      }
    });
    
  }

}
