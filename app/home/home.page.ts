import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView'
import { Geolocation } from '@capacitor/geolocation';

// import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer';
// import Graphic from '@arcgis/core/Graphic';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  constructor() {}

  private latitude!: number;
  private longitude!: number;

  public async ngOnInit() {
      // throw new Error("Method not implemented")
      // -7.275044887844678, 112.65396540810508

      // const position = await Geolocation.getCurrentPosition();
      // console.log(position)
      // this.latitude = position.coords.latitude;
      // this.longitude = position.coords.longitude;

      this.latitude = -7.3634684;
      this.longitude = 112.7059243;

      const map = new Map({
        basemap: "streets-night-vector"
      });

      const view = new MapView({
        container: "container",
        map: map,
        zoom: 10,
        center: [this.longitude, this.latitude]
      })
  }

}
