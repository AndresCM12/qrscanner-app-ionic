/* eslint-disable no-underscore-dangle */
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Registro } from '../models/registro.model';
import { Browser } from '@capacitor/browser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class DataLocalService {
  guardados: Registro[] = [];

  constructor(private storage: Storage, private router: Router) {
    this.initStorage();
    this.cargarStorage();
  }

  guardarRegistro(format: string, content: string) {
    const nuevoRegistro = new Registro(format, content);
    this.guardados.unshift(nuevoRegistro);
    this.guardarStorage();

    return nuevoRegistro;
  }

  async initStorage() {
    const storage = await this.storage.create();
    this.storage = storage;
  }

  async guardarStorage() {
    await this.storage.set('guardados', this.guardados);
  }

  cargarStorage() {
    this.storage.get('guardados').then((registros) => {
      this.guardados = registros || [];
    });
  }

  async abrirRegistro(content, type, fullRegister) {
    const fullRegisterDecoded = JSON.stringify(fullRegister);
    switch (type) {
      case 'http':
        await Browser.open({ url: content });
        break;
      case 'geo':
        this.router.navigate(['tabs', 'tab2', 'mapa'], {
          state: { geo: content, fullRegister: fullRegisterDecoded },
        });
    }
  }

  deleteRegister(registroId: Date) {
    this.guardados = this.guardados.filter((registros) => {
      const a = registroId !== registros.created;
      return registroId !== registros.created;
    });

    this.guardarStorage();
  }
}
