var geocodeAddress = (address) => {
  return new Promise((resolve, reject) => {
    resolve({
      address: 'Dummy',
      latitude: 0,
      longitude: 0
    })
  });
};

geocodeAddress('19146').then((location) => {
  console.log(JSON.stringify(location, undefined, 2));
}, (errorMessage) => {
  console.log(errorMessage);
});
