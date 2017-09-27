const utils = require('./utils');

it('should add two numbers', () => {
  var result = utils.add(33,11);
  if (result !== 44) {
    throw new Error(`expected 44, got ${result}`);
  }
});


it('should square a number', () => {
  var result = utils.square(8);
  if (result != 64) {
    throw new Error(`expected 64, got ${result}`);    
  }
})
