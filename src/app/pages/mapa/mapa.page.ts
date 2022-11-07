import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { IonModal, ModalController } from '@ionic/angular';

declare let mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  @ViewChild('modal') modal: IonModal;
  lat: number;
  lng: number;
  mapIsLoading = true;
  register;

  constructor(private navRouter: Router) {}

  async ngOnInit() {
    BarcodeScanner.stopScan();

    const data: any = this.navRouter.getCurrentNavigation().extras.state.geo;
    this.register = JSON.parse(
      this.navRouter.getCurrentNavigation().extras.state.fullRegister
    );
    const geo = data.substring(4);
    const geoArray = geo.split(',');

    this.lat = Number(geoArray[0]);
    this.lng = Number(geoArray[1].substring(0, 18));
    this.loadMap();
  }

  loadMap() {
    mapboxgl.accessToken =
      'pk.eyJ1IjoibWFsdGhlYWRhIiwiYSI6ImNsNmxqNnd5ejAzZXAzcXV4NXRxcXQ4eTUifQ.vndUP9Cmdl9FeXQSKtL_wA';

    const map = new mapboxgl.Map({
      style: 'mapbox://styles/maltheada/cla5ymd9r003415rtrr1p6tib',
      center: [this.lng, this.lat],
      zoom: 15.5,
      pitch: 45,
      bearing: -17.6,
      container: 'map',
      antialias: true,
    });

    map.on('load', () => {
      // Insert the layer beneath any symbol layer.
      map.resize();
      const customMarker = this.createCustomMarker();
      //marker
      const marker = new mapboxgl.Marker({
        color: '#7974ff',
        anchor: 'bottom',
        element: customMarker,
      })
        .setLngLat([this.lng, this.lat])
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        this.markerClicked();
      });

      const layers = map.getStyle().layers;

      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

      map.addLayer(
        {
          id: 'add-3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',

            // Use an 'interpolate' expression to
            // add a smooth transition effect to
            // the buildings as the user zooms in.
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      );

      this.mapIsLoading = false;
    });
  }

  goBack() {
    this.lat = 0;
    this.lng = 0;
    this.navRouter.navigate(['tabs', 'tab2']);
  }

  async markerClicked() {
    this.modal.present();
    console.log('Marker clicked');
  }

  createCustomMarker() {
    const customMarker = document.createElement('div');
    customMarker.style.backgroundImage = 'url(../../../assets/images/pin.svg)';
    customMarker.style.backgroundSize = 'cover';
    customMarker.style.backgroundPosition = 'center';
    customMarker.style.width = '27px';
    customMarker.style.height = '41px';
    return customMarker;
  }
}
