import { Injectable } from '@angular/core';
import { HttpClient } from  "@angular/common/http";
import { of, Observable } from 'rxjs';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  // We must utilise a proxy to easily work around a CORS rejection from DarkSky, cors-anywhere is a free service that provides this.
  private corsProxy = 'https://cors-anywhere.herokuapp.com';
  // DarkSky API URL and Key (Ideally this should be kept private and not shared with the client)
  private darkSky = 'https://api.darksky.net/forecast/1a43d545710c14571dbbe87b13bad8c7';

  private daysToDisplay: number = 7;

  constructor(private http: HttpClient) { }

  public fetchWeatherReport(latitude: number, longitude: number): Observable<any> {
    if (latitude < -90 || latitude > 90) return of(false);
    if (longitude < -180  || longitude > 180) return of(false);

    return this.http.get(`${this.corsProxy}/${this.darkSky}/${latitude},${longitude}`, {headers: {'X-Requested-With' :'XMLHttpRequest'}});
  }
  
  public validateWeatherResponse(response: object): boolean {
    // Ensure the response has all keys required to determine current weather
    if (response.hasOwnProperty('currently')) {

      const currentRequiredKeys = [ 'time', 'icon', 'temperature', 'precipProbability', 'windSpeed', 'humidity' ];
      for (let i = 0; i < currentRequiredKeys.length; i++) {
        if (!response['currently'].hasOwnProperty(currentRequiredKeys[i])) {
          // console.log("Unable to determine current value for ", currentRequiredKeys[i]);
          return false;
        }
      };
    } else {
      return false;
    }

    // Ensure the response has all keys required to determine forecasted weather
    if (response.hasOwnProperty('daily')) {
      // There must be daily data available
      if (response['daily']['data'].length < this.daysToDisplay) return false;

      const dailyRequiredKeys = [ 'time', 'icon', 'temperatureHigh', 'temperatureLow' ];
      for (let i = 0; i < dailyRequiredKeys.length; i++) {
        for (let x = 0; x < this.daysToDisplay; x++) {
          if (!response['daily']['data'][x].hasOwnProperty(dailyRequiredKeys[i])) {
            // console.log("Unable to determine forecasted value for ", dailyRequiredKeys[i]);
            return false;
          }
        }
      };
    } else {
      return false;
    }

    return true;
  }

  public formatWeatherResponse(response: object): object {

    let weatherReport = {};

    weatherReport['current'] = response['currently'];
    weatherReport['current']['day'] = moment.unix(weatherReport['current']['time']).format('ddd');
    
    weatherReport['current']['iconClass'] = this.getIconClass(weatherReport['current']['icon']);

    weatherReport['current']['temperatureHigh'] = response['daily']['data'][0]['temperatureHigh'];
    weatherReport['current']['temperatureLow'] = response['daily']['data'][0]['temperatureLow'];

    weatherReport['week'] = response['daily']['data'].slice(0, this.daysToDisplay);

    for (let i = 0; i < weatherReport['week'].length; i++) {
      const dayName = moment.unix(weatherReport['week'][i]['time']).format('ddd');
      weatherReport['week'][i]['day'] = dayName;

      weatherReport['week'][i]['iconClass'] = this.getIconClass(weatherReport['week'][i]['icon']);
    }

    // console.log('Trimmed data structure: ', weatherReport);

    return weatherReport;
  }

  /**
   * Map DarkSky icon identifer to Erik Flowers Weather Icon class name
   * @param weatherType icon name related to weather scenario provided by DarkSky
   */
  private getIconClass(weatherType: string): string {
    // Initialise icon as N/A symbol for default option
    let icon = 'wi-na';

    // DarkSky icon names from https://darksky.net/dev/docs
    // Icon classes from https://erikflowers.github.io/weather-icons/

    switch(weatherType) {
      case 'clear-day':
        return 'wi-day-sunny';
      case 'clear-night':
        return 'wi-night-clear';
      case 'rain':
        return 'wi-rain';
      case 'snow':
        return 'wi-snow';
      case 'sleet':
        return 'wi-sleet';
      case 'wind':
        return 'wi-windy';
      case 'fog':
        return 'wi-fog';
      case 'cloudy':
        return 'wi-cloudy';
      case 'partly-cloudy-day':
        return 'wi-day-cloudy';
      case 'partly-cloudy-night':
        return 'wi-night-alt-cloudy';
      default:
        return 'wi-na';
    }
  }

}
