import { Router, ActivatedRoute } from '@angular/router';
import { ClienteService } from './cliente.service';
import { Cliente } from './cliente';
import { Component, OnInit } from '@angular/core';
import swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente();
  private titulo: string = "Crear Cliente";

  private errores: string[];

  constructor(private clienteService: ClienteService,
    private router: Router,
    private activetedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.cargarCliente();
  }

  cargarCliente(): void {
    this.activetedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe(
          (cliente) => this.cliente = cliente
        );
      }
    });
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes']);
        swal.fire('Nuevo Cliente', `${json.mensaje}`, 'success');
      },
      error =>{
        this.errores = error.error.errors as string[];
        console.error('Código del error '+ error.status);
        console.error(error.error.errors);
      }
    );
  }

  update(): void {
    this.clienteService.update(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes']);
        swal.fire('Cliente Actualizado',
          ` ${json.mensaje}`),
          'success';
      },
      error =>{
        this.errores = error.error.errors as string[];
        console.error('Código del error '+ error.status);
        console.error(error.error.errors);
      });
  }

  

}
