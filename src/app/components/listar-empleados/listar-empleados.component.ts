import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from 'angularfire2/auth';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-listar-empleados',
  templateUrl: './listar-empleados.component.html',
  styleUrls: ['./listar-empleados.component.css']
})
export class ListarEmpleadosComponent implements OnInit {
  empleados: any[] = [];
  loggedUser: string;
  currentIdUser: string;
  isAdmin: boolean;
  isRepre: boolean;

  constructor(
    private _empleadoService: EmpleadoService,
    private toastr: ToastrService,
    private firebaseAuth: AngularFireAuth,
    private _auth: AuthService,
    private rutaActiva: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.recuperaUsuario();
    this.getEmpleados();
    
    
  }

getEmpleados(){       
      //llamada a la funcion del servicio para recuperar empleados
      this._empleadoService.getEmpleados().subscribe(data => {
      //los datos obtenidos se almacenan en un array
      this.empleados = [];
      data.forEach((element: any) =>{
        //almacenado del identificador de usuario
        if(element.payload.doc.data().uid == this.loggedUser){
          this.currentIdUser=element.payload.doc.id
        }
        this.empleados.push({
          id: element.payload.doc.id,
           ...element.payload.doc.data()
        });

      });
      
    });
    
  }
  
  confirmarEliminar(id: string){
    //funcion solicitar confirmacion eliminar empleado
    var conf = confirm('Desea eliminar del sistema este empleado?');
      if(conf)
      this.eliminarEmpleado(id);
      else
      return;    
  }

  async eliminarEmpleado(id: string){
    //eliminar datos empleado en Firestore Database
    await this._empleadoService.eliminarEmpleado(id).then(() =>{
      this.toastr.success('Empleado FIRESTORE eliminado con exito', 'Eliminar empleado', {
        positionClass: 'toast-bottom-right'
      });
    }).catch(error =>{
      this.toastr.success(error.message, 'Eliminar empleado', {
        positionClass: 'toast-bottom-right'
      });
    });
    //eliminar usuario en Firebase Autentification
    await this._auth.deleteUser(this.loggedUser).then(()=>{  
    
        this.toastr.success('Empleado AUTH eliminado con exito', 'Eliminar empleado', {
          positionClass: 'toast-bottom-right'
        });
    
      }).catch(error =>{
        this.toastr.success(error.message, 'Eliminar empleado', {
          positionClass: 'toast-bottom-right'
        });
      })
    
    this._auth.logout();
  }

  async recuperaUsuario() {
     //recuperar el usuario con sesion activa
    await this.firebaseAuth.auth.onAuthStateChanged(user=>{
      if(user){
      this.loggedUser = user.uid;
        }
      });
    
    let id=this.loggedUser;
    //obtener datos del empleado si está logado
    if(id){ this._empleadoService.getUnEmpleado(id).subscribe((empleado) => {
      if (empleado) {
        //recupera roles de usuario
        this.isAdmin = empleado[0].checkAdmin;
        this.isRepre = empleado[0].checkRepresentante;
      }
    });
  }
}

  

}
