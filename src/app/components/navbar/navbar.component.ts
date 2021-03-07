import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';
import {Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],

})
export class NavbarComponent implements OnInit {
  //variables para monitorear el estado del login
  isLoggedIn = false;
  isAdmin = false;
  isRepre = false;
  loggedUser: any;
  nombre: string;
  apellido: string;
  rol: string;
 

  constructor(
    private _auth: AuthService,
    private firebaseAuth: AngularFireAuth,
    private toastr :ToastrService,
    private router: Router,
    private _empleado: EmpleadoService,
    ) {
      
     }


ngOnInit() {
  //obtener usuario en activo
    this.firebaseAuth.auth.onAuthStateChanged(user=>{
        if(user){
          this.loggedUser = user.uid;
          this.isLoggedIn = true;
          //recuperar datos usuario
          if(user.uid)
          this.recuperaUsuario(user.uid);
        }else {
          this.isLoggedIn = false;
        }

    });
  }

   logOut(){
     //actualizar flags de control
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.isRepre = false;

    this._auth.logout();
    //mensaje info de usuario desconectado   
    this.toastr.info('Usuario desconectado del sistema', 'Log-out', {
      positionClass: 'toast-bottom-right'
    })
    //redireccion a login
    this.router.navigate(['/login']);
  }

  recuperaUsuario(uid: string) {
    //recupera datos de usuario
    return this._empleado.getUnEmpleado(uid).subscribe((empleado) => {
      if (empleado) {
        this.nombre = empleado[0].nombre;
        this.apellido = empleado[0].apellido1;
        this.isAdmin = empleado[0].checkAdmin;
        this.isRepre = empleado[0].checkRepresentante;
        //recupera el rol del usuario
        if(empleado[0].checkAdmin){
          this.rol = 'Administrador';
        }else if(empleado[0].checkRepresentante){
          this.rol = 'Representante';
        }else{
          this.rol = 'Empleado';
        } 
      }
    });
}
}
