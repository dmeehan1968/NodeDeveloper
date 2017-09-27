const expect = require('expect');
const utils = require('./utils');

it('should add two numbers', () => {
  var result = utils.add(33,11);
  expect(result).toBe(44).toBeA('number');
});


it('should square a number', () => {
  var result = utils.square(8);
  expect(result).toBe(64).toBeA('number');
});

// it('should expect some values', () => {
//
//   // expect({ name: 'Andrew' }).toEqual({ name: 'Andrew' });
//   // expect({ name: 'Andrew', age: 44, location: 'London' }).toInclude({age: 44});
//
// });

it('should verify first and last names are set', () => {

  var user = {
    age: 25,
    location: 'London'
  };

  user = utils.setName(user, 'Dave Meehan');

  expect(user)
    .toBeA('object')
    .toInclude({ firstName: 'Dave' })
    .toInclude({ lastName: 'Meehan' });

});
