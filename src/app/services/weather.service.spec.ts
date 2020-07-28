import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { WeatherService } from './weather.service';
import { Observable } from 'rxjs';

describe('WeatherService', () => {  
  let httpMock: HttpTestingController;
  let service: WeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [ HttpClientTestingModule ]});
    service = TestBed.inject(WeatherService);
    httpMock = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('#fetchWeatherReport() should return false if passed invalid coordinates', (done) => {
    const latitude = 9999;
    const longitude = -9999;

    const mockData = {};

    service.fetchWeatherReport(latitude, longitude).subscribe(data => {
      expect(data).toBe(false);
      done();
    });
  });

  it('#fetchWeatherReport() should resolve as an observable', () => {
    const latitude = 51.505909;
    const longitude = -0.023220;

    const mockData = {};

    const fetchWeatherReport = service.fetchWeatherReport(latitude, longitude);
    expect(fetchWeatherReport).toEqual(jasmine.any(Observable));
  });

  it('#fetchWeatherReport() observable should resolve to object', () => {
    const latitude = 51.505909;
    const longitude = -0.023220;

    const mockData = {};

    service.fetchWeatherReport(latitude, longitude).subscribe(report => {
      expect(report).toEqual(jasmine.any(Object));
    });

    const req = httpMock.expectOne('https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/1a43d545710c14571dbbe87b13bad8c7/51.505909,-0.02322');

    req.flush(mockData);

    httpMock.verify();
  });

  it('#validateWeatherResponse() should return false if passed an incomplete weather report', () => {
    const invalidReport = {
      daily: {
        data: [{
          time: 1596150000,
          icon: 'rain',
          temperatureHigh: 24,
          temperatureLow: 15
        }]
      }
    };
    const result = service.validateWeatherResponse(invalidReport);

    expect(result).toBe(false);
  });

  it('#validateWeatherResponse() should return true if passed a complete weather report', () => {
    const validReport = {
      currently:{
        humidity: 0.47,
        icon: "partly-cloudy-day",
        precipProbability: 0,
        temperature: 64.82,
        time: 1595963789,
        windSpeed: 9.97,
      },
      daily: {
        data: [
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
        ]
      }
    };
    const result = service.validateWeatherResponse(validReport);

    expect(result).toBe(true);
  });

  it('#formatWeatherResponse() should convert daily unix timestamps into identifiable day strings', () => {
    const validReport = {
      currently:{
        humidity: 0.47,
        icon: "partly-cloudy-day",
        precipProbability: 0,
        temperature: 64.82,
        time: 1595963789,
        windSpeed: 9.97,
      },
      daily: {
        data: [
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
        ]
      }
    };
    const result = service.formatWeatherResponse(validReport);

    const currentDayInWeek = result['week'][0]['day'];

    expect(currentDayInWeek).toBe('Fri');
  });

  it('#formatWeatherResponse() should assign the current temperateHigh and temperatureLow values based on the daily values', () => {
    const validReport = {
      currently:{
        humidity: 0.47,
        icon: "partly-cloudy-day",
        precipProbability: 0,
        temperature: 64.82,
        time: 1595963789,
        windSpeed: 9.97,
      },
      daily: {
        data: [
          { time: 1596150000, icon: 'rain', temperatureHigh: 24, temperatureLow: 15 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 32, temperatureLow: 11 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 27, temperatureLow: 18 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 26, temperatureLow: 16 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 31, temperatureLow: 28 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 29, temperatureLow: 19 },
          { time: 1596150000, icon: 'rain', temperatureHigh: 23, temperatureLow: 17 },
        ]
      }
    };
    const result = service.formatWeatherResponse(validReport);

    const temperatureHigh = result['current']['temperatureHigh'];
    const temperatureLow = result['current']['temperatureLow'];

    expect(temperatureHigh).toBe(24);
    expect(temperatureLow).toBe(15);
  });

});
