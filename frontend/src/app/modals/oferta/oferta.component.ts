import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AdminService } from '../../admin/admin.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgFor, NgIf } from '@angular/common';
import moment from 'moment';

@Component({
  selector: 'app-oferta',
  standalone: true,
  imports: [NgSelectModule, ReactiveFormsModule, LoadingComponent, NgIf, NgFor],
  templateUrl: './oferta.component.html',
  styleUrl: './oferta.component.scss'
})
export class OfertaComponent implements OnInit {
  
  productoSeleccionado: number = null;
  loading = false;
  productos: any[] = [];
  valorOferta: number = 0;
  fecha: string;
  descripcion: string;
  productoForm: FormGroup;
  @Input() isNew: boolean;
  @Input() oferta?: any;

  constructor(
    public modal: NgbActiveModal,
    private adminService: AdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForm();
  }

  get notValidName() {
    return this.productoForm.get('name').invalid && this.productoForm.get('name').touched;
  }

  get notValidDescription() {
    return this.productoForm.get('description').invalid && this.productoForm.get('description').touched;
  }

  get notValidDiscount() {
    return this.productoForm.get('discount_percentage').invalid && this.productoForm.get('discount_percentage').touched;
  }
  
  get notValidStartDate() {
    return this.productoForm.get('start_date').invalid && this.productoForm.get('start_date').touched;
  }

  get notValidEndDate() {
    return this.productoForm.get('end_date').invalid && this.productoForm.get('end_date').touched;
  }

  buildForm(): void {
    let startDate;
    let endDate;
    if (!this.isNew) {
      startDate = moment(this.oferta.inicio, "YYYY-MM-DD HH:mm:ss.SSSSSS").format("YYYY-MM-DD");
      endDate = moment(this.oferta.fin, "YYYY-MM-DD HH:mm:ss.SSSSSS").format("YYYY-MM-DD");
    }
    const controls = {
      name: [this.isNew ? null : this.oferta.nombre, [Validators.required]],
      description: [this.isNew ? null : this.oferta.descripcion, [Validators.required]],
      discount_percentage: [this.isNew ?  null : this.oferta.descuento, [Validators.required, Validators.max(100), Validators.min(0)]],
      start_date: [this.isNew ? null : startDate, [Validators.required]],
      end_date: [this.isNew ? null : endDate, [Validators.required]]
    };
    if (!this.isNew) {
      controls["is_active"] = [this.oferta.activa, [Validators.required]];
    }
    this.productoForm = this.fb.group(controls);
  }

  retornarValores(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }
    const endDate = new Date(this.productoForm.get("end_date").value);
    const startDate = new Date(this.productoForm.get("start_date").value);

    const body = {
      "name": this.productoForm.get("name").value,
      "description": this.productoForm.get("description").value,
      "discount_percentage": this.productoForm.get("discount_percentage").value,
      "start_date": moment(startDate).format('YYYY-MM-DD HH:mm:ss'),
      "end_date": moment(endDate).format('YYYY-MM-DD HH:mm:ss')
    };

    if (!this.isNew) {
      body["id"] = this.oferta.id;
      body["is_active"] = this.productoForm.get("is_active").value;
    }
    
    console.log(body);
    this.modal.close(body);
  }
}
