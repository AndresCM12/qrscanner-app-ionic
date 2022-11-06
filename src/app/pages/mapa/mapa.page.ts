import {
  AfterContentInit,
  AfterViewInit,
  Component,
  OnChanges,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

declare let mapboxgl: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
})
export class MapaPage implements OnInit {
  lat: number;
  lng: number;
  constructor(private navRouter: Router) {}

  async ngOnInit() {
    BarcodeScanner.stopScan();

    const data: any = this.navRouter.getCurrentNavigation().extras.state.geo;
    const geo = data.substring(4);
    const geoArray = geo.split(',');

    this.lat = Number(geoArray[0]);
    this.lng = Number(geoArray[1].substring(0, 18));
    this.loadMap();
  }
  loadMap() {
    console.log(' ------- cargando mapa -------');
    mapboxgl.accessToken =
      'pk.eyJ1IjoibWFsdGhlYWRhIiwiYSI6ImNsNmxqNnd5ejAzZXAzcXV4NXRxcXQ4eTUifQ.vndUP9Cmdl9FeXQSKtL_wA';
    const map = new mapboxgl.Map({
      style: 'mapbox://styles/mapbox/light-v10',
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

      //marker
      new mapboxgl.Marker().setLngLat([this.lng, this.lat]).addTo(map);

      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === 'symbol' && layer.layout['text-field']
      ).id;

      // The 'building' layer in the Mapbox Streets
      // vector tileset contains building height data
      // from OpenStreetMap.
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
    });
  }
  goBack() {
    this.lat = 0;
    this.lng = 0;
    this.navRouter.navigate(['tabs', 'tab2']);
  }
}
