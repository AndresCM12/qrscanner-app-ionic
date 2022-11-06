import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { AlertController, ModalController } from '@ionic/angular';
import { Registro } from 'src/app/models/registro.model';
import { DataLocalService } from 'src/app/services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('modal') modal;
  result = null;
  scanActive = false;
  nuevoRegistro: Registro;

  constructor(
    private alertController: AlertController,
    private dataLocal: DataLocalService
  ) {}

  ngAfterViewInit() {
    BarcodeScanner.prepare();
  }
  ngOnDestroy() {
    this.stopScanner();
    BarcodeScanner.stopScan();
  }
  async ngOnInit() {
    this.startScanner();
    const torch = await BarcodeScanner.getTorchState();
    console.log(torch, '-------- torch ---------');
  }

  scannQR() {
    this.startScanner();
  }

  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
      BarcodeScanner.hideBackground();
      this.scanActive = true;
      const result = await BarcodeScanner.startScan();
      if (result.content) {
        this.nuevoRegistro = this.dataLocal.guardarRegistro(
          result.format,
          result.content
        );
        await this.modal.present();
        BarcodeScanner.prepare();
        // this.result = result.content;
        //this.scanActive = false;
      }
    }
  }
  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        const alert = await this.alertController.create({
          header: 'Permission',
          message: 'Please enable the permission',
          buttons: [
            { text: 'No', role: 'cancel' },
            {
              text: 'Yes',
              handler: () => {
                resolve(false);
                BarcodeScanner.openAppSettings();
              },
            },
          ],
        });
      } else {
        resolve(false);
      }
    });
  }
  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }
  onClick() {
    this.modal.present();
  }
  openResource() {
    this.modal.dismiss();
    this.dataLocal.abrirRegistro(
      this.nuevoRegistro.content,
      this.nuevoRegistro.type
    );
  }
  onDismiss() {
    this.startScanner();
  }
}
