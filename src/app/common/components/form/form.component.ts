import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../../products/services/api.service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { NgClass, NgIf } from '@angular/common';
import { eModeCRUD } from '../../enums/eModeCRUD';
import { iToast } from '../../interfaces/iToast';
import { iProduct } from '../../../products/interfaces/iProduct';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-form',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    ReactiveFormsModule,
    ToastModule,
    NgClass,
    NgIf,
  ],
  providers: [MessageService],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class FormComponent implements OnInit {
  /* Enums */
  public eMode = eModeCRUD;
  modeSelected!: eModeCRUD;

  /* Forms */
  form!: FormGroup;

  /* Numbers */
  id!: number;
  userId!: number;

  /* Booleans */
  showSaveButton: boolean = false;

  constructor(
    readonly ref: DynamicDialogRef,
    readonly config: DynamicDialogConfig,
    readonly fb: FormBuilder,
    readonly apiService: ApiService,
    readonly messageService: MessageService
  ) {
    this.id = this.config.data.id;
    this.modeSelected = this.config.data.MODE;
    this.userId = this.config.data.userId;
  }

  ngOnInit(): void {
    this.createForm();
    this.setForm();
  }

  createForm() {
    this.form = new UntypedFormGroup({
      product: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required]),
    });
  }

  setForm() {
    /* Nota: Si el modo es diferente a CREATE, significa que debe cargar los datos porque esta en modo READ o UPDATE */
    if (this.modeSelected !== this.eMode.CREATE) this.loadProduct(this.id);

    /* Nota: Si está en modo READ, deshabilitar formulario */
    if (this.modeSelected === this.eMode.READ) {
      this.form.disable();
    }
  }

  loadProduct(id: number) {
    this.apiService.getProductByID(id.toString()).subscribe({
      next: (data: any) => {
        this.form.controls['product'].patchValue(data.title);
        this.form.controls['description'].patchValue(data.body);
      },
      error: (error: any) => {
        this.showMSG(iToast.error, 'ERROR', error);
      },
    });
  }

  onSave() {
    if (this.form.valid) {
      const productData: iProduct = {
        title: this.form.controls['product'].value,
        body: this.form.controls['description'].value,
        userId: this.userId,
        id: this.id,
      };

      console.error(productData);

      if (this.modeSelected === this.eMode.CREATE) {
        this.apiService.createProduct(productData).subscribe({
          next: (response: any) => {
            this.ref.close(response);
          },
          error: (error: any) => {
            this.showMSG(iToast.error, 'ERROR', error);
          },
        });
      } else if (this.modeSelected === this.eMode.UPDATE) {
        this.apiService.updateProduct(productData, this.id).subscribe({
          next: (response: any) => {
            this.ref.close(response);
          },
          error: (error: any) => {
            this.showMSG(iToast.error, 'ERROR', error);
          },
        });
      }
    }
  }

  onClose() {
    this.ref.close();
  }

  showMSG(
    severityShow: 'success' | 'info' | 'warn' | 'error' | 'custom',
    title: string,
    detail: string,
    sticky: boolean = false
  ) {
    this.messageService.add({
      severity: severityShow,
      summary: title,
      key: 'toast',
      detail: detail,
      sticky: sticky,
    });
  }
}
