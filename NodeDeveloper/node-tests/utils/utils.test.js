const expect = require('expect');
const utils = require('./utils');

describe('Utils', () => {

  it('should add two numbers', () => {
    var result = utils.add(33,11);
    expect(result).toBe(44).toBeA('number');
  });

  it('should async add two numbers', (done) => {

    utils.asyncAdd(3,4,(sum) => {

      expect(sum).toBe(7).toBeA('number');
      done();

    });
  });

  it('should square a number', () => {
    var result = utils.square(8);
    expect(result).toBe(64).toBeA('number');
  });

  it('should async square a number', (done) => {

      utils.asyncSquare(3, (square) => {

          expect(square).toBe(9).toBeA('number');
          done();

      });

  });

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
});
