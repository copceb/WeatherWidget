import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  public error: String;
  public loading: boolean = true;

  // Static coordinates until interactivity is achieved
  private latitude = 51.505909;
  private longitude = -0.023220;

  private weatherReport: Object = {};

  constructor(private weatherService: WeatherService) { }

  // Request weather data when the component loads
  ngOnInit(): void {
    this.refreshWeatherReport();
  }

  /**
   * Set error text to inform a user that an error has occurred, and cancel any loading indicators
   * @param error A message describind the error and necessary steps to the user
   */
  private handleError(error: String): void {
    this.error = error;
    this.loading = false;
  }

  public refreshWeatherReport(): void {
    this.loading = true;
    this.error = '';

    this.weatherService.fetchWeatherReport(this.latitude, this.longitude)
      .subscribe(
        data => {
          if (!data) { 
            this.handleError('Invalid coordinates provided.'); 
            return;
          }
          // console.log("Weather data retrieved successfully ", data);
          
          try {
            const valid = this.weatherService.validateWeatherResponse(data);
            if (!valid) {
              this.handleError('Received an invalid reponse from DarkSky API. Please try again later.');
              return;
            }

            const report = this.weatherService.formatWeatherResponse(data);

            this.weatherReport = report;
            this.error = '';
            this.loading = false;
          } catch (error) {
            this.handleError(error.message);
          }
        },
        error => {
          if (error.hasOwnProperty('error') && error.error.hasOwnProperty('error')) {
            this.handleError(error.error.error);
          } else {
            this.handleError('Sorry, an error occured while fetching the latest weather report. Please try again later.');
          }
          // console.log("An error occurred while fetching weather data", error);
        }
      );
  }

}
