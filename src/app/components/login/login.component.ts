
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from 'firebase';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [NavbarComponent]
})
export class LoginComponent implements OnInit {
  
  loginForm: FormGroup;
  constructor(
    private fb:FormBuilder,
    private _auth: AuthService,
    private router: Router,
    private navbar: NavbarComponent,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute,
    private firebaseAuth: AngularFireAuth,
  ) { 
    this.loginForm = this.fb.group({
      correo: ['', Validators.required],
      password: ['', Validators.required]
    })
   
  }
 
    
  ngOnInit() {
  }

  async tryLogin(){
    const user = firebase.auth().currentUser;
    if(user){
      //console.log(user);
      //si hay un usuario activo lo muestra en el navbar
      //this._auth.user$.emit(user.uid);
      //this._auth.isLoggedIn$.emit(true);
      //this.navbar.ngOnInit();
      this.router.navigate(['/listadoEmpleado', user.uid]);
    }else{
      //this.firebaseAuth.auth.signOut();
      await  this._auth.loginUser(this.loginForm.value.correo, this.loginForm.value.password).then((user)=>{
        console.log(user.user.uid);
        let prueba = this._auth.getUser();
        console.log(prueba);
       /*  this._auth.shareUser$.subscribe((user)=>{
          console.log(prueba);
        }) */
        this.toastr.success('Acceso Login correcto', 'Login', {
          positionClass: 'toast-bottom-right'
        })
        this.router.navigate(['/listadoEmpleado', user.user.uid]);
      }).catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
        this.loginForm.reset();
        this.toastr.error('Email o contraseña incorrectos', 'Login', {
          positionClass: 'toast-bottom-right'
        })
      });
      /*firebase.auth().signInWithEmailAndPassword(this.loginForm.value.correo, this.loginForm.value.password).then((user) => {
        console.log(user.user.uid);
              this._auth.user$.emit(user.user.uid);
              this._auth.isLoggedIn$.emit(true);
              this.toastr.success('Acceso Login correcto', 'Login', {
              positionClass: 'toast-bottom-right'
            })
            //this.navbar.ngOnInit();
            this.router.navigate(['/listadoEmpleado', user.user.uid]);
    
        }).catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(errorCode, errorMessage);
          this.loginForm.reset();
          this.toastr.error('Email o contraseña incorrectos', 'Login', {
            positionClass: 'toast-bottom-right'
          })
        });
          */

    }
   
    
  }
 
}
