import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../client.service';
import { CurrencyPipe, DatePipe, Location, NgClass, NgFor, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Carrito } from '../../carrito/carrito.types';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../auth/auth.types';
import { map, take } from 'rxjs';
import { ConfirmActionComponent } from '../../../modals/confirm-action/confirm-action.component';
import { S3Service } from '../../../s3.service';
import { v4 } from 'uuid';

@Component({
  selector: 'app-crear-orden',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, NgbModule, LoadingComponent, FormsModule, CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './crear-orden.component.html',
  styleUrl: './crear-orden.component.scss'
})
export class CrearOrdenComponent implements OnInit {
  
  loading: boolean = false;
  carrito: Carrito;
  metodosPago: any[] = [];
  user: User;
  metodoPagoSeleccionadoId: number = null;
  file: File;

  constructor(
    private clietSerivce: ClientService,
    private location: Location,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal,
    private s3Service: S3Service
  ) {}
  
  get total(): number {
    let total = 0;
    this.carrito.carrito.productos.map(pr => {
      total += (pr.cantidad * pr.precio_unidad);
    });
    return total;
  }

  get metodoPagoSeleccionado(): any {
    if (this.metodoPagoSeleccionadoId === null) {
      return null;
    }
    return this.metodosPago.find(mp => mp.id === this.metodoPagoSeleccionadoId);
  }

  ngOnInit(): void {
    this.getCarrito();
  }

  getCarrito(): void {
    this.loading = true;
    this.authService.user$.subscribe(user => {
      this.user = user;
      this.clietSerivce.getCarrito(this.user.idCliente).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.carrito = resp.response_dinamodb;
        this.getMetodosPago();
      }, err => {
        console.log(err);
      });
    })
  }

  getMetodosPago(): void {
    this.clietSerivce.getMetodosPago(this.user.idCliente).pipe(take(1)).subscribe(resp => {
      this.metodosPago = resp.response_database.result.map(met => {
        if (met.tipo_metodo_pago === "TARJETA") {
          met["detalles"] = `[TARJETA] Termina en: ${met.numero_tarjeta.slice(11, 15)}, exp ${met.fecha_exp}`;
        } else if (met.tipo_metodo_pago === "TRANSFERENCIA") {
          met["detalles"] = "[TRANSFERENCIA] Subir el comprobante de la transferencia.";
        } else {
          met["detalles"] = "[EFECTIVO] Pagar en efectivo al momento de la entrega.";
        }
        return met;
      });
      console.log(this.metodosPago);
      this.loading = false;
    }, err => {
      console.log(err);
    });
  }

  onCVSelected(event): void {
    this.file = event.target.files[0];
  }
  irAMetodosPago(): void {
    this.router.navigate(["cliente", "metodos-pago"])
  }

  confirmar(): void {
    if (this.metodoPagoSeleccionado.tipo_metodo_pago === "TRANSFERENCIA" && !this.file) {
      return;
    } 
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Confirmar Compra";
    modal.componentInstance.description = "Estas seguro que quieres confirmar la compra?";
    modal.result.then(() => {
      this.loading = true;
      
      let pdfUrl: string;
      if (this.file) {
        const pdfId = v4();
        pdfUrl = `https://proyecto-2-ayd-2-g1.s3.amazonaws.com/${pdfId}`;
        this.s3Service.uploadFileToBucket(this.file, "proyecto-2-ayd-2-g1", pdfId).pipe(take(1)).subscribe(resp => {
          console.log("BUCKET SUCCESS", resp);
        }, err => {
          console.log("BUCKET ERROR", err);
        });
      }

      const pedido = {
        estado_pedido_id: 1,
        oferta_id: null,
        cliente_id: this.user.idCliente,
        detalle_pedido: this.carrito.carrito.productos.map(pro => ({ cantidad: pro.cantidad, producto_id: pro.producto_id }))
      };


      this.clietSerivce.crearPedido(pedido).pipe(take(1), map(resp => resp.response_pedido.result.insertId)).subscribe(pedido_id => {
        console.log("PEDIDO ID", pedido_id);
          const pagoBody = {
            detalle: pdfUrl ?? "No file.",
            pedido_id,
            metodo_pago_id: this.metodoPagoSeleccionadoId
          };
          this.clietSerivce.crearPago(pagoBody).pipe(take(1)).subscribe((respPago) => {
            console.log("RESP CARRITO", respPago);
            this.carrito.carrito.productos = []
            this.clietSerivce.actualizarCarrito(this.user.idCarrito, this.carrito).pipe(take(1)).subscribe(respCarrito => {
              console.log("RESP CARRITO", respCarrito);
              this.loading = false;
              this.router.navigate(["cliente", "ordenes"]);
            }, err => {
              console.log("ERROR CARRITO", err);
            });
          }, err => {
            console.log("ERROR PAGO", err);
          });

        // const detallePedido = {
        //   detalles: this.carrito.carrito.productos.map(pro => ({ cantidad: pro.cantidad, pedido_id, producto_id: pro.producto_id }))
        // };
        // this.clietSerivce.crearDetallePedido(detallePedido).pipe(take(1)).subscribe((respDetalle) => {
        //   console.log(respDetalle);
        //   const pagoBody = {
        //     detalle: pdfUrl ?? "No file.",
        //     pedido_id,
        //     metodo_pago_id: this.metodoPagoSeleccionadoId
        //   };
        //   this.clietSerivce.crearPago(pagoBody).pipe(take(1)).subscribe((respPago) => {
        //     console.log("RESP CARRITO", respPago);
        //     this.carrito.carrito.productos = []
        //     this.clietSerivce.actualizarCarrito(this.user.idCarrito, this.carrito).pipe(take(1)).subscribe(respCarrito => {
        //       console.log("RESP CARRITO", respCarrito);
        //       this.loading = false;
        //     }, err => {
        //       console.log("ERROR CARRITO", err);
        //     });
        //   }, err => {
        //     console.log("ERROR PAGO", err);
        //   });
        // }, err => {
        //   console.log("ERROR DETALLE PEDIDO", err);
        // });
      }, err => {
        console.log("ERROR PEDIDO", err);
      });
    }, () => {});
  }

}
