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

const convertCurrency = async (from, to, amount) => {

  const countries = await getCountries(to);
  const rate = await getExchangeRate(from, to);
  const exchangedAmount = amount * rate;
  return `${amount} ${from} is worth ${exchangedAmount} in ${to}. ${to} can be used in the following countries: ${countries.join(', ')}`;

  // return getCountries(to)
  //   .then((tempCountries) => {
  //     countries = tempCountries;
  //     return getExchangeRate(from, to);
  //   })
  //   .then((rate) => {
  //     const exchangedAmount = amount * rate;
  //     return `${amount} ${from} is worth ${exchangedAmount} in ${to}. ${to} can be used in the following countries: ${countries.join(', ')}`;
  //   });
};

convertCurrency('CAD', 'USD', 100).then((status) => {
  console.log(status);
})
