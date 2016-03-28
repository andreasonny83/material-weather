var findMe = (function(document, undefined) {
  'use strict';

  var module = {
    init: init
  };

  // private scope
  var privates = {};

  return module.init;

  /**
   * Initialize all the module variables
   *
   * @return {Function} Return the localization service
   */
  function init() {
    privates.async = true;

    privates.response = null;

    privates.domLocation = document.getElementById('location');
    privates.domConditions = document.getElementById('conditions');
    privates.domIcon = document.getElementById('icon');
    privates.domTemp = document.getElementById('temp');
    privates.domHumidity = document.getElementById('humidity');
    privates.domPressure = document.getElementById('pressure');
    privates.domWind = document.getElementById('wind');

    privates.domIconImage = new Image();

    privates.weather = {};

    return findMe();
  }

  /**
   * get weather based on geo loccation
   *
   * @param  {Int} lat  Client latitute position
   * @param  {Int} long Client longitude position
   */
  function getWeather(lat, long) {
    // API url that will provide the weather information based on a geolocation
    privates.url = 'http://api.openweathermap.org/data/2.5/weather?lat=' +
      lat + '&lon=' + long +
      '&units=metric' +
      '&APPID=d4fce064e762e5b59552f4bc61ceabe5';

    privates.xhr = new XMLHttpRequest();

    privates.xhr.open('GET', privates.url, privates.async);
    privates.xhr.setRequestHeader('Accept', 'application/json');
    privates.xhr.send();

    function processWeatherRequest() {
      if (privates.xhr.readyState === 4 &&
        privates.xhr.status === 200) {
        privates.response = JSON.parse(privates.xhr.responseText);

        privates.weather.icon = 'http://openweathermap.org/img/w/' +
          privates.response.weather[0].icon + '.png';
        privates.weather.cond = privates.response.weather[0].main +
          ', ' + privates.response.weather[0].description;

        privates.weather.temp = privates.response.main.temp +
          '&#8451;' || 'N/A';

        privates.weather.wind = privates.response.wind.speed +
          'Km/h' || 'N/A';

        privates.weather.humidity = privates.response.main.humidity +
          '&#37;' || 'N/A';

        privates.weather.pressure = privates.response.main.pressure +
          'Pa' || 'N/A';

        // Inject the weather icon into the DOM
        privates.domIcon.innerHTML = '';
        privates.domIcon.appendChild(privates.domIconImage);
        privates.domIconImage.src = privates.weather.icon;

        // Inject the other weather information into the DOM
        privates.domConditions.innerHTML = privates.weather.cond;
        privates.domTemp.innerHTML = privates.weather.temp;
        privates.domHumidity.innerHTML = privates.weather.humidity;
        privates.domPressure.innerHTML = privates.weather.pressure;
        privates.domWind.innerHTML = privates.weather.wind;
      }
    }

    privates.xhr.addEventListener(
      'readystatechange',
      processWeatherRequest,
      false
    );
  }

  /**
   * Find user geo location using IP address
   */
  function findMe() {
    var location = '';

    // API url for getting user geo information based on its IP address
    privates.url = 'http://ip-api.com/json';

    privates.xhr = new XMLHttpRequest();

    privates.xhr.open('GET', privates.url, privates.async);
    privates.xhr.send();

    function processRequest() {
      if (privates.xhr.readyState === 4 &&
          privates.xhr.status === 200) {
        privates.response = JSON.parse(privates.xhr.responseText);

        location = [
          privates.response.city,
          privates.response.regionName,
          privates.response.country,
        ].join(', ');

        // Inject the client position into the DOM
        privates.domLocation.innerHTML = location;

        // Ask for weather information based on client geolocation
        getWeather(privates.response.lat, privates.response.lon);
      }
    }

    privates.xhr.addEventListener(
      'readystatechange',
      processRequest,
      false
    );
  }
}(document));
