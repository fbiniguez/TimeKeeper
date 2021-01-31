import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { AnimationDurations } from '@angular/material';
//import * as admin from 'firebase-admin';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user = this.firebaseAuth.authState;  
  user$ = new EventEmitter<any>();
  isLoggedIn$ = new EventEmitter<boolean>();

  constructor(
    private firebaseAuth: AngularFireAuth,
    private router: Router
    ) {
      
    }
    
  logout() {
    this.firebaseAuth.auth.signOut().then(() => {
      this.isLoggedIn$.emit(false);
      this.user$.emit(null);
      this.router.navigate(['']);
   });
  }
  async login(email: string, password: string){
    await firebase.auth().signInWithEmailAndPassword(email, password)
  .then((user) => {
    // Signed in
    if(user){
    this.isLoggedIn$.emit(true);
    this.user$.emit(user.user);
    //console.log('Login realizado con exito', user.user);
    }else console.log('usuario / pass incorrectos')
  })
  .catch((error) => {
    console.log(error.message);
    var errorCode = error.code;
    var errorMessage = error.message;
  });

  }

  registerUser(email: string, password: string ): Promise<any>{
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }
  deleteUser(uid: string){
   return firebase.auth().currentUser.delete();
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

  /*
  isAuth(){
    return this.firebaseAuth.authState.pipe(map(auth => auth));
  }
  obtenerUsuario(){
    this.firebaseAuth.isAuth().subscribe(auth=>{
      if(auth){
        this.userUid = auth.uid;
        this.firebaseAuth.isUserAdmin(this.userUid).subscribe(userRole=>{
          this.isAdmin = Object.assign({}, userRole.roles).hasOwnProperty('admin');
        })
      }
    })
  }
*/
 

}
