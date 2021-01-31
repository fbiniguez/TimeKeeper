import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-listar-empleados',
  templateUrl: './listar-empleados.component.html',
  styleUrls: ['./listar-empleados.component.css']
})
export class ListarEmpleadosComponent implements OnInit {
  empleados: any[] = [];

  constructor(
    private _empleadoService: EmpleadoService,
    private toastr: ToastrService,
    private _auth: AuthService
  ) { }

  ngOnInit(): void {
    this.getEmpleados()
  }
  getEmpleados(){
    this._empleadoService.getEmpleados().subscribe(data => {
      this.empleados = [];
      data.forEach((element: any) =>{
        this.empleados.push({
          id: element.payload.doc.id,
           ...element.payload.doc.data()
        });
      });
      //console.log(this.empleados);
    });
  }
  eliminarEmpleado(id: string){
    
  }
  /*
  eliminarEmpleado(id: string){
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

  */

}
