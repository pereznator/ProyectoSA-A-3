import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../admin.service';
import { Location, NgClass, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../../main/main.service';
import { take } from 'rxjs';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { Producto } from '../producto.types';
import { v4 } from 'uuid';
import { S3Service } from '../../../s3.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmActionComponent } from '../../../modals/confirm-action/confirm-action.component';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [NgIf, NgClass, NgFor, ReactiveFormsModule, LoadingComponent],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.scss'
})
export class ProductoFormComponent implements OnInit {
  
  @Input() isNew: boolean;
  productoForm: FormGroup;
  producto: Producto;
  loading: boolean = false;
  imagenProducto: string | ArrayBuffer = null;
  archivo: File = null;
  showAlert: boolean = false;
  alertMessage: string = "";
  categorias: any[] = [];
  proveedores: any[] = [];

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private mainService: MainService,
    private s3Service: S3Service,
    private router: Router,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getCategorias();
  }

  get notValidNombre(): boolean {
    return this.productoForm.get("nombre").touched && this.productoForm.get("nombre").invalid;
  }
  get notValidDescripcion(): boolean {
    return this.productoForm.get("descripcion").touched && this.productoForm.get("descripcion").invalid;
  }
  get notValidCategoria(): boolean {
    return this.productoForm.get("categoriaId").touched && this.productoForm.get("categoriaId").invalid;
  }
  get notValidPortada(): boolean {
    return this.productoForm.get("portada").touched && this.productoForm.get("portada").invalid;
  }
  get notValidProveedor(): boolean {
    return this.productoForm.get("proveedorId").touched && this.productoForm.get("proveedorId").invalid;
  }
  get notValidPrecio(): boolean {
    return this.productoForm.get("precio").touched && this.productoForm.get("precio").invalid;
  }
  get notValidCosto(): boolean {
    return this.productoForm.get("costo").touched && this.productoForm.get("costo").invalid;
  }

  getCategorias(): void {
    this.loading = true;
    this.mainService.obtenerCategorias().pipe(take(1)).subscribe(resp => {
      this.categorias = resp.response_database.result;
      console.log(this.categorias);
      this.getProveedores();
    }, err => {
      console.log(err);
    })
  }

  getProveedores(): void {
    this.adminService.obtenerProveedores().pipe(take(1)).subscribe(resp => {
      this.proveedores = resp.response_database.result;
      console.log(this.proveedores);
      if (this.isNew) {
        this.crearFormulario();
      } else {
        this.getProducto();
      }
    }, err => {
      console.log(err);
    });
  }

  getProducto(): void {
    this.activatedRoute.params.pipe(take(1)).subscribe(params => {
      const idProducto = params["idProducto"];
      this.adminService.obtenerProductoPorId(idProducto).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.producto = {
          id: resp.response_database.result[0].id,
          portada: resp.response_database.result[0].portada,
          nombre: resp.response_database.result[0].nombre,
          categoriaId: resp.response_database.result[0].categoria_producto_id,
          precio: resp.response_database.result[0].precio,
          costo: resp.response_database.result[0].costo,
          fecha: resp.response_database.result[0].fechaRegistro,
          descripcion: resp.response_database.result[0].descripcion,
          proveedorId: resp.response_database.result[0].proveedor_id,
        };
        this.crearFormulario();
      }, err => {
        console.log(err);
      });
    });
  }

  crearFormulario(): void {
    this.productoForm = this.fb.group({
      nombre: [this.isNew ? null : this.producto.nombre, [Validators.required]],
      descripcion: [this.isNew ? null : this.producto.descripcion, [Validators.required]],
      categoriaId: [this.isNew ? null : this.producto.categoriaId, [Validators.required]],
      portada: [null, this.isNew ? [Validators.required] : []],
      proveedorId: [this.isNew ? null : this.producto.proveedorId, [Validators.required]],
      precio: [this.isNew ? null : this.producto.precio, [Validators.required]],
      costo: [this.isNew ? null : this.producto.costo, [Validators.required]],
    });
    this.loading = false;
  }

  cargarImagen(event: any) {
    this.archivo = event.target.files[0];
    if (this.archivo) {
      const lector = new FileReader();
      lector.readAsDataURL(this.archivo);
      lector.onload = () => {
        this.imagenProducto = lector.result;
      };
    }
  }

  guardar(): void {
    this.showAlert = false;
    this.productoForm.markAllAsTouched();
    if (this.productoForm.invalid) {
      return;
    }

    this.productoForm.disable();

    const productoBody = {
      nombre: this.productoForm.get("nombre").value,
      descripcion: this.productoForm.get("descripcion").value,
      portada: this.isNew ? "" : this.producto.portada,
      precio: this.productoForm.get("precio").value,
      categoria_producto_id: this.productoForm.get("categoriaId").value,
      proveedor_id: this.productoForm.get("proveedorId").value,
      costo: this.productoForm.get("costo").value,
    };

    if (this.isNew) {
      if (!this.archivo) {
        this.alertMessage = "No has seleccionado ninguna imagen.";
        this.showAlert = true;
        return;
      }
      const portadaId = v4();
      this.s3Service.uploadFileToBucket(this.archivo, "proyecto-2-ayd-2-g1", portadaId).subscribe(s3Resp => {
        productoBody.portada = s3Resp.Location;
        this.adminService.crearProducto(productoBody).pipe(take(1)).subscribe(resp => {
          console.log(resp);
          this.router.navigate(["admin", "productos"]);
        }, err => {
          console.log(err);
        });
      }, err => {
        console.log(err);
      });
    } else {
      const bucketUrl = "https://proyecto-2-ayd-2-g1.s3.amazonaws.com";
      if (this.archivo) {
        const id = v4();
        productoBody.portada = `${bucketUrl}/${id}`;
        this.s3Service.uploadFileToBucket(this.archivo, "proyecto-2-ayd-2-g1", id).pipe(take(1)).subscribe(resp => {
          console.log("S3 RESPONSE", resp);
        }, err => {
          console.log(err);
        });
      }
      this.adminService.actualizarProducto(this.producto.id, productoBody).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.router.navigate(["admin", "productos"]);
      }, err => {
        console.log(err);
      })
    }
  }

  eliminar(): void {
    const modal = this.modalService.open(ConfirmActionComponent);
    modal.componentInstance.title = "Eliminar Producto";
    modal.componentInstance.description = "Estas seguro que deseas eliminar este producto?";
    modal.result.then(result => {
      this.adminService.eliminarProducto(this.producto.id).pipe(take(1)).subscribe(resp => {
        console.log(resp);
        this.router.navigate(["admin", "productos"]);
      }, err => {
        console.log(err);
      });
    }, dismiss => {});
  }

  atras(): void {
    this.location.back();
  }
}
