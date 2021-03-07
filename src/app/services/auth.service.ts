import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router
    ) {}

    
logout() {
    this.firebaseAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
   });
  }
loginUser(email: string, password: string): Promise<any>{
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

registerUser(email: string, password: string ): Promise<any>{
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }

deleteUser(uid: string): Promise<any>{
   return firebase.auth().currentUser.delete();
  }


getCurrentUser(){
    firebase.auth().onAuthStateChanged(function(user) {
      if (user) {
        //Devuelve el usuario activo
        return user;
      } else {
        // Si no hay usuario activo redirecciona al login
        this.router.navigate(['/login']);
      }
    });
    
  }

}
