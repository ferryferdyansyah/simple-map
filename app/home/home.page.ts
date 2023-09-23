import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import { Geolocation } from '@capacitor/geolocation';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

import Basemap from '@arcgis/core/Basemap'
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery.js';
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol.js';

// import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;
  // basemapToggle: BasemapToggle | any;
  basemapGallery: BasemapGallery | any;
  // multiPoint: Multipoint | any;

  constructor() {}

  private latitude!: number;
  private longitude!: number;

  public async ngOnInit() {
    // const position = await Geolocation.getCurrentPosition();
    // console.log(position)
    // this.latitude = position.coords.latitude;
    // this.longitude = position.coords.longitude;

    // this.latitude = 111.36080008039461;
    // this.longitude = -7.1509738195120685;
    // -7.1509738195120685, 111.36080008039461

    // Membuat objek Map
    const map = new Map({
      basemap: 'topo-vector',
    });

    // Membuat tampilan peta
    this.mapView = new MapView({
      container: 'container',
      map: map,
      zoom: 4,
    });

    // Menambahkan BasemapGallery
    const basemapGallery = new BasemapGallery({
      view: this.mapView,
    });

    this.mapView.ui.add(basemapGallery, 'top-right');

    // Cuaca API
    const weatherServiceUrl =
      'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer';

    let weatherServiceFL = new ImageryLayer({ url: weatherServiceUrl });
    map.add(weatherServiceFL);

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);

    // Tambahkan koordinat kedua secara manual
    const manualCoordinates = [41.140502400143866, -112.85745675317911];

    // Buat marker kedua dengan koordinat manual
    const manualLocationGraphic = new Graphic({
      symbol: new SimpleMarkerSymbol({style: 'diamond', color: 'yellow', size:'20px'}),
      geometry: new Point({
        latitude: manualCoordinates[0],
        longitude: manualCoordinates[1],
      }),
    });
    this.mapView.graphics.add(manualLocationGraphic);
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latlng = await this.getLocationService();
    let geom = new Point({ latitude: latlng[0], longitude: latlng[1] });
    // let geom1 = new Multipoint({
    //   points: [[], []]
    // })

    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
        symbol: new PictureMarkerSymbol({
          url: '../../assets/s3.png',
          width: "22px",
          height: "22px"
        }),
        geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }
}
