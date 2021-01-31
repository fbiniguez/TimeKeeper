
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from 'firebase';
import { NavbarComponent } from '../navbar/navbar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [NavbarComponent]
})
export class LoginComponent implements OnInit {
  //usuarios: Observable<any[]>;
  loginForm: FormGroup;
  constructor(
    private fb:FormBuilder,
    private _auth: AuthService,
    private router: Router,
    private navbar: NavbarComponent,
    private toastr: ToastrService,
    private aRoute: ActivatedRoute
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
      //si hay un usuario activo lo muestra en el navbar
      this._auth.user$.emit(user);
      this._auth.isLoggedIn$.emit(true);
      this.navbar.ngOnInit();
      this.router.navigate(['/listadoEmpleado']);
    }else{
      //llamada a la funcion de login
      await this._auth.login(this.loginForm.value.correo, this.loginForm.value.password).then((data)=>{
        if(user){
          this.toastr.success('Acceso Login correcto', 'Login', {
            positionClass: 'toast-bottom-right'
          })
          this.navbar.ngOnInit();
          this.router.navigate(['/listadoEmpleado']);
        }else{
          this.toastr.error('Email o contraseña incorrectos', 'Login', {
            positionClass: 'toast-bottom-right'
          })
        }
      });


    }
   
    
  }
 
}
