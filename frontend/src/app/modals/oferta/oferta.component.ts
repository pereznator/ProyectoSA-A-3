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

  constructor(
    public modal: NgbActiveModal,
    private adminService: AdminService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    if (this.isNew) {
      this.buildForm();
    } else {

    }
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

  get notValidEndDate() {
    return this.productoForm.get('end_date').invalid && this.productoForm.get('end_date').touched;
  }

  buildForm(): void {
    this.productoForm = this.fb.group({
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      discount_percentage: [null, [Validators.required, Validators.max(100), Validators.min(0)]],
      end_date: [null, [Validators.required]]
    });
  }

  retornarValores(): void {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }
    const endDate = new Date(this.productoForm.get("end_date").value);
    
    this.modal.close(
      {
        "name": this.productoForm.get("name").value,
        "description": this.productoForm.get("description").value,
        "discount_percentage": this.productoForm.get("discount_percentage").value,
        "start_date": moment().format('YYYY-MM-DD HH:mm:ss'),
        "end_date": moment(endDate).format('YYYY-MM-DD HH:mm:ss')
      }      
    );
  }
}
