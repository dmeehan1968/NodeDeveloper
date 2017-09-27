const utils = require('./utils');

it('should add two numbers', () => {
  var result = utils.add(33,11);
  if (result !== 44) {
    throw new Error(`expected 44, got ${result}`);    
  }
});
