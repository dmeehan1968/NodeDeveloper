// const yargs = require('yargs');
//
// const geocode = require('./geocode/geocode.js');
//
// const argv = yargs
//   .options({
//     a: {
//       demand: true,
//       alias: 'address',
//       describe: 'Address to fetch weather for',
//       string: true
//     }
//   })
//   .help()
//   .alias('help', 'h')
//   .argv;
//
// geocode.geocodeAddress(argv.address, (errorMessage, results) => {
//   if (errorMessage) {
//     console.log(errorMessage);
//   } else {
//     console.log(JSON.stringify(results, undefined, 2));
//   }
// });

// https://api.darksky.net/forecast/fff633074dbbabd4169bf2f892f54346/51.0371175,-2.826742
// fff633074dbbabd4169bf2f892f54346

const request = require('request');

request({
  url: "https://api.darksky.net/forecast/fff633074dbbabd4169bf2f892f54346/51.0371175,-2.826742",
  json: true
}, (error, response, body) => {
    if (error) {
      console.log(error);
    } else {
      console.log(body.currently.temperature);
    }
});
