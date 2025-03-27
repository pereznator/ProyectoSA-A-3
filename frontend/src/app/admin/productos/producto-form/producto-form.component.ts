import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AdminService } from '../../admin.service';
import { Location, NgClass, NgFor, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from '../../../main/main.service';
import { map, take } from 'rxjs';
import { LoadingComponent } from '../../../shared/loading/loading.component';
import { Producto } from '../producto.types';
import { v4 } from 'uuid';
import { S3Service } from '../../../s3.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmActionComponent } from '../../../modals/confirm-action/confirm-action.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgFor,
    ReactiveFormsModule,
    LoadingComponent,
    MatChipsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  templateUrl: './producto-form.component.html',
  styleUrl: './producto-form.component.scss'
})
export class ProductoFormComponent implements OnInit {
  brands: string[] = [];
  regiones: string[] = [];
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() isNew: boolean;
  productoForm: FormGroup;
  producto: Producto;
  loading: boolean = false;
  imagenProducto: string | ArrayBuffer = null;
  archivo: File = null;
  showAlert: boolean = false;
  alertMessage: string = "";

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private mainService: MainService,
    private s3Service: S3Service,
    private router: Router,
    private modalService: NgbModal,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loading = true;
    if (this.isNew) {
      this.crearFormulario();
    } else {
      this.getProducto();
    }
  }

  get notValidCode(): boolean {
    return this.productoForm.get("code").touched && this.productoForm.get("code").invalid;
  }
  
  get notValidName(): boolean {
    return this.productoForm.get("name").touched && this.productoForm.get("name").invalid;
  }
  
  get notValidPrice(): boolean {
    return this.productoForm.get("price").touched && this.productoForm.get("price").invalid;
  }
  
  get notValidValue(): boolean {
    return this.productoForm.get("value").touched && this.productoForm.get("value").invalid;
  }
  
  get notValidBrands(): boolean {
    // return this.productoForm.get("brands").touched && this.productoForm.get("brands").invalid;
    return this.productoForm.get('brands').hasError('emptyArray') && this.productoForm.get('brands').touched
  }
  
  get notValidCategory(): boolean {
    return this.productoForm.get("category").touched && this.productoForm.get("category").invalid;
  }
  
  get notValidDescription(): boolean {
    return this.productoForm.get("description").touched && this.productoForm.get("description").invalid;
  }
  
  get notValidStockQuantity(): boolean {
    return this.productoForm.get("stock_quantity").touched && this.productoForm.get("stock_quantity").invalid;
  }
  
  get notValidRestrictedRegions(): boolean {
    return this.productoForm.get("restricted_regions").touched && this.productoForm.get("restricted_regions").invalid;
  }
  

  getProducto(): void {
    this.activatedRoute.params.pipe(take(1)).subscribe(params => {
      const idProducto = params["idProducto"];
      this.mainService.obtenerProducto(idProducto).pipe(take(1), map(resp => resp.producto)).subscribe(resp => {
        console.log(resp);
        this.producto = {
          id: resp.product_id,
          name: resp.name,
          description: resp.description,
          price: resp.price,
          stock_quantity: resp.stock_quantity,
          code: resp.code,
          main_image_url: resp.main_image_url,
          value: resp.value,
          category_name: resp.category,
          marcas: resp.brands,
          regiones: resp.restricted_regions,
          imagenes: resp.images,
          brands: resp.brands,
          status: resp.status,
        };
        this.crearFormulario();
      }, err => {
        console.log(err);
      });
    });
  }

  arrayNoVacioValidator() {
    return (control: AbstractControl) => {
      const value = control.value;
      return Array.isArray(value) && value.length > 0
        ? null
        : { emptyArray: true };
    };
  }

  crearFormulario(): void {
    this.productoForm = this.fb.group({
      code: [this.isNew ? null : this.producto.code, [Validators.required]],
      name: [this.isNew ? null : this.producto.name, [Validators.required]],
      price: [this.isNew ? null : this.producto.price, [Validators.required]],
      value: [this.isNew ? null : this.producto.value, [Validators.required]],
      brands: [this.isNew ? [] : this.producto.brands, [Validators.required, this.arrayNoVacioValidator()]],
      images: [],
      category: [this.isNew ? null : this.producto.category_name, [Validators.required]],
      description: [this.isNew ? null : this.producto.description, [Validators.required]],
      stock_quantity: [this.isNew ? null : this.producto.stock_quantity, [Validators.required]],
      restricted_regions: [this.isNew ? [] : this.producto.regiones, []]
      // code: [this.isNew ? "12343" : this.producto.code, [Validators.required]],
      // name: [this.isNew ? "Teclado Razer Bionico Gamer Negro" : this.producto.name, [Validators.required]],
      // price: [this.isNew ? 300 : this.producto.price, [Validators.required]],
      // value: [this.isNew ? 200 : this.producto.value, [Validators.required]],
      // brands: [this.isNew ? ["Razer", "Logitec"] : this.producto.brands, [Validators.required, this.arrayNoVacioValidator()]],
      // images: [],
      // category: [this.isNew ? "Gaming" : this.producto.category_name, [Validators.required]],
      // description: [this.isNew ? "Teclado mecanico gaming tamaño 80%" : this.producto.description, [Validators.required]],
      // stock_quantity: [this.isNew ? 25 : this.producto.stock_quantity, [Validators.required]],
      // restricted_regions: [this.isNew ? ["Totonicapan"] : this.producto.regiones, []]
    });
    if (!this.isNew) {
      if (this.producto?.brands) {
        this.brands = [...this.producto.brands];
      }
      if (this.producto?.regiones) {
        this.regiones = [...this.producto.regiones]
      }
      this.imagenProducto = this.producto.main_image_url;
    }
    this.productoForm.disable();
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
      name: this.productoForm.get("name").value,
      description: this.productoForm.get("description").value,
      price: this.productoForm.get("price").value,
      value: this.productoForm.get("value").value,
      stock_quantity: this.productoForm.get("stock_quantity").value,
      code: this.productoForm.get("code").value,
      main_image_url: "",
      category_name: this.productoForm.get("category").value,
      marcas: this.productoForm.get("brands").value,
      regiones: this.productoForm.get("restricted_regions").value,
      imagenes: []
    }
    console.log(productoBody);

    if (this.isNew) {
      if (!this.archivo) {
        this.alertMessage = "No has seleccionado ninguna imagen.";
        this.showAlert = true;
        return;
      }
      const portadaId = v4();
      this.s3Service.generateUploadUrl(this.archivo,  portadaId).subscribe(s3Resp => {
        productoBody.main_image_url = s3Resp;
        this.adminService.crearProducto(productoBody).pipe(take(1)).subscribe(resp => {
          console.log(resp);
          this.router.navigate(["admin", "productos"]);
          this.snackBar.open('Usuario Reportado', 'Cerrar', {
            duration: 3000, // en milisegundos
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          });
        }, err => {
          console.log(err);
        });
      }, err => {
        console.log(err);
      });
    } else {
      if (this.archivo) {
        const id = v4();
        productoBody.main_image_url = `https://storage.googleapis.com/software-avanzado-bucket/${id}`;
        this.s3Service.generateUploadUrl(this.archivo,  id).pipe(take(1)).subscribe(resp => {
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

  addBrand(event: MatChipInputEvent): void {
    const value = event.value?.trim();
  
    if (value && !this.brands.includes(value)) {
      this.brands.push(value);
      this.productoForm.get('brands').setValue(this.brands);
    }
  
    if (event.input) {
      event.input.value = '';
    }
  }
  
  removeBrand(brand: string): void {
    const index = this.brands.indexOf(brand);
  
    if (index >= 0) {
      this.brands.splice(index, 1);
      this.productoForm.get('brands').setValue(this.brands);
    }
  }
  addRegion(event: MatChipInputEvent): void {
    const value = event.value?.trim();
  
    if (value && !this.regiones.includes(value)) {
      this.regiones.push(value);
      this.productoForm.get('restricted_regions').setValue(this.regiones);
    }
  
    if (event.input) {
      event.input.value = '';
    }
  }
  
  removeRegion(region: string): void {
    const index = this.regiones.indexOf(region);
  
    if (index >= 0) {
      this.regiones.splice(index, 1);
      this.productoForm.get('restricted_regions').setValue(this.regiones);
    }
  }
}
