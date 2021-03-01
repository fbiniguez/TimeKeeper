import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  //variables para monitorear el estado del login
  isLoggedIn = false;
  isAdmin = false;
  isRepre = false;
  loggedUser: any;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
 

  constructor(
    private _auth: AuthService,
    private firebaseAuth: AngularFireAuth,
    private toastr :ToastrService,
    private _empleado: EmpleadoService,
    ) {
      
     }


ngOnInit() {
  /* await this._auth.shareUser$.subscribe((user)=>{
    this.loggedUser = user;
    console.log(this.loggedUser);
  }) ; */

    this.firebaseAuth.auth.onAuthStateChanged(user=>{
      //asigna el usuario activo a la variable user y asigna el valor de email para mostrarlo en el navBar
      //console.log(user.uid);
      
      //console.log(this.loggedUser)
        if(user){
          this.loggedUser = user.uid;
          this.email = user.email;
          this.isLoggedIn = true;
          console.log('nombre', this.nombre, 'apellido', this.apellido);
          this.recuperaUsuario();
        }else {
          this.email = '';
          this.isLoggedIn = false;
        }

    });
  }

 

  logOut(){
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.isRepre = false;
    this._auth.logout();
    //this.ngOnInit();    
    this.toastr.info('Usuario desconectado del sistema', 'Log-out', {
      positionClass: 'toast-bottom-right'
    })
  }

  recuperaUsuario() {
    return this._empleado.getUnEmpleado(this.loggedUser).subscribe((empleado) => {
      if (empleado) {
        //console.log(empleado);
        this.nombre = empleado[0].nombre;
        this.apellido = empleado[0].apellido1;
        this.isAdmin = empleado[0].checkAdmin;
        this.isRepre = empleado[0].checkRepresentante;
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
