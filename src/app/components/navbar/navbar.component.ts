import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  //variables para monitorear el estado del login
  user = this.firebaseAuth.authState; 
  isLoggedIn = false;
  email: string;

  constructor(
    private _auth: AuthService,
    private firebaseAuth: AngularFireAuth,
    private toastr :ToastrService
    ) { }

  ngOnInit() {
    //subscripcion al even emitter del usuario
    this._auth.user$.subscribe(user =>{
      //asigna el usuario activo a la variable user y asigna el valor de email para mostrarlo en el navBar
      
        this.user = user;
        if(user!==null){this.email = user.email;}else this.email = '';
      

    });
    //subscripcion al event emiter del estado logueado
    this._auth.isLoggedIn$.subscribe(state =>{
      this.isLoggedIn = state;
    })
  }

  logOut(){
   
    this._auth.logout();
    //this.isLoggedIn$.emit(false);
    this.ngOnInit();
    this.toastr.info('Usuario desconectado del sistema', 'Log-out', {
      positionClass: 'toast-bottom-right'
    })
  }

}
