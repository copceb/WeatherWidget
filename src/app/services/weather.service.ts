import { Injectable } from '@angular/core';
import { HttpClient } from  "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // We must utilise a proxy to easily work around a CORS rejection from DarkSky, cors-anywhere is a free service that provides this.
  private corsProxy = 'https://cors-anywhere.herokuapp.com';
  // DarkSky API URL and Key (Ideally this should be kept private and not shared with the client)
  private darkSky = 'https://api.darksky.net/forecast/1a43d545710c14571dbbe87b13bad8c7';

  constructor(private http: HttpClient) { }

  public fetchWeatherReport(latitude, longitude) {
    this.http.get(`${this.corsProxy}/${this.darkSky}/${latitude},${longitude}`)
      .subscribe(
        data => {
          console.log("Weather data retrieved successfully ", data);
        },
        error => {
          console.log("An error while fetching error data", error);
        }
      );
  }
}
