const yargs = require('yargs');
const axios = require('axios');
const fs = require('fs');

const dataStore = 'app-promise.json';

const argv = yargs
  .options({
    a: {
      demand: false,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    },
    s: {
      demand: false,
      alias: 'save',
      describe: 'Address to save as default',
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

if (argv.save) {

  if (!argv.address) {
    console.log('Address must be specified with the --save option');
    return 0;
  }

  fs.writeFileSync(dataStore, JSON.stringify(argv.address));

  console.log('Address Saved');
  return 0;

} else {

  if (!argv.address) {

    try {

      argv.address = JSON.parse(fs.readFileSync(dataStore));

      console.log(`Using default address: ${argv.address}`);

    } catch (e) {
      if (e.code === 'ENOENT') {
        console.log('No default address has been saved');
        return 0;
      }
      console.log(e);
      return 0;
    }

  }
}

var encodedAddress = encodeURIComponent(argv.address);

var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl).then((response) => {
  if (response.data.status == 'ZERO_RESULTS') {
    throw new Error('Unable to find that address');
  }

  var lat = response.data.results[0].geometry.location.lat;
  var lng = response.data.results[0].geometry.location.lng;
  var weatherUrl = `https://api.darksky.net/forecast/fff633074dbbabd4169bf2f892f54346/${lat},${lng}`;

  console.log(response.data.results[0].formatted_address);

  return axios.get(weatherUrl);

}).then((response) => {

  var temperature = response.data.currently.temperature;
  var apparentTemperature = response.data.currently.apparentTemperature;
  var summary = response.data.currently.summary;

  console.log(`It's currently ${temperature}.  It feels like ${apparentTemperature} and its ${summary}`);

}).catch((e) => {
  if (e.code === 'ENOTFOUND') {
    console.log('Unable to connect to API servers');
  } else {
    console.log(e.message);
  }
});
