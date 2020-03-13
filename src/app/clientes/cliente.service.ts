import swal from 'sweetalert2';
import { Injectable } from '@angular/core';
//import { formatDate } from '@angular/common';
import { Cliente } from './cliente';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { Router } from '@angular/router';


@Injectable()
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private router: Router) { }

  getClientes(): Observable<Cliente[]> {
    //return of (CLIENTES);
    //return this.http.get<Cliente[]>(this.urlEndPoint);
    return this.http.get<Cliente[]>(this.urlEndPoint).pipe(
      //map(response => response as Cliente[])
      tap(response => {
        let clientes = response as Cliente[];
        console.log('ClienteServise: tap 1');
        clientes.forEach( cliente =>{
            console.log(cliente.nombre);
        }
        )
      }),
      map(response => {
        let clientes = response as Cliente[];
        return clientes.map(cliente => {
          cliente.nombre = cliente.nombre.toLocaleUpperCase();
          //cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMM yyyy', 'es-MX');
          return cliente;
        });
      }
      ),
      tap(response => {
        console.log('ClienteServise: tap 2');
        response.forEach( cliente =>{
            console.log(cliente.nombre);
        }
        )
      })
    );
  }

  create(cliente: Cliente): Observable<any> {
    return this.http.post(this.urlEndPoint, cliente, { headers: this.httpHeaders }).pipe(
      map((response: any) => response),//.cliente as Cliente),
      catchError(e => {
        if (e.status == 400) {
          return throwError(e);
        }
        swal.fire(
          'Ops Ocurrió un error', 'Verifica los datos', 'error'
        );
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      map((response: any) => response),
      catchError(e => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        swal.fire(
          'Error al editar', e.error.mensaje, 'error'
        );
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`,
      cliente, { headers: this.httpHeaders }).pipe(
        catchError(e => {

          if (e.status == 400) {
            return throwError(e);
          }
          console.error(e.error.mensaje);
          swal.fire(
            e.error.mensaje, e.error.error, 'error'
          );
          return throwError(e);
        })
      );
  }

  delete(id: number): Observable<Cliente> {
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`, { headers: this.httpHeaders }).pipe(
      catchError(e => {
        console.error(e.error.mensaje);
        swal.fire(
          e.error.mensaje, e.error.error, 'error'
        );
        return throwError(e);
      })
    );
  }

}
