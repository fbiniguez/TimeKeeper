import { Component } from '@angular/core';

//servicios
import { EmpleadoService } from '../app/services/empleado.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'timeKeeper';

  constructor(
    private empleadoService: EmpleadoService
  ){}
}
