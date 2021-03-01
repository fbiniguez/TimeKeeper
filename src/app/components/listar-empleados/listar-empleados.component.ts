import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFireAuth } from 'angularfire2/auth';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private _auth: AuthService
  ) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getEmpleados();
    
    
  }
  async getEmpleados(){
    
    await this._empleadoService.getEmpleados().subscribe(data => {
      this.empleados = [];
      data.forEach((element: any) =>{
        if(element.payload.doc.data().uid == this.loggedUser){
          this.currentIdUser=element.payload.doc.id
        }
        this.empleados.push({
          id: element.payload.doc.id,
           ...element.payload.doc.data()
        });

      });
      
    });
    this.recuperaUsuario();
  }
  
  confirmarEliminar(id: string){
    console.log(id);
    var conf = confirm('Desea eliminar del sistema este empleado?');
      if(conf)
      this.eliminarEmpleado(id);
      else
      return;    
  }

  eliminarEmpleado(id: string){
    console.log(id);
    this._auth.deleteUser(id).then(()=>{
      console.log('Eliminado');
      this._empleadoService.eliminarEmpleado(id).then(() =>{
        this.toastr.error('Empleado eliminado con exito', 'Eliminar registro', {
          positionClass: 'toast-bottom-right'
        });
      }).catch(error =>{
        console.log(error);
      })
    })

  }
async getCurrentUser(){
  await this.firebaseAuth.auth.onAuthStateChanged(user=>{
    //asigna el usuario activo a la variable user y asigna el valor de email para mostrarlo en el navBar
    //console.log(user.uid);
    
    //console.log(this.loggedUser)
      if(user){
        this.loggedUser = user.uid;
        console.log(user.uid);
        //this.recuperaUsuario();
      }

  });
  //this.getEmpleados();
}

   recuperaUsuario() {
    
    let id=this.loggedUser;
    let user = this.empleados.find(empleado => empleado.uid == this.loggedUser);
    console.log(id);
    if(id){ this._empleadoService.getUnEmpleado(id).subscribe((empleado) => {
      if (empleado) {
        //console.log(id, this.loggedUser);
        console.log(this.empleados);
        this.isAdmin = empleado[0].checkAdmin;
        this.isRepre = empleado[0].checkRepresentante;
      }
    });
  }
}

  

}
