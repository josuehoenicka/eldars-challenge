import { eModeCRUD } from '../../../common/enums/eModeCRUD';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { iProduct } from '../../interfaces/iProduct';
import { AuthService } from '../../../auth/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { iToast } from '../../../common/interfaces/iToast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FormComponent } from '../../../common/components/form/form.component';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { SplitButtonModule } from 'primeng/splitbutton';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [
    RouterLink,
    TableModule,
    ButtonModule,
    ConfirmPopupModule,
    CommonModule,
    TooltipModule,
    ToastModule,
    FormsModule,
    DialogModule,
    SplitButtonModule,
  ],
  providers: [
    MessageService,
    ConfirmationService,
    DynamicDialogRef,
    DialogService,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  /* Enums */
  public eMode = eModeCRUD;
  modeSelected!: eModeCRUD;

  /* Numbers */
  userId: number = 1;

  /* Booleans */
  isAdmin!: boolean;
  loading: boolean = false;

  /* Arrays */
  posts: iProduct[] = [];

  /* Any */
  globalFilterValue!: any;

  constructor(
    readonly apiService: ApiService,
    readonly authService: AuthService,
    readonly messageService: MessageService,
    public dialogRef: DynamicDialogRef,
    readonly dialogService: DialogService,
    readonly ref: DynamicDialogRef,
    readonly router: Router,
    readonly confirmationService: ConfirmationService
  ) {}

  displayDialog: boolean = false;

  openConfirmationDialog() {
    this.displayDialog = true;
  }

  onConfirm() {
    this.displayDialog = false;
  }

  onCancel() {
    this.displayDialog = false;
    this.authService.logout();
    this.router.navigate(['login']);
  }

  async ngOnInit() {
    this.loading = true;
    this.isAdmin = this.authService.isAdmin();
    await this.getProducts();
    if (this.isAdmin) this.openConfirmationDialog();
    this.loading = false;
  }

  async getProducts(newProduct?: any, mode?: eModeCRUD) {
    console.error('mode: ', mode);
    this.apiService.getProducts().subscribe({
      next: (res: any) => {
        if (mode === undefined) {
          this.posts = res;
          return;
        }

        switch (mode) {
          case this.eMode.CREATE:
            this.posts = [newProduct, ...res];
            break;

          case this.eMode.UPDATE: {
            const index = this.posts.findIndex(
              (product) => product.id === newProduct.id
            );
            if (index !== -1) {
              this.posts[index] = newProduct;
            }
            break;
          }
        }
      },
      error: (error: any) => {
        this.showMSG(iToast.error, 'ERROR', error);
      },
    });
  }

  openDialog(mode: eModeCRUD, id?: number, event?: any) {
    switch (mode) {
      case this.eMode.CREATE:
        this.dialogRef = this.dialogService.open(FormComponent, {
          header: `Agregar producto`,
          width: '80vw',
          contentStyle: {
            padding: '2em',
            overflow: 'auto',
            appendTo: 'body',
          },
          baseZIndex: 10000,
          data: {
            id: id,
            MODE: mode,
            userId: this.userId,
          },
        });
        this.dialogRef.onClose.subscribe((result: any) => {
          if (result) {
            console.error(result);
            this.showMSG(iToast.success, 'OK', '¡Producto agregado con éxito!');
            this.getProducts(result, this.eMode.CREATE);
          }
        });
        break;
      case this.eMode.UPDATE:
        this.dialogRef = this.dialogService.open(FormComponent, {
          header: `Producto N° ${id}`,
          width: '80vw',
          contentStyle: {
            padding: '2em',
            overflow: 'auto',
            appendTo: 'body',
          },
          baseZIndex: 10000,
          data: {
            id: id,
            MODE: mode,
            userId: this.userId,
          },
        });
        this.dialogRef.onClose.subscribe((result: any) => {
          if (result) {
            console.error(result);
            this.showMSG(iToast.success, 'OK', '¡Producto guardado con éxito!');
            this.getProducts(result, this.eMode.UPDATE);
          }
        });
        break;
      case this.eMode.READ:
        this.dialogRef = this.dialogService.open(FormComponent, {
          header: `Producto N° ${id}`,
          width: '80vw',
          contentStyle: {
            padding: '2em',
            overflow: 'auto',
            appendTo: 'body',
          },
          baseZIndex: 10000,
          data: {
            id: id,
            MODE: mode,
            userId: this.userId,
          },
        });
        break;
      case this.eMode.DELETE:
        this.confirmationService.confirm({
          target: event.target,
          message: '¿Estás seguro/a de eliminar el producto?',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Sí',
          accept: () => {
            this.apiService.deleteProduct(id).subscribe({
              next: (response: any) => {
                this.showMSG(
                  iToast.success,
                  'OK',
                  '¡Producto eliminado con éxito!'
                );
                this.posts = this.posts.filter((product) => product.id !== id);
              },
              error: (error: any) => {
                this.showMSG(iToast.error, 'ERROR', 'error');
              },
            });
          },
          reject: () => {},
        });
        break;
    }
  }

  cleanFilters(input: HTMLInputElement, table: any) {
    input.value = '';
    table.reset();
  }

  exportToExcel() {
    const exportData = this.posts.map((post) => ({
      Producto: post.title,
      Descripción: post.body,
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };

    XLSX.writeFile(workbook, 'PRODUCTOS.xlsx');
  }

  exportToPDF() {
    const doc = new jsPDF();
    const col = ['Producto', 'Descripción'];
    const rows: any[] = [];

    this.posts.forEach((post) => {
      const temp = [post.title, post.body];
      rows.push(temp);
    });

    const img = new Image();
    img.src = '/eldar.png';

    img.onload = () => {
      const imgWidth = 187;
      const imgHeight = (img.height * imgWidth) / img.width;

      doc.setFillColor(63, 83, 102);
      doc.rect(10, 10, imgWidth, imgHeight, 'F');

      doc.addImage(img, 'PNG', 10, 10, imgWidth, imgHeight);

      autoTable(doc, {
        head: [col],
        body: rows,
        startY: imgHeight + 20,
        headStyles: {
          fillColor: [63, 83, 102],
          textColor: [255, 255, 255],
        },
      });

      doc.save('PRODUCTOS.pdf');
    };
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
