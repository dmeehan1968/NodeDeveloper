// http://api.fixer.io/latest?base=USD
// https://restcountries.eu/rest/v2/currency/CAD

'use strict';

const axios = require('axios');

const getExchangeRate = async (from, to) => {

  try {

    const response = await axios.get(`http://api.fixer.io/latest?base=${from}`);

    if (!response.data.rates[to]) {
      throw new Error(`No rate available to convert from ${from} to ${to}`);
    }
    return response.data.rates[to];

  } catch(e) {

    throw new Error(`Unable to get exchange rate for ${from} to ${to}`);

  };

};

const getCountries = async (code) => {

  try {

    const response = await axios.get(`https://restcountries.eu/rest/v2/currency/${code}`);
    return response.data.map((country) => country.name);

  } catch(e) {

      throw new Error(`Unable to get countries that use ${code}`);

  };

};

const convertCurrency = async (from, to, amount) => {

  const countries = await getCountries(to);
  const rate = await getExchangeRate(from, to);
  const exchangedAmount = amount * rate;
  return `${amount} ${from} is worth ${exchangedAmount} in ${to}. ${to} can be used in the following countries: ${countries.join(', ')}`;

};

convertCurrency('USD', 'EUR', 100).then((status) => {
  console.log(status);
}).catch((e) => {
  console.log(e.message);
});
