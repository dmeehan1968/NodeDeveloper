const request = require('request');

var getWeather = (lat, lng, callback) => {

  // https://api.darksky.net/forecast/fff633074dbbabd4169bf2f892f54346/51.0371175,-2.826742
  // fff633074dbbabd4169bf2f892f54346

  request({
    url: `https://api.darksky.net/forecast/fff633074dbbabd4169bf2f892f54346/${lat},${lng}`,
    json: true
  }, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        callback(undefined, {
          temperature: body.currently.temperature,
          apparentTemperature: body.currently.apparentTemperature
        });
      } else {
        callback('Unable to fetch weather');
      }
  });

};

module.exports = {
  getWeather
};
