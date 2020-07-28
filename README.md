# WeatherWidget

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.4.

Tasks are marked using Git Tags.

## Installation

Clone the project OR download and extract a specific Task
```
git clone https://github.com/copceb/WeatherWidget.git
OR
Download and extract the Task 1 zip at https://github.com/copceb/WeatherWidget/archive/v1.zip
Download and extract the Task 2 zip at https://github.com/copceb/WeatherWidget/archive/v2.zip
```

Navigate into the project
```
cd WeatherWidget
```

Install Angular-CLI
```
npm install -g @angular/cli
```

Install Packages 
```
npm i
```

## Running the application

A development server can be started using Angular-CLI:
```
ng serve
```

The application will then be available within your browser at `http://localhost:4200/`

## Running tests

Karma/Jasmine tests for this project can be run with:
```
ng test
```

There have currently been no E2E Protractor tests written for this application, hwoever in future they may be ran using:
```
ng e2e
```

## Known Issues
* Task 3 was not completed.Therefore the location is static, and changeable only within the code (`weather.component.ts`).
* Icons are not displayed, instead only their non-user-friendly identifiers are.
* There is no programmatic relationship between the place name and the coordinates used to request the weather.
* The results do not update after an interval, manual refresh is necessary.
* The free proxy (See CORS Proxy below) used in this project throttles speeds significantly, which can lead to long wait times.
* Minimal design effort has been implemented, other than the responsive grid. 

## Opportunities for further development

### Improved testing
Test coverage within this project is limited, and has been completed only for the core of the application; Karma/Jasmine unit tests for `weather.service.ts`. Before further development takes place, time must be spent refining and extending these existing tests, as well as creation of additional unit testing for the weather component functionality, and Protractor End to End testing.

### Conversion to an Angular library
The nature of this project lends itself to being a reusable weather component, however this Angular project is a very heavyweight solution. One approach to make this easier to integrate as a widget etc would be to convert the weather component and service files into a distributable Angular library, as demonstrated in the official [documentation](https://angular.io/guide/creating-libraries).

### Improved functionality and usability
As previously discussed, this project does not meet the functionality requirements of Task 3. As a result, the usefulness of the application is extremely limited. For this application to be of value, a searchable location list should be implemented, ideally by using a searchable API such as Google Maps or custom solution by mapping the provided `cities.json` into a database/api service to avoid passing heavy download and searching operations on the client in such a large dataset. 

When searching for locations, it would also be benefial to cache the previously selected location so that it can be automatically loaded if/when the user chooses to revisit the application.

The design and user experience can be improved significantly, most simply by the introduction of weather icons and the use of an open UI framework such as VMware's [Project Clarity](https://clarity.design/), which would standardise some behaviour and support adherance to best design practices.

### Extendability
The type of data displayed to the data is currently rigid, displaying only the fields requested in the example application. From a user's perpective it would be beneficial to allow more information from the DarkSky API to be displayed in the UI, such as sunrise and sunset times. This would require an additional interface for the user to manage these preferences, and less rigid JSON validity checking when retrieving the data.

### CORS Proxy
Requests to DarkSky API from the browser when using localhost were rejected due to the CORS policy in place. To circumvent this the popular [free proxy](https://cors-anywhere.herokuapp.com) has been used. Given more time, a basic Node.js server would have been able to act as a proxy to modify the necessary headers before sending our api requests to DarkSky.

### Server
Currently the project only runs via ng serve, a development web server that is not production ready. The application should instead be run using a scalable, stable web server, perhaps based in Node.js. This server could also provide the CORS Proxy described above.

### Tooling
There is no CI pipeline established for this testing, nor packages such as Husky to ensure test adherence and linting. In a production setting, the development and integration environment should have such tooling in place to minimise errors and ensure best practices.
