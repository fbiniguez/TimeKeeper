
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable} from 'rxjs';
import {Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from 'firebase/app';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
 
})
export class LoginComponent implements OnInit {
  user$: Observable<any>;
  loginForm: FormGroup;
  constructor(
    private fb:FormBuilder,
    private _auth: AuthService,
    private router: Router,
    private toastr: ToastrService,

  ) { 
    //inicializa formulario
    this.loginForm = this.fb.group({
      correo: ['', Validators.required],
      password: ['', Validators.required]
    })    
  }
 
    
  ngOnInit() {
  }

  async tryLogin(){
    //chequear si hay un usuario activo
    const user = firebase.auth().currentUser;    
    if(user){
      //si lo hay muestra un mensaje de aviso y redirige a pantalla de usuario
      this.toastr.error('Ya se encuentra logueado en el sistema, salga e inicie sesión con otro usuario', 'Usuario activo', {
        positionClass: 'toast-bottom-right'
      })
      this.router.navigate(['/listadoEmpleado', user.uid]);
    }else{
      try {
         //llamada al servicio de login
         await this._auth.loginUser(this.loginForm.value.correo, this.loginForm.value.password).then((user)=>{
         //Si el login es correcto muestra mensaje y redirecciona a pantalla inicio empleado
           this.toastr.success('Acceso Login correcto', 'Login', {
             positionClass: 'toast-bottom-right'
            })
          this.router.navigate(['/listadoEmpleado', user.user.uid]);
      })
        
      } catch (error) {
        //en caso de error en el login muesetra mensaje de error y limpia formulario
        var errorCode = error.code;
        var errorMessage = error.message;
        this.loginForm.reset();
        this.toastr.error(errorMessage, 'Login', {
          positionClass: 'toast-bottom-right'
        })
      }      
    
   }
 
  }

}
