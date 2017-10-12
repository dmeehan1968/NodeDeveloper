// http://api.fixer.io/latest?base=USD
// https://restcountries.eu/rest/v2/currency/CAD

const axios = require('axios');

const getExchangeRate = (from, to) => {

  return axios
    .get(`http://api.fixer.io/latest?base=${from}`)
    .then((res) => res.data.rates[to]);

};

const getCountries = (code) => {

  return axios
    .get(`https://restcountries.eu/rest/v2/currency/${code}`)
    .then((res) => res.data.map((country) => country.name));

};

const convertCurrency = (from, to, amount) => {

  let countries;

  return getCountries(to)
    .then((tempCountries) => {
      countries = tempCountries;
      return getExchangeRate(from, to);
    })
    .then((rate) => {
      const exchangedAmount = amount * rate;
      return `${amount} ${from} is worth ${exchangedAmount} in ${to}. ${to} can be used in the following countries: ${countries.join(', ')}`;
    });
};

// getExchangeRate('USD', 'CAD').then((rate) => {
//   console.log(rate);
// });
//
// getCountries('USD').then((countries) => {
//   console.log(countries);
// });

convertCurrency('USD', 'CAD', 100).then((status) => {
  console.log(status);
})
