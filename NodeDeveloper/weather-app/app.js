const request = require('request');

request({
  url: 'https://maps.googleapis.com/maps/api/geocode/json?address=1301%20lombard%20street%20philadelphia',
  json: true
}, (error, response, body) => {
  if (error) {
    console.log('Error:', error);
  } else {
      console.log(`Address: ${body.results[0].formatted_address}`);
      console.log(`Location: ${JSON.stringify(body.results[0].geometry.location, undefined, 2)}`);
  }
});
