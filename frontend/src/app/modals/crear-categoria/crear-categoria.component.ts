import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-crear-categoria',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './crear-categoria.component.html',
  styleUrl: './crear-categoria.component.scss'
})
export class CrearCategoriaComponent implements OnInit {
  
  descripcion: string = "";

  constructor(public modal: NgbActiveModal) {
    
  }

  ngOnInit(): void {
    
  }


}
