import { Component } from '@angular/core';
import { Registro } from 'src/app/models/registro.model';
import { DataLocalService } from 'src/app/services/data-local.service';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
})
export class Tab2Page {
  constructor(public dataLocal: DataLocalService) {
    BarcodeScanner.stopScan();
  }
  enviarCorreo() {}

  abrirRegistro(registro: Registro) {}

  deleteIteme(registro) {
    this.dataLocal.deleteRegister(registro.created);
  }

  share() {}

  openItem(registro: Registro) {
    this.dataLocal.abrirRegistro(registro.content, registro.type, registro);
  }
}
