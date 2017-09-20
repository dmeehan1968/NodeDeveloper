console.log('Starting app');

setTimeout(() => {
  console.log('Inside of callback');
}, 2000);

setTimeout(() => {
  console.log('Zero delay of callback');
}, 0);

console.log('Finishing up');
