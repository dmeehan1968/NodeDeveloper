const expect = require('expect');
const utils = require('./utils');

it('should add two numbers', () => {
  var result = utils.add(33,11);
  expect(result).toBe(44);
});


it('should square a number', () => {
  var result = utils.square(8);
  expect(result).toBe(64);
});
