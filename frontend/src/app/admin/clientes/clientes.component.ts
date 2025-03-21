import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from '../admin.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, LoadingComponent, NgbModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {
  
  loading: boolean = false;
  clientes: any[] = [];

  constructor(
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes(): void {
    this.loading = true;
    this.adminService.obtenerClientes().pipe(take(1)).subscribe(resp => {
      console.log(resp);
      this.loading = false;
    }, err => {
      console.log(err);
    });
  }
}
